<template>
  <div class="nft-detail">
    <div class="container">
      <div class="detail-content">
        <!-- 左侧展示区 -->
        <div class="left-section">
          <div class="main-image">
            <el-image 
              :src="nftDetail.image" 
              fit="contain"
              :preview-src-list="[nftDetail.image]"
            />
          </div>
          <div class="info-list">
            <div class="info-item">
              <span class="label">藏品类型</span>
              <span class="value">{{ nftDetail.type === 'original' ? '原始藏品' : '子藏品' }}</span>
            </div>
            <div class="info-item">
              <span class="label">交易类型</span>
              <span class="value">{{ nftDetail.tradeType === 'transfer' ? '转让' : '授权' }}</span>
            </div>
            <div class="info-item">
              <span class="label">有效期至</span>
              <span class="value">{{ formatDate(nftDetail.validUntil) }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧交易区 -->
        <div class="right-section">
          <h1 class="title">{{ nftDetail.title }}</h1>
          
          <!-- 持有者信息 -->
          <div class="owner-info" @click="goToOwnerProfile">
            <el-avatar :size="40" :src="nftDetail.owner?.avatar" />
            <div class="owner-detail">
              <span class="name">{{ nftDetail.owner?.nickname }}</span>
              <span class="role">持有者</span>
            </div>
            <el-button type="primary" text @click.stop="startChat">
              <el-icon><ChatDotRound /></el-icon>
              联系卖家
            </el-button>
          </div>

          <!-- 价格信息 -->
          <div class="price-info">
            <div class="current-price">
              <span class="label">当前价格</span>
              <span class="price">￥{{ nftDetail.price }}</span>
            </div>
            <div class="validity">
              <el-icon><Timer /></el-icon>
              <span>{{ getRemainingDays(nftDetail.validUntil) }}天后到期</span>
            </div>
          </div>

          <!-- 授权范围 -->
          <div v-if="nftDetail.tradeType === 'authorize'" class="auth-scope">
            <h3>授权范围</h3>
            <div class="scope-list">
              <el-tag
                v-for="scope in nftDetail.authScopes"
                :key="scope.value"
                size="large"
                effect="plain"
              >
                {{ scope.label }}
              </el-tag>
            </div>
          </div>

          <!-- 交易按钮 -->
          <div class="trade-action">
            <el-button type="primary" size="large" @click="showTradeDialog" :loading="loading">
              立即{{ nftDetail.tradeType === 'transfer' ? '购买' : '授权' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 交易确认弹窗 -->
    <el-dialog
      v-model="tradeDialogVisible"
      :title="`确认${nftDetail.tradeType === 'transfer' ? '购买' : '授权'}`"
      width="500px"
    >
      <div class="trade-dialog">
        <div class="info-row">
          <span class="label">藏品名称</span>
          <span class="value">{{ nftDetail.title }}</span>
        </div>
        <div class="info-row">
          <span class="label">交易类型</span>
          <span class="value">{{ nftDetail.tradeType === 'transfer' ? '转让' : '授权' }}</span>
        </div>
        <div class="info-row">
          <span class="label">交易价格</span>
          <span class="value price">￥{{ nftDetail.price }}</span>
        </div>
        <div v-if="nftDetail.tradeType === 'authorize'" class="info-row">
          <span class="label">授权范围</span>
          <div class="value">
            <el-tag
              v-for="scope in nftDetail.authScopes"
              :key="scope.value"
              size="small"
              effect="plain"
            >
              {{ scope.label }}
            </el-tag>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tradeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleTrade" :loading="loading">
            确认支付
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 聊天弹窗 -->
    <el-dialog
      v-model="chatDialogVisible"
      title="联系卖家"
      width="400px"
    >
      <div class="chat-dialog">
        <!-- TODO: 实现聊天功能 -->
        <p class="placeholder">聊天功能开发中...</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChatDotRound, Timer } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { formatDate, getRemainingDays } from '@/utils/date'
import { getNFTDetail, createTrade } from '@/api/market'

const route = useRoute()
const router = useRouter()

const nftDetail = ref({})
const loading = ref(false)
const tradeDialogVisible = ref(false)
const chatDialogVisible = ref(false)

// 获取NFT详情
const fetchNFTDetail = async () => {
  try {
    const { data } = await getNFTDetail(route.params.id)
    nftDetail.value = data
  } catch (error) {
    console.error('获取NFT详情失败:', error)
  }
}

// 跳转到持有者主页
const goToOwnerProfile = () => {
  router.push(`/user/${nftDetail.value.owner.id}`)
}

// 打开聊天窗口
const startChat = () => {
  chatDialogVisible.value = true
}

// 显示交易确认
const showTradeDialog = () => {
  tradeDialogVisible.value = true
}

// 处理交易
const handleTrade = async () => {
  try {
    loading.value = true
    await createTrade({
      nftId: nftDetail.value.id,
      type: nftDetail.value.tradeType,
      price: nftDetail.value.price
    })
    ElMessage.success('支付成功')
    tradeDialogVisible.value = false
    router.push('/nft')
  } catch (error) {
    ElMessage.error('支付失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNFTDetail()
})
</script>

<style lang="less" scoped>
@import "@/styles/variables.less";
@import "@/styles/mixins.less";

.market-detail {
  .section-header {
    .title {
      color: @primary-color;
    }
  }

  .nft-info {
    .price-info {
      .price {
        color: @primary-color;
      }
    }
  }

  .action-buttons {
    .buy-button {
      background-color: @primary-color;
    }
  }
}

.nft-detail {
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

    .info-list {
      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .label {
          width: 80px;
          color: #666;
        }

        .value {
          color: #333;
        }
      }
    }
  }

  .right-section {
    .title {
      font-size: 24px;
      color: #333;
      margin: 0 0 20px;
    }

    .owner-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 30px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      cursor: pointer;

      .owner-detail {
        flex: 1;
        display: flex;
        flex-direction: column;

        .name {
          font-size: 16px;
          color: #333;
        }

        .role {
          font-size: 14px;
          color: #999;
        }
      }
    }

    .price-info {
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;

      .current-price {
        margin-bottom: 12px;

        .label {
          font-size: 14px;
          color: #666;
        }

        .price {
          margin-left: 8px;
          font-size: 24px;
          font-weight: bold;
          color: @primary-color;
        }
      }

      .validity {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        font-size: 14px;
      }
    }

    .auth-scope {
      margin-bottom: 30px;

      h3 {
        font-size: 16px;
        color: #333;
        margin: 0 0 12px;
      }

      .scope-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }

    .trade-action {
      .el-button {
        width: 100%;
      }
    }
  }
}

.trade-dialog {
  .info-row {
    display: flex;
    margin-bottom: 16px;

    .label {
      width: 80px;
      color: #666;
    }

    .value {
      color: #333;

      &.price {
        color: @primary-color;
        font-weight: bold;
      }
    }
  }
}

.chat-dialog {
  .placeholder {
    text-align: center;
    color: #999;
    padding: 40px 0;
  }
}
</style> 