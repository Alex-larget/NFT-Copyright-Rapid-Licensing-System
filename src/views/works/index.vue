<template>
  <div class="works-container">
    <el-row :gutter="20">
      <el-col v-for="nft in nftList" :key="nft.id" :xs="24" :sm="12" :md="8" :lg="6">
        <el-card shadow="hover" @click="goToDetail(nft.id)">
          <img :src="nft.cover" class="nft-cover" alt="NFT Cover" />
          <div class="nft-info">
            <h3>{{ nft.name }}</h3>
            <p>{{ nft.description }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div v-if="loading" class="loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <el-empty v-if="!loading && nftList.length === 0" description="暂无作品" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { getNftList } from '@/api/nft'
import { OriginalNft } from '@/types/nft'

const router = useRouter()
const nftList = ref<OriginalNft[]>([])
const loading = ref(true)

const fetchNftList = async () => {
  try {
    loading.value = true
    const response = await getNftList()
    nftList.value = response?.list || []
  } catch (error) {
    ElMessage.error('获取作品列表失败')
    nftList.value = []
  } finally {
    loading.value = false
  }
}

const goToDetail = (id: string) => {
  router.push(`/works/${id}`)
}

onMounted(fetchNftList)
</script>

<style scoped>
.works-container {
  padding: 20px;
}

.nft-cover {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.nft-info {
  margin-top: 10px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loading .el-icon {
  margin-right: 10px;
  font-size: 24px;
}
</style>
