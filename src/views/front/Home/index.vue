<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="banner">
      <el-carousel
        v-loading="bannersLoading"
        height="360px"
        :interval="5000"
        arrow="always"
      >
        <el-carousel-item v-for="item in banners" :key="item.id">
          <img :src="item.image" :alt="item.title" class="banner-image" />
          <div class="banner-info">
            <h3>{{ item.title }}</h3>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 最新作品 -->
    <section class="section">
      <div class="section-header">
        <h2>最新作品</h2>
        <router-link to="/works" class="more"> 查看更多 </router-link>
      </div>
      <div v-loading="latestWorksLoading" class="works-grid">
        <WorkCard v-for="work in latestWorks" :key="work.id" :work="work" />
      </div>
    </section>

    <!-- 最新NFT -->
    <section class="section">
      <div class="section-header">
        <h2>最新NFT</h2>
        <router-link to="/market" class="more"> 查看更多 </router-link>
      </div>
      <div v-loading="latestNftsLoading" class="works-grid">
        <NFTCard v-for="nft in latestNfts" :key="nft.id" :nft="nft" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import request from "@/utils/request";
import { useListStore } from "@/store/modules/list";
import WorkCard from "@/components/WorkCard.vue";
import NFTCard from "@/components/NFTCard.vue";
import { ElMessage } from "element-plus";

const listStore = useListStore();

// 从 Pinia 获取数据和状态
const banners = computed(() => listStore.banners);
const bannersLoading = computed(() => listStore.bannersLoading);
const latestWorks = computed(() => listStore.latestWorks);
const latestWorksLoading = computed(() => listStore.latestWorksLoading);
const latestNfts = computed(() => listStore.latestNfts);
const latestNftsLoading = computed(() => listStore.latestNftsLoading);

// 获取轮播图数据
const fetchBanners = async () => {
  try {
    listStore.bannersLoading = true;
    const res = await request.get("/banners");
    listStore.banners = res.data;
  } catch (error) {
    console.error("获取轮播图数据失败:", error);
    // 可以添加错误提示
    ElMessage.error("数据加载失败，请稍后重试");
  } finally {
    listStore.bannersLoading = false;
  }
};

// 获取最新作品数据
const fetchLatestWorks = async () => {
  try {
    listStore.latestWorksLoading = true;
    const res = await request.get("/works/latest");
    listStore.latestWorks = res.data;
  } catch (error) {
    console.error("获取最新作品数据失败:", error);
  } finally {
    listStore.latestWorksLoading = false;
  }
};

// 获取最新NFT数据
const fetchLatestNfts = async () => {
  try {
    listStore.latestNftsLoading = true;
    const res = await request.get("/nft/latest");
    listStore.latestNfts = res.data;
  } catch (error) {
    console.error("获取最新NFT数据失败:", error);
  } finally {
    listStore.latestNftsLoading = false;
  }
};

onMounted(() => {
  if (listStore.banners.length === 0) {
    fetchBanners();
  }
  if (listStore.latestWorks.length === 0) {
    fetchLatestWorks();
  }
  if (listStore.latestNfts.length === 0) {
    fetchLatestNfts();
  }
});
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

    :deep(.el-carousel__item) {
      height: 500px;
    }

    img {
      width: 100%;
      object-fit: cover;
      border-radius: 8px;
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
