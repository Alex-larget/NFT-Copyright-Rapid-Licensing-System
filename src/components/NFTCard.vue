<template>
  <div class="nft-card" @click="goToDetail">
    <div class="nft-image">
      <el-image :src="nft.image" fit="cover" :preview-src-list="[nft.image]">
        <template #error>
          <div class="image-placeholder">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <div class="nft-type">{{ nft.type === 'original' ? '原始藏品' : '子藏品' }}</div>
    </div>
    <div class="nft-info">
      <h3 class="title">{{ nft.title }}</h3>
      <div class="price">
        <span class="label">价格</span>
        <span class="amount">￥{{ nft.price }}</span>
      </div>
      <div class="owner">
        <el-avatar :size="24" :src="nft.owner.avatar" />
        <span class="name">{{ nft.owner.nickname }}</span>
      </div>
      <div class="footer">
        <span class="type">{{ nft.tradeType === 'transfer' ? '转让' : '授权' }}</span>
        <el-button type="primary" size="small">立即购买</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Picture } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  nft: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const goToDetail = () => {
  router.push(`/market/${props.nft.id}`)
}
</script>

<style lang="less" scoped>
@import "@/styles/variables.less";
@import "@/styles/mixins.less";

.nft-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }

  .nft-image {
    height: 200px;
    position: relative;
    overflow: hidden;

    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }

    .nft-type {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 8px;
      background: rgba(0,0,0,0.6);
      color: #fff;
      border-radius: 4px;
      font-size: 12px;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      color: #909399;
      font-size: 24px;
    }
  }

  .nft-info {
    padding: 16px;

    .title {
      margin: 0 0 12px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      .text-ellipsis();
    }

    .price {
      margin-bottom: 12px;
      
      .label {
        font-size: 14px;
        color: #666;
      }

      .amount {
        margin-left: 8px;
        font-size: 18px;
        font-weight: 500;
        color: @primary-color;
      }
    }

    .owner {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      .name {
        font-size: 14px;
        color: #666;
      }
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .type {
        padding: 2px 8px;
        background: #f5f7fa;
        color: #666;
        border-radius: 4px;
        font-size: 12px;
      }
    }
  }
}
</style> 