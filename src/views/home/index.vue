<template>
  <div class="home-container">
    <!-- 轮播图 -->
    <el-carousel v-if="featuredNfts.length" indicator-position="outside" height="400px">
      <el-carousel-item v-for="nft in featuredNfts" :key="nft.id" @click="goToDetail(nft.id)">
        <img :src="nft.cover" class="carousel-image" alt="Featured NFT" />
        <div class="carousel-title">{{ nft.name }}</div>
      </el-carousel-item>
    </el-carousel>

    <!-- 最新作品 -->
    <div class="latest-works">
      <h2>最新作品</h2>
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>

      <el-row v-else-if="latestNfts.length" :gutter="20">
        <el-col v-for="nft in latestNfts" :key="nft.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card shadow="hover" @click="goToDetail(nft.id)">
            <img :src="nft.cover" class="nft-cover" alt="NFT Cover" />
            <div class="nft-info">
              <h3>{{ nft.name }}</h3>
              <p>{{ nft.description }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-empty v-else description="暂无最新作品" />
    </div>

    <!-- 统计信息 -->
    <div class="nft-stats">
      <el-statistic title="总作品数" :value="totalNftCount" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { getHomePageData } from '@/api/home'
import { OriginalNft } from '@/types/nft'

const router = useRouter()

const featuredNfts = ref<OriginalNft[]>([])
const latestNfts = ref<OriginalNft[]>([])
const totalNftCount = ref(0)
const loading = ref(true)

const fetchHomeData = async () => {
  try {
    loading.value = true
    const response = await getHomePageData()

    featuredNfts.value = response?.featuredNfts || []
    latestNfts.value = response?.latestNfts || []
    totalNftCount.value = response?.totalNftCount || 0
  } catch (error) {
    ElMessage.error('获取首页数据失败')
    featuredNfts.value = []
    latestNfts.value = []
    totalNftCount.value = 0
  } finally {
    loading.value = false
  }
}

const goToDetail = (id: string) => {
  router.push(`/works/${id}`)
}

onMounted(fetchHomeData)
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.carousel-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  position: relative;
}

.carousel-title {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
}

.latest-works {
  margin-top: 30px;
}

.nft-cover {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.nft-info {
  margin-top: 10px;
}

.nft-stats {
  margin-top: 30px;
  text-align: center;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>
