<template>
  <div v-if="nftDetail" class="nft-detail-container">
    <div class="nft-header">
      <img :src="nftDetail.cover" class="nft-cover" />
      <div class="nft-info">
        <h1>{{ nftDetail.name }}</h1>
        <p>{{ nftDetail.description }}</p>
        <div class="nft-meta">
          <span>创作者：{{ nftDetail.creator }}</span>
          <span>发行数量：{{ nftDetail.maxCount }}</span>
        </div>
      </div>
    </div>

    <div class="nft-actions">
      <el-button 
        type="primary" 
        @click="handlePurchase"
        :disabled="!canPurchase"
      >
        购买 NFT
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getNftDetail } from '@/api/nft'
import { OriginalNft, ChildNft } from '@/types/nft'
import { useUserStore } from '@/store/user'

const route = useRoute()
const userStore = useUserStore()

const nftDetail = ref<OriginalNft | ChildNft | null>(null)
const canPurchase = ref(false)

onMounted(async () => {
  try {
    const id = route.params.id as string
    const response = await getNftDetail(id)
    nftDetail.value = response
    
    // 判断是否可购买
    canPurchase.value = 
      response.status === 'on_sale' && 
      userStore.userInfo.value?.id !== response.creator
  } catch (error) {
    ElMessage.error('获取作品详情失败')
  }
})

const handlePurchase = () => {
  // 实现购买逻辑
  ElMessage.success('购买成功')
}
</script>

<style scoped>
.nft-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.nft-cover {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
}

.nft-info {
  margin-top: 20px;
}

.nft-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.nft-actions {
  margin-top: 20px;
  text-align: center;
}
</style> 