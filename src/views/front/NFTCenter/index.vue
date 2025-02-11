<template>
  <div class="nft-center">
    <div class="container">
      <h2>NFT中心</h2>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="我的藏品" name="myNFTs">
          <div class="nft-grid">
            <NFTCard v-for="nft in myNFTs" :key="nft.id" :nft="nft" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的交易" name="myTrades">
          <el-table :data="myTrades" style="width: 100%">
            <el-table-column prop="id" label="订单编号" width="180" />
            <el-table-column prop="nftName" label="藏品名称" />
            <el-table-column prop="type" label="交易类型">
              <template #default="{ row }">
                {{ row.type === "transfer" ? "转让" : "授权" }}
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="120" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import NFTCard from "@/components/NFTCard.vue";

const activeTab = ref("myNFTs");
const myNFTs = ref([]);
const myTrades = ref([]);

const getStatusType = (status) => {
  const statusMap = {
    pending: "warning",
    success: "success",
    failed: "danger",
  };
  return statusMap[status];
};

const getStatusLabel = (status) => {
  const statusMap = {
    pending: "待支付",
    success: "已完成",
    failed: "已取消",
  };
  return statusMap[status];
};
</script>

<style lang="less" scoped>
.nft-center {
  padding: 20px 0;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }

  .nft-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin: 20px 0;
  }
}
</style>
