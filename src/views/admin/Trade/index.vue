<template>
  <div class="admin-trade">
    <h1>交易管理</h1>

    <!-- 搜索和筛选区域 -->
    <el-card class="search-filter">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="交易类型">
          <el-select v-model="searchForm.type" placeholder="选择类型" clearable>
            <el-option label="转让" value="transfer" />
            <el-option label="授权" value="authorize" />
          </el-select>
        </el-form-item>

        <el-form-item label="交易状态">
          <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
            clearable
          >
            <el-option label="进行中" value="pending" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>

        <el-form-item label="交易时间">
          <el-date-picker
            v-model="searchForm.tradeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetSearch"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <div class="operation-buttons">
      <el-button
        type="danger"
        :disabled="!selectedTrades.length"
        @click="batchCancel"
      >
        <el-icon><Close /></el-icon>批量取消
      </el-button>
    </div>

    <!-- 交易列表 -->
    <el-card class="trade-list">
      <el-table
        :data="tradeList"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="交易ID" width="180" />
        <el-table-column prop="nftName" label="藏品名称" />
        <el-table-column prop="type" label="交易类型">
          <template #default="scope">
            <el-tag :type="getTypeTagType(scope.row.type)">
              {{ getTypeLabel(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="交易价格" />
        <el-table-column prop="status" label="交易状态">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="viewTradeDetails(scope.row)">
              详情
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              type="success"
              link
              @click="confirmTrade(scope.row)"
            >
              确认
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              type="danger"
              link
              @click="cancelTrade(scope.row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 交易详情对话框 -->
    <el-dialog
      v-model="tradeDetailDialogVisible"
      title="交易详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="交易ID">
          {{ currentTrade.id }}
        </el-descriptions-item>
        <el-descriptions-item label="藏品名称">
          {{ currentTrade.nftName }}
        </el-descriptions-item>
        <el-descriptions-item label="交易类型">
          {{ getTypeLabel(currentTrade.type) }}
        </el-descriptions-item>
        <el-descriptions-item label="交易价格">
          ￥{{ currentTrade.price }}
        </el-descriptions-item>
        <el-descriptions-item label="交易状态">
          {{ getStatusLabel(currentTrade.status) }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentTrade.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="买家" :span="2">
          {{ currentTrade.buyer }}
        </el-descriptions-item>
        <el-descriptions-item label="卖家" :span="2">
          {{ currentTrade.seller }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Search, Close } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 搜索表单
const searchForm = reactive({
  type: "",
  status: "",
  tradeTime: [],
});

// 交易列表
const tradeList = ref([
  {
    id: "TR001",
    nftName: "数字艺术品1",
    type: "transfer",
    price: 5000,
    status: "pending",
    createTime: "2023-06-15 10:30:45",
    buyer: "0x1234567890abcdef",
    seller: "0xabcdef1234567890",
  },
  {
    id: "TR002",
    nftName: "数字艺术品2",
    type: "authorize",
    price: 3500,
    status: "completed",
    createTime: "2023-06-14 15:45:22",
    buyer: "0xabcdef1234567890",
    seller: "0x1234567890abcdef",
  },
]);

const total = ref(100);
const selectedTrades = ref([]);
const tradeDetailDialogVisible = ref(false);
const currentTrade = ref({});

// 搜索和筛选
const handleSearch = () => {
  ElMessage.success("搜索成功");
};

const resetSearch = () => {
  searchForm.type = "";
  searchForm.status = "";
  searchForm.tradeTime = [];
};

// 选择变化
const handleSelectionChange = (val) => {
  selectedTrades.value = val;
};

// 查看交易详情
const viewTradeDetails = (trade) => {
  currentTrade.value = trade;
  tradeDetailDialogVisible.value = true;
};

// 确认交易
const confirmTrade = (trade) => {
  ElMessageBox.confirm(`确定要确认交易 ${trade.id} 吗?`, "确认交易", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "success",
  })
    .then(() => {
      trade.status = "completed";
      ElMessage.success("交易确认成功");
    })
    .catch(() => {
      ElMessage.info("已取消确认");
    });
};

// 取消交易
const cancelTrade = (trade) => {
  ElMessageBox.confirm(`确定要取消交易 ${trade.id} 吗?`, "取消交易", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      trade.status = "cancelled";
      ElMessage.success("交易取消成功");
    })
    .catch(() => {
      ElMessage.info("已取消操作");
    });
};

// 批量取消
const batchCancel = () => {
  if (selectedTrades.value.length === 0) {
    ElMessage.warning("请选择要取消的交易");
    return;
  }

  ElMessageBox.confirm(
    `确定要取消选中的 ${selectedTrades.value.length} 笔交易吗?`,
    "批量取消",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      selectedTrades.value.forEach((trade) => {
        trade.status = "cancelled";
      });
      ElMessage.success("批量取消成功");
    })
    .catch(() => {
      ElMessage.info("已取消操作");
    });
};

// 分页处理
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
};

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
};

// 辅助函数：获取交易类型标签
const getTypeTagType = (type) => {
  const typeMap = {
    transfer: "success",
    authorize: "warning",
  };
  return typeMap[type] || "info";
};

// 辅助函数：获取交易类型标签
const getTypeLabel = (type) => {
  const typeMap = {
    transfer: "转让",
    authorize: "授权",
  };
  return typeMap[type] || "未知";
};

// 辅助函数：获取交易状态标签
const getStatusTagType = (status) => {
  const statusMap = {
    pending: "warning",
    completed: "success",
    cancelled: "danger",
  };
  return statusMap[status] || "info";
};

// 辅助函数：获取交易状态标签
const getStatusLabel = (status) => {
  const statusMap = {
    pending: "进行中",
    completed: "已完成",
    cancelled: "已取消",
  };
  return statusMap[status] || "未知";
};
</script>

<style lang="less" scoped>
.admin-trade {
  .search-filter {
    margin-bottom: 20px;
  }

  .operation-buttons {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
