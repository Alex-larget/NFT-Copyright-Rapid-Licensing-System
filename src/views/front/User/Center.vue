<template>
  <div class="user-center">
    <h2>个人中心</h2>

    <!-- 数据概览 -->
    <el-row :gutter="20" class="stats">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>我的藏品</span>
              <el-button type="primary" link>查看全部</el-button>
            </div>
          </template>
          <div class="stat-number">{{ stats.nftCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>交易总额</span>
              <el-button type="primary" link>交易记录</el-button>
            </div>
          </template>
          <div class="stat-number">￥{{ stats.totalAmount }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待处理</span>
              <el-button type="primary" link>全部订单</el-button>
            </div>
          </template>
          <div class="stat-number">{{ stats.pendingCount }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近交易 -->
    <div class="recent-trades">
      <div class="section-header">
        <h3>最近交易</h3>
        <el-button type="primary" link>查看更多</el-button>
      </div>
      <el-table :data="recentTrades" style="width: 100%">
        <el-table-column prop="id" label="订单编号" width="180" />
        <el-table-column prop="nftName" label="藏品名称" />
        <el-table-column prop="type" label="交易类型">
          <template #default="{ row }">
            {{ row.type === "transfer" ? "转让" : "授权" }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }"> ￥{{ row.price }} </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
      </el-table>
    </div>

    <!-- 我的藏品 -->
    <div class="my-nfts">
      <div class="section-header">
        <h3>我的藏品</h3>
        <el-button type="primary" link>查看更多</el-button>
      </div>
      <div class="nft-grid">
        <NFTCard v-for="nft in myNFTs" :key="nft.id" :nft="nft" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NFTCard from "@/components/NFTCard.vue";
import { getUserStats, getRecentTrades, getUserNFTs } from "@/api/userCenter";
import { ElMessage } from "element-plus";

// 数据统计
const stats = ref({
  nftCount: 0,
  totalAmount: 0,
  pendingCount: 0,
});

// 最近交易
const recentTrades = ref([]);

// 我的藏品
const myNFTs = ref([]);

// 加载状态
const loading = ref(false);

// 获取状态样式
const getStatusType = (status) => {
  const statusMap = {
    pending: "warning",
    success: "success",
    failed: "danger",
  };
  return statusMap[status];
};

// 获取状态文本
const getStatusLabel = (status) => {
  const statusMap = {
    pending: "待支付",
    success: "已完成",
    failed: "已取消",
  };
  return statusMap[status];
};

// 获取数据
onMounted(async () => {
  try {
    loading.value = true;
    const [statsRes, tradesRes, nftsRes] = await Promise.all([
      getUserStats(),
      getRecentTrades(),
      getUserNFTs(),
    ]);

    stats.value = statsRes.data;
    recentTrades.value = tradesRes.data;
    myNFTs.value = nftsRes.data;
  } catch (error) {
    ElMessage.error("获取数据失败");
    console.error("获取用户中心数据失败:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="less" scoped>
.user-center {
  h2 {
    margin: 0 0 20px;
    font-size: 24px;
    color: #333;
  }

  .stats {
    margin-bottom: 30px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: @primary-color;
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }
  }

  .recent-trades {
    margin-bottom: 30px;
  }

  .nft-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}
</style>
