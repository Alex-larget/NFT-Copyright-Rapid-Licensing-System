<template>
  <div class="works-page">
    <div class="container">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-form :inline="true">
          <el-form-item label="作品类别">
            <el-select
              v-model="filterForm.category"
              placeholder="选择类别"
              clearable
              @change="handleFilter"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="标签">
            <el-checkbox-group v-model="filterForm.tags" @change="handleFilter">
              <el-checkbox
                v-for="item in tagOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>

      <!-- 排序区域 -->
      <div class="sort-section">
        <el-radio-group v-model="sortType" @change="handleSort">
          <el-radio-button value="latest"> 最新 </el-radio-button>
          <el-radio-button value="popular"> 最热 </el-radio-button>
          <el-radio-button value="price"> 价格 </el-radio-button>
        </el-radio-group>

        <el-switch
          v-model="sortOrder"
          active-text="升序"
          inactive-text="降序"
          @change="handleSort"
        />
      </div>

      <!-- 作品列表 -->
      <div v-loading="loading" class="works-grid">
        <WorkCard v-for="work in works" :key="work.id" :work="work" />
        <el-empty
          v-if="!loading && works.length === 0"
          description="暂无作品"
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
import { ref, onMounted, computed } from "vue";
import request from "@/utils/request";
import WorkCard from "@/components/WorkCard.vue";
import { ElMessage } from "element-plus";
import { useListStore } from "@/store/modules/list";

const listStore = useListStore();

// 筛选表单
const filterForm = ref({
  category: "",
  tags: [],
});

// 排序相关
const sortType = ref("latest");
const sortOrder = ref(false); // false为降序，true为升序

// 分页相关
const currentPage = ref(1);
const pageSize = ref(12);

// 从 Pinia 获取数据和状态
const works = computed(() => listStore.works);
const total = computed(() => listStore.worksTotal);
const loading = computed(() => listStore.worksLoading);

// 获取作品列表
const fetchWorks = async () => {
  try {
    listStore.worksLoading = true;
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      category: filterForm.value.category,
      tags: filterForm.value.tags,
      sortType: sortType.value,
      sortOrder: sortOrder.value ? "asc" : "desc",
    };

    const res = await request.get("/works", { params });
    listStore.works = res.data.list;
    listStore.worksTotal = res.data.total;
  } catch (error) {
    console.error("获取作品列表失败:", error);
    ElMessage.error("获取作品列表失败");
  } finally {
    listStore.worksLoading = false;
  }
};

// 类别选项
const categoryOptions = [
  { label: "数字艺术", value: "digital-art" },
  { label: "摄影", value: "photography" },
  { label: "插画", value: "illustration" },
  { label: "平面设计", value: "graphic-design" },
];

// 标签选项
const tagOptions = [
  { label: "抽象", value: "abstract" },
  { label: "现代", value: "modern" },
  { label: "极简", value: "minimalist" },
  { label: "多彩", value: "colorful" },
  { label: "超现实", value: "surreal" },
];

// 事件处理
const handleFilter = () => {
  currentPage.value = 1;
  fetchWorks();
};

const resetFilter = () => {
  filterForm.value.category = "";
  filterForm.value.tags = [];
  fetchWorks();
};

const handleSort = () => {
  fetchWorks();
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchWorks();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchWorks();
};

onMounted(() => {
  if (listStore.works.length === 0) {
    fetchWorks();
  }
});
</script>

<style lang="less" scoped>
.works-page {
  padding: 20px 0;

  .filter-section {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .sort-section {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }

  .works-grid {
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
