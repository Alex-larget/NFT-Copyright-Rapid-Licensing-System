<template>
  <div class="works-page">
    <div class="container">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="作品分类">
            <el-select v-model="filterForm.category" placeholder="请选择分类">
              <el-option
                v-for="item in categories"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select
              v-model="filterForm.tags"
              multiple
              collapse-tags
              placeholder="请选择标签"
            >
              <el-option
                v-for="item in tags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">筛选</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 排序区域 -->
      <div class="sort-section">
        <el-radio-group v-model="sortType" @change="handleSort">
          <el-radio-button label="latest">最新</el-radio-button>
          <el-radio-button label="popular">最热</el-radio-button>
          <el-radio-button label="price">价格</el-radio-button>
        </el-radio-group>
        <el-switch
          v-model="sortOrder"
          active-text="升序"
          inactive-text="降序"
          @change="handleSort"
        />
      </div>

      <!-- 作品列表 -->
      <div class="works-grid">
        <WorkCard
          v-for="work in works"
          :key="work.id"
          :work="work"
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
import { ref, reactive, onMounted } from 'vue'
import WorkCard from '@/components/WorkCard.vue'

// 筛选表单
const filterForm = reactive({
  category: '',
  tags: []
})

// 分类和标签数据
const categories = ref([
  { label: '数字艺术', value: 'digital-art' },
  { label: '摄影作品', value: 'photography' },
  { label: '音乐作品', value: 'music' },
  { label: '视频作品', value: 'video' }
])

const tags = ref([
  { label: '抽象', value: 'abstract' },
  { label: '写实', value: 'realistic' },
  { label: '现代', value: 'modern' },
  { label: '传统', value: 'traditional' }
])

// 排序相关
const sortType = ref('latest')
const sortOrder = ref(false) // false为降序，true为升序

// 分页相关
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const works = ref([])

// 获取作品列表
const fetchWorks = async () => {
  try {
    // TODO: 调用API获取数据
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      category: filterForm.category,
      tags: filterForm.tags,
      sortType: sortType.value,
      sortOrder: sortOrder.value ? 'asc' : 'desc'
    }
    // const { data } = await getWorks(params)
    // works.value = data.list
    // total.value = data.total
  } catch (error) {
    console.error('获取作品列表失败:', error)
  }
}

// 事件处理
const handleFilter = () => {
  currentPage.value = 1
  fetchWorks()
}

const resetFilter = () => {
  filterForm.category = ''
  filterForm.tags = []
  handleFilter()
}

const handleSort = () => {
  fetchWorks()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchWorks()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchWorks()
}

onMounted(() => {
  fetchWorks()
})
</script>

<style lang="scss" scoped>
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