<template>
  <div class="work-detail">
    <div class="container">
      <div class="detail-content">
        <!-- 左侧图片展示区 -->
        <div class="left-section">
          <div class="main-image">
            <el-image 
              :src="workDetail.image" 
              fit="contain"
              :preview-src-list="[workDetail.image, ...(workDetail.attachments || [])]"
            />
          </div>
          <div class="attachment-list" v-if="workDetail.attachments?.length">
            <el-image
              v-for="(img, index) in workDetail.attachments"
              :key="index"
              :src="img"
              fit="cover"
              class="attachment-item"
            />
          </div>
        </div>

        <!-- 右侧信息区 -->
        <div class="right-section">
          <h1 class="title">{{ workDetail.title }}</h1>
          
          <!-- 作者信息 -->
          <div class="author-info" @click="goToAuthorProfile">
            <el-avatar :size="40" :src="workDetail.author?.avatar" />
            <div class="author-detail">
              <span class="name">{{ workDetail.author?.nickname }}</span>
              <span class="date">发布于 {{ formatDate(workDetail.createdAt) }}</span>
            </div>
          </div>

          <!-- 作品信息 -->
          <div class="work-info">
            <div class="info-item">
              <span class="label">原始藏品ID：</span>
              <span class="value">{{ workDetail.originalId }}</span>
            </div>
            <div class="info-item">
              <span class="label">作品分类：</span>
              <span class="value">{{ getCategoryLabel(workDetail.category) }}</span>
            </div>
            <div class="info-item">
              <span class="label">标签：</span>
              <div class="tags">
                <el-tag
                  v-for="tag in workDetail.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ getTagLabel(tag) }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 作品描述 -->
          <div class="description">
            <h3>作品描述</h3>
            <p>{{ workDetail.description }}</p>
          </div>

          <!-- 操作按钮 -->
          <div class="actions">
            <el-button type="primary" @click="showTraceDialog">溯源查询</el-button>
            <el-button type="success" @click="goToTrade">购买</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 溯源弹窗 -->
    <el-dialog
      v-model="traceDialogVisible"
      title="藏品溯源"
      width="600px"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in traceHistory"
          :key="index"
          :timestamp="formatDate(activity.time)"
          :type="activity.type"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getWorkDetail } from '@/api/works'
import { formatDate } from '@/utils/date'

const route = useRoute()
const router = useRouter()

const workDetail = ref({})
const traceDialogVisible = ref(false)
const traceHistory = ref([])

// 获取作品详情
const fetchWorkDetail = async () => {
  try {
    const { data } = await getWorkDetail(route.params.id)
    workDetail.value = data
  } catch (error) {
    console.error('获取作品详情失败:', error)
  }
}

// 获取分类标签
const getCategoryLabel = (value) => {
  const categoryMap = {
    'digital-art': '数字艺术',
    'photography': '摄影作品',
    'music': '音乐作品',
    'video': '视频作品'
  }
  return categoryMap[value] || value
}

// 获取标签文本
const getTagLabel = (value) => {
  const tagMap = {
    'abstract': '抽象',
    'realistic': '写实',
    'modern': '现代',
    'traditional': '传统'
  }
  return tagMap[value] || value
}

// 跳转到作者主页
const goToAuthorProfile = () => {
  router.push(`/user/${workDetail.value.author.id}`)
}

// 跳转到交易页
const goToTrade = () => {
  router.push(`/market?originalId=${workDetail.value.originalId}`)
}

// 显示溯源信息
const showTraceDialog = async () => {
  traceDialogVisible.value = true
  // TODO: 获取溯源信息
  traceHistory.value = [
    {
      time: '2024-03-20',
      type: 'primary',
      content: '作品创建'
    },
    {
      time: '2024-03-21',
      type: 'success',
      content: '版权认证通过'
    }
  ]
}

onMounted(() => {
  fetchWorkDetail()
})
</script>

<style lang="less" scoped>
.work-detail {
  padding: 40px 0;

  .detail-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .left-section {
    .main-image {
      width: 100%;
      height: 400px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;

      :deep(.el-image) {
        width: 100%;
        height: 100%;
      }
    }

    .attachment-list {
      display: flex;
      gap: 10px;
      
      .attachment-item {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }

  .right-section {
    .title {
      font-size: 24px;
      color: #333;
      margin: 0 0 20px;
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 30px;
      cursor: pointer;

      .author-detail {
        display: flex;
        flex-direction: column;

        .name {
          font-size: 16px;
          color: #333;
        }

        .date {
          font-size: 14px;
          color: #999;
        }
      }
    }

    .work-info {
      margin-bottom: 30px;

      .info-item {
        margin-bottom: 16px;
        display: flex;
        align-items: center;

        .label {
          width: 100px;
          color: #666;
        }

        .value {
          color: #333;
        }

        .tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
      }
    }

    .description {
      margin-bottom: 30px;

      h3 {
        font-size: 16px;
        color: #333;
        margin: 0 0 12px;
      }

      p {
        color: #666;
        line-height: 1.6;
        margin: 0;
      }
    }

    .actions {
      display: flex;
      gap: 16px;
    }
  }
}
</style> 