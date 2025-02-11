<template>
  <div class="market-page">
    <div class="container">
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索NFT"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-form :inline="true">
          <!-- 藏品类型 -->
          <el-form-item label="藏品类型">
            <el-radio-group v-model="filterForm.nftType" @change="handleFilter">
              <el-radio-button label=""> 全部 </el-radio-button>
              <el-radio-button label="original"> 原创 </el-radio-button>
              <el-radio-button label="derivative"> 衍生 </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <!-- 交易类型 -->
          <el-form-item label="交易类型">
            <el-radio-group
              v-model="filterForm.tradeType"
              @change="handleFilter"
            >
              <el-radio-button label=""> 全部 </el-radio-button>
              <el-radio-button label="transfer"> 转让 </el-radio-button>
              <el-radio-button label="authorize"> 授权 </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <!-- 价格范围 -->
          <el-form-item label="价格范围">
            <div class="price-range">
              <el-input-number
                v-model="filterForm.minPrice"
                :min="0"
                :max="filterForm.maxPrice || 100000"
                controls-position="right"
                placeholder="最低价"
                @change="handleFilter"
              />
              <span class="separator">-</span>
              <el-input-number
                v-model="filterForm.maxPrice"
                :min="filterForm.minPrice || 0"
                :max="100000"
                controls-position="right"
                placeholder="最高价"
                @change="handleFilter"
              />
            </div>
          </el-form-item>

          <!-- 授权范围 -->
          <el-form-item label="授权范围">
            <el-popover
              v-model:visible="authScopeVisible"
              placement="bottom"
              :width="240"
              trigger="click"
            >
              <template #reference>
                <el-button>
                  {{ getSelectedAuthScopes }}
                  <el-icon class="el-icon--right">
                    <ArrowDown />
                  </el-icon>
                </el-button>
              </template>

              <div class="auth-scope-popover">
                <el-checkbox-group v-model="filterForm.authScopes">
                  <el-checkbox
                    v-for="item in authScopeOptions"
                    :key="item.value"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>

                <div class="popover-footer">
                  <el-button size="small" @click="clearAuthScopes">
                    清空
                  </el-button>
                  <el-button
                    type="primary"
                    size="small"
                    @click="confirmAuthScopes"
                  >
                    确定
                  </el-button>
                </div>
              </div>
            </el-popover>
          </el-form-item>
        </el-form>
      </div>

      <!-- 排序区域 -->
      <div class="sort-section">
        <el-radio-group v-model="sortType" @change="handleSort">
          <el-radio-button value="latest"> 最新 </el-radio-button>
          <el-radio-button value="price"> 价格 </el-radio-button>
          <el-radio-button value="popular"> 最热 </el-radio-button>
        </el-radio-group>

        <el-switch
          v-model="sortOrder"
          active-text="升序"
          inactive-text="降序"
          @change="handleSort"
        />
      </div>

      <!-- NFT列表 -->
      <div v-loading="loading" class="nft-grid">
        <NFTCard v-for="nft in nftList" :key="nft.id" :nft="nft" />
        <el-empty
          v-if="!loading && nftList.length === 0"
          description="暂无NFT"
        />
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[12, 24, 36, 48]"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from "vue";
import { Search, ArrowDown } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import NFTCard from "@/components/NFTCard.vue";
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import { useListStore } from "@/store/modules/list";

// 授权范围选项
const authScopeOptions = [
  { label: "商业使用", value: "commercial" },
  { label: "衍生创作", value: "derivative" },
  { label: "展览展示", value: "exhibition" },
  { label: "广告宣传", value: "advertising" },
];

const route = useRoute();
const router = useRouter();

const listStore = useListStore();

// 搜索表单
const searchForm = reactive({
  keyword: route.query.keyword || "",
});

// 筛选表单
const filterForm = reactive({
  minPrice: null,
  maxPrice: null,
  nftType: route.query.nftType || "",
  tradeType: "",
  authScopes: [],
});

// 排序相关
const sortType = ref("latest");
const sortOrder = ref(false);

// 授权范围弹窗控制
const authScopeVisible = ref(false);

// 计算已选授权范围
const getSelectedAuthScopes = computed(() => {
  if (filterForm.authScopes.length === 0) return "选择授权范围";
  if (filterForm.authScopes.length === authScopeOptions.length) return "全部";
  return `已选 ${filterForm.authScopes.length} 项`;
});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(12);

// 从 Pinia 获取数据和状态
const nftList = computed(() => listStore.nfts);
const total = computed(() => listStore.nftsTotal);
const loading = computed(() => listStore.nftsLoading);

// 获取NFT列表
const fetchNFTList = async () => {
  try {
    listStore.nftsLoading = true;
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchForm.keyword,
      nftType: filterForm.nftType,
      tradeType: filterForm.tradeType,
      priceMin: filterForm.minPrice,
      priceMax: filterForm.maxPrice,
      authorizationScope: filterForm.authScopes,
      sortType: sortType.value,
      sortOrder: sortOrder.value ? "asc" : "desc",
    };

    const res = await request.get("/market", { params });
    listStore.nfts = res.data.list;
    listStore.nftsTotal = res.data.total;
  } catch (error) {
    console.error("获取NFT列表失败:", error);
    ElMessage.error("获取NFT列表失败");
  } finally {
    listStore.nftsLoading = false;
  }
};

// 清空授权范围
const clearAuthScopes = () => {
  filterForm.authScopes = [];
};

// 确认授权范围
const confirmAuthScopes = () => {
  authScopeVisible.value = false;
  fetchNFTList(); // 更新数据
};

// 事件处理
const handleSearch = () => {
  currentPage.value = 1;
  fetchNFTList(); // 搜索时更新数据
};

const handleFilter = () => {
  currentPage.value = 1;
  fetchNFTList(); // 筛选时更新数据
};

const handleSort = () => {
  fetchNFTList(); // 排序时更新数据
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchNFTList(); // 改变每页数量时更新数据
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchNFTList(); // 切换分页时更新数据
};

// 监听路由参数变化
watch(
  () => route.query,
  (query) => {
    if (query.originalId) {
      searchForm.keyword = query.originalId;
      filterForm.nftType = "original";
      handleSearch();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (listStore.nfts.length === 0) {
    fetchNFTList();
  }
});
</script>

<style lang="less" scoped>
.market-page {
  padding: 20px 0;

  .search-section {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;

    .search-input {
      width: 500px;
    }
  }

  .filter-section {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;

    .price-range {
      display: flex;
      align-items: center;

      .el-input-number {
        width: 150px;
      }

      .separator {
        margin: 0 10px;
        color: #999;
      }
    }
  }

  .sort-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .nft-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }

  .pagination {
    display: flex;
    justify-content: center;
  }

  .auth-scope-popover {
    .el-checkbox {
      margin-bottom: 10px;
      width: 50%;
    }

    .popover-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
}
</style>
