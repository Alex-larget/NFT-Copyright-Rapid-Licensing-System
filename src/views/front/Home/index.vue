<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="banner">
      <el-carousel height="500px">
        <el-carousel-item v-for="item in banners" :key="item.id">
          <img :src="item.image" :alt="item.title">
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 最新作品 -->
    <section class="section">
      <div class="section-header">
        <h2>最新作品</h2>
        <router-link to="/works" class="more">查看更多</router-link>
      </div>
      <div class="works-grid">
        <WorkCard v-for="work in latestWorks" :key="work.id" :work="work" />
      </div>
    </section>

    <!-- 在售藏品 -->
    <section class="section">
      <div class="section-header">
        <h2>在售藏品</h2>
        <router-link to="/market" class="more">查看更多</router-link>
      </div>
      <div class="works-grid">
        <NFTCard v-for="nft in onSaleNFTs" :key="nft.id" :nft="nft" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import WorkCard from '@/components/WorkCard.vue'
import NFTCard from '@/components/NFTCard.vue'
import { ElMessage } from 'element-plus'

const banners = ref([])
const latestWorks = ref([])
const onSaleNFTs = ref([])

// 获取数据
onMounted(async () => {
  try {
    // 获取轮播图数据
    const bannersRes = await request.get('/banners')
    banners.value = bannersRes.data

    // 获取最新作品
    const worksRes = await request.get('/works/latest')
    latestWorks.value = worksRes.data

    // 获取在售藏品
    const nftsRes = await request.get('/nft/list')
    onSaleNFTs.value = nftsRes.data
  } catch (error) {
    console.error('获取数据失败', error)
    // 可以添加错误提示
    ElMessage.error('数据加载失败，请稍后重试')
  }
})
</script>

<style lang="less" scoped>
@import "@/styles/variables.less";
@import "@/styles/mixins.less";

.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  .banner {
    margin-bottom: 40px;
    
    img {
      width: 100%;
      height: 500px; // 固定高度
      object-fit: cover;
      border-radius: 8px; // 可选：添加圆角
    }
  }

  .section {
    margin-bottom: 40px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h2 {
        font-size: 24px;
        color: #333;
      }

      .more {
        color: @primary-color;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .works-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
  }
}
</style> 