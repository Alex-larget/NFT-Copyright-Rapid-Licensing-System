<template>
  <div class="admin-dashboard">
    <h1>仪表盘</h1>

    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总交易额</span>
              <el-icon><DataLine /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="amount">￥{{ totalTransactionAmount }}</div>
            <div class="trend">
              <el-icon :class="transactionTrend > 0 ? 'up' : 'down'">
                <CaretTop v-if="transactionTrend > 0" />
                <CaretBottom v-else />
              </el-icon>
              <span>{{ Math.abs(transactionTrend) }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>NFT总数</span>
              <el-icon><Goods /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="amount">
              {{ totalNFTCount }}
            </div>
            <div class="trend">
              <el-icon :class="nftTrend > 0 ? 'up' : 'down'">
                <CaretTop v-if="nftTrend > 0" />
                <CaretBottom v-else />
              </el-icon>
              <span>{{ Math.abs(nftTrend) }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户总数</span>
              <el-icon><User /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="amount">
              {{ totalUserCount }}
            </div>
            <div class="trend">
              <el-icon :class="userTrend > 0 ? 'up' : 'down'">
                <CaretTop v-if="userTrend > 0" />
                <CaretBottom v-else />
              </el-icon>
              <span>{{ Math.abs(userTrend) }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>交易笔数</span>
              <el-icon><Tickets /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="amount">
              {{ totalTransactionCount }}
            </div>
            <div class="trend">
              <el-icon :class="transactionCountTrend > 0 ? 'up' : 'down'">
                <CaretTop v-if="transactionCountTrend > 0" />
                <CaretBottom v-else />
              </el-icon>
              <span>{{ Math.abs(transactionCountTrend) }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 交易和NFT图表 -->
    <el-row :gutter="20" class="charts">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>每月交易额</span>
          </template>
          <div ref="transactionChart" class="chart" />
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span>NFT创建趋势</span>
          </template>
          <div ref="nftChart" class="chart" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近交易列表 -->
    <el-row class="recent-transactions">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>最近交易</span>
          </template>
          <el-table :data="recentTransactions" stripe>
            <el-table-column prop="id" label="交易ID" />
            <el-table-column prop="nftName" label="藏品名称" />
            <el-table-column prop="amount" label="交易金额" />
            <el-table-column prop="type" label="交易类型" />
            <el-table-column prop="time" label="交易时间" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import {
  DataLine,
  CaretTop,
  CaretBottom,
  Goods,
  User,
  Tickets,
} from "@element-plus/icons-vue";

// 模拟数据
const totalTransactionAmount = ref(1234567.89);
const transactionTrend = ref(12.5);
const totalNFTCount = ref(5678);
const nftTrend = ref(-3.2);
const totalUserCount = ref(2345);
const userTrend = ref(8.7);
const totalTransactionCount = ref(1234);
const transactionCountTrend = ref(15.6);

const recentTransactions = ref([
  {
    id: "TX001",
    nftName: "数字艺术品1",
    amount: 5000,
    type: "转让",
    time: "2023-06-15 10:30:45",
  },
  {
    id: "TX002",
    nftName: "数字艺术品2",
    amount: 3500,
    type: "授权",
    time: "2023-06-15 11:45:22",
  },
  // 更多交易数据...
]);

const transactionChart = ref(null);
const nftChart = ref(null);

onMounted(() => {
  // 交易额图表
  const transactionChartInstance = echarts.init(transactionChart.value);
  transactionChartInstance.setOption({
    xAxis: {
      type: "category",
      data: ["1月", "2月", "3月", "4月", "5月", "6月"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330],
        type: "line",
        smooth: true,
      },
    ],
  });

  // NFT创建趋势图表
  const nftChartInstance = echarts.init(nftChart.value);
  nftChartInstance.setOption({
    xAxis: {
      type: "category",
      data: ["1月", "2月", "3月", "4月", "5月", "6月"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110],
        type: "bar",
      },
    ],
  });
});
</script>

<style lang="less" scoped>
.admin-dashboard {
  .overview-cards {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .amount {
        font-size: 24px;
        font-weight: bold;
      }

      .trend {
        display: flex;
        align-items: center;

        .up {
          color: @success-color;
        }

        .down {
          color: @danger-color;
        }
      }
    }
  }

  .charts {
    margin-bottom: 20px;

    .chart {
      height: 300px;
    }
  }
}
</style>
