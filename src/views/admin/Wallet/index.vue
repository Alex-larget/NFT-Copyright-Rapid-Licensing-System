<template>
  <div class="admin-wallet">
    <!-- 钱包总览 -->
    <el-row :gutter="20" class="wallet-overview">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总资产</span>
              <el-icon><Money /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="amount">￥{{ totalAssets }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>钱包数量</span>
              <el-icon><Wallet /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="amount">
              {{ totalWallets }}
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日交易</span>
              <el-icon><Tickets /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="amount">
              {{ todayTransactions }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 钱包列表 -->
    <el-card class="wallet-list">
      <template #header>
        <div class="card-header">
          <span>钱包列表</span>
          <el-button type="primary" @click="openAddWalletDialog">
            <el-icon><Plus /></el-icon>添加钱包
          </el-button>
        </div>
      </template>

      <el-table :data="walletList" stripe>
        <el-table-column prop="address" label="钱包地址" />
        <el-table-column prop="balance" label="余额" />
        <el-table-column prop="nftCount" label="NFT数量" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="viewWalletDetails(scope.row)"
            >
              详情
            </el-button>
            <el-button type="danger" link @click="deleteWallet(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalWallets"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加钱包对话框 -->
    <el-dialog v-model="addWalletDialogVisible" title="添加钱包" width="500px">
      <el-form :model="newWallet" label-width="100px">
        <el-form-item label="钱包地址">
          <el-input v-model="newWallet.address" />
        </el-form-item>
        <el-form-item label="初始余额">
          <el-input-number
            v-model="newWallet.balance"
            :precision="2"
            :step="100"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addWalletDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmAddWallet"> 确认 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Money, Wallet, Tickets, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 总览数据
const totalAssets = ref(5678901.23);
const totalWallets = ref(256);
const todayTransactions = ref(42);

// 钱包列表
const walletList = ref([
  {
    address: "0x1234567890abcdef1234567890abcdef",
    balance: 12345.67,
    nftCount: 15,
    createTime: "2023-06-15 10:30:45",
  },
  {
    address: "0xabcdef1234567890abcdef1234567890",
    balance: 98765.43,
    nftCount: 23,
    createTime: "2023-06-14 15:45:22",
  },
]);

// 添加钱包对话框
const addWalletDialogVisible = ref(false);
const newWallet = ref({
  address: "",
  balance: 0,
});

const openAddWalletDialog = () => {
  addWalletDialogVisible.value = true;
};

const confirmAddWallet = () => {
  if (!newWallet.value.address) {
    ElMessage.error("请输入钱包地址");
    return;
  }

  walletList.value.push({
    address: newWallet.value.address,
    balance: newWallet.value.balance,
    nftCount: 0,
    createTime: new Date().toLocaleString(),
  });

  addWalletDialogVisible.value = false;
  ElMessage.success("添加钱包成功");
};

// 查看钱包详情
const viewWalletDetails = (wallet) => {
  ElMessageBox.alert(
    `钱包地址: ${wallet.address}<br/>
    余额: ￥${wallet.balance}<br/>
    NFT数量: ${wallet.nftCount}<br/>
    创建时间: ${wallet.createTime}`,
    "钱包详情",
    { dangerouslyUseHTMLString: true }
  );
};

// 删除钱包
const deleteWallet = (wallet) => {
  ElMessageBox.confirm(`确定要删除钱包 ${wallet.address} 吗?`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      walletList.value = walletList.value.filter(
        (w) => w.address !== wallet.address
      );
      ElMessage.success("删除钱包成功");
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 分页处理
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
};

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
};
</script>

<style lang="less" scoped>
.admin-wallet {
  .wallet-overview {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-content {
      .amount {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
      }
    }
  }

  .wallet-list {
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>
