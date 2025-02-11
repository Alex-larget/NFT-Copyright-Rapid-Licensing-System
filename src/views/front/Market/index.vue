<template>
  <div class="market-page">
    <div class="container">
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索作品名称/原始藏品ID/子藏品ID"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="价格区间">
            <el-input-number
              v-model="filterForm.minPrice"
              :min="0"
              placeholder="最低价"
              class="price-input"
            />
            <span class="separator">-</span>
            <el-input-number
              v-model="filterForm.maxPrice"
              :min="0"
              placeholder="最高价"
              class="price-input"
            />
          </el-form-item>

          <el-form-item label="有效期">
            <el-date-picker
              v-model="filterForm.validityRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>

          <el-form-item label="授权范围">
            <el-popover
              placement="bottom"
              :width="300"
              trigger="click"
              v-model:visible="authScopeVisible"
            >
              <template #reference>
                <el-button>
                  {{ getSelectedAuthScopes }}
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
              </template>
              <div class="auth-scope-popover">
                <el-checkbox-group v-model="filterForm.authScopes">
                  <div v-for="scope in authScopeOptions" :key="scope.value">
                    <el-checkbox :label="scope.value">{{ scope.label }}</el-checkbox>
                  </div>
                </el-checkbox-group>
                <div class="popover-footer">
                  <el-button size="small" @click="clearAuthScopes">清空</el-button>
                  <el-button type="primary" size="small" @click="confirmAuthScopes">
                    确定
                  </el-button>
                </div>
              </div>
            </el-popover>
          </el-form-item>

          <el-form-item label="藏品类型">
            <el-select v-model="filterForm.nftType" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="原始藏品" value="original" />
              <el-option label="子藏品" value="child" />
            </el-select>
          </el-form-item>

          <el-form-item label="交易类型">
            <el-select v-model="filterForm.tradeType" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="转让" value="transfer" />
              <el-option label="授权" value="authorize" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- NFT列表 -->
      <div class="nft-grid">
        <NFTCard
          v-for="nft in nftList"
          :key="nft.id"
          :nft="nft"
        />
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[12, 24, 36, 48]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { Search, ArrowDown } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import NFTCard from '@/components/NFTCard.vue'

const route = useRoute()
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  keyword: route.query.keyword || ''
})

// 筛选表单
const filterForm = reactive({
  minPrice: null,
  maxPrice: null,
  validityRange: [],
  authScopes: [],
  nftType: route.query.nftType || '',
  tradeType: ''
})

// 授权范围选项
const authScopeOptions = [
  { label: '商业使用', value: 'commercial' },
  { label: '衍生创作', value: 'derivative' },
  { label: '展览展示', value: 'exhibition' },
  { label: '广告宣传', value: 'advertising' }
]

const authScopeVisible = ref(false)
const getSelectedAuthScopes = computed(() => {
  if (filterForm.authScopes.length === 0) return '选择授权范围'
  if (filterForm.authScopes.length === authScopeOptions.length) return '全部'
  return `已选 ${filterForm.authScopes.length} 项`
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const nftList = ref([])

// 获取NFT列表
const fetchNFTList = async () => {
  try {
    // TODO: 调用API获取数据
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchForm.keyword,
      ...filterForm,
      validityStart: filterForm.validityRange?.[0],
      validityEnd: filterForm.validityRange?.[1]
    }
    // const { data } = await getNFTList(params)
    // nftList.value = data.list
    // total.value = data.total
  } catch (error) {
    console.error('获取NFT列表失败:', error)
  }
}

// 事件处理
const handleSearch = () => {
  currentPage.value = 1
  fetchNFTList()
}

const clearAuthScopes = () => {
  filterForm.authScopes = []
}

const confirmAuthScopes = () => {
  authScopeVisible.value = false
  fetchNFTList()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchNFTList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchNFTList()
}

// 监听路由参数变化
watch(
  () => route.query,
  (query) => {
    if (query.originalId) {
      searchForm.keyword = query.originalId
      filterForm.nftType = 'original'
      handleSearch()
    }
  },
  { immediate: true }
)

onMounted(() => {
  fetchNFTList()
})
</script>

<style lang="scss" scoped>
.market-page {
  padding: 20px 0;

  .search-section {
    margin-bottom: 20px;

    .search-input {
      width: 400px;
    }
  }

  .filter-section {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;

    .price-input {
      width: 120px;
    }

    .separator {
      margin: 0 8px;
      color: #999;
    }
  }

  .auth-scope-popover {
    padding: 12px;

    .el-checkbox {
      display: block;
      margin-bottom: 8px;
    }

    .popover-footer {
      margin-top: 12px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
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
}
</style> 