<template>
  <div class="admin-auth">
    <!-- 搜索和筛选区域 -->
    <el-card class="search-filter">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>

        <el-form-item label="认证类型">
          <el-select
            v-model="searchForm.authType"
            placeholder="选择认证类型"
            clearable
          >
            <el-option label="个人认证" value="personal" />
            <el-option label="企业认证" value="company" />
          </el-select>
        </el-form-item>

        <el-form-item label="认证状态">
          <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
            clearable
          >
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>

        <el-form-item label="申请时间">
          <el-date-picker
            v-model="searchForm.applyTime"
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
        type="success"
        :disabled="!selectedAuths.length"
        @click="batchApprove"
      >
        <el-icon><Check /></el-icon>批量通过
      </el-button>
      <el-button
        type="danger"
        :disabled="!selectedAuths.length"
        @click="batchReject"
      >
        <el-icon><Close /></el-icon>批量拒绝
      </el-button>
    </div>

    <!-- 认证列表 -->
    <el-card class="auth-list">
      <el-table
        :data="authList"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="申请ID" width="100" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="authType" label="认证类型">
          <template #default="scope">
            <el-tag :type="getAuthTypeTagType(scope.row.authType)">
              {{ getAuthTypeLabel(scope.row.authType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名/企业名称" />
        <el-table-column prop="status" label="认证状态">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="viewAuthDetails(scope.row)">
              详情
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              type="success"
              link
              @click="approveAuth(scope.row)"
            >
              通过
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              type="danger"
              link
              @click="rejectAuth(scope.row)"
            >
              拒绝
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

    <!-- 认证详情对话框 -->
    <el-dialog v-model="authDetailDialogVisible" title="认证详情" width="600px">
      <template v-if="currentAuth">
        <!-- 个人认证详情 -->
        <el-descriptions
          v-if="currentAuth.authType === 'personal'"
          :column="2"
          border
        >
          <el-descriptions-item label="用户名">
            {{ currentAuth.username }}
          </el-descriptions-item>
          <el-descriptions-item label="真实姓名">
            {{ currentAuth.realName }}
          </el-descriptions-item>
          <el-descriptions-item label="身份证号">
            {{ currentAuth.idCardNumber }}
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">
            {{ currentAuth.applyTime }}
          </el-descriptions-item>
          <el-descriptions-item label="身份证正面" span="2">
            <el-image
              :src="currentAuth.idCardFrontImage"
              :preview-src-list="[currentAuth.idCardFrontImage]"
              fit="cover"
            />
          </el-descriptions-item>
          <el-descriptions-item label="身份证反面" span="2">
            <el-image
              :src="currentAuth.idCardBackImage"
              :preview-src-list="[currentAuth.idCardBackImage]"
              fit="cover"
            />
          </el-descriptions-item>
        </el-descriptions>

        <!-- 企业认证详情 -->
        <el-descriptions
          v-else-if="currentAuth.authType === 'company'"
          :column="2"
          border
        >
          <el-descriptions-item label="用户名">
            {{ currentAuth.username }}
          </el-descriptions-item>
          <el-descriptions-item label="企业名称">
            {{ currentAuth.companyName }}
          </el-descriptions-item>
          <el-descriptions-item label="统一社会信用代码">
            {{ currentAuth.socialCreditCode }}
          </el-descriptions-item>
          <el-descriptions-item label="法人代表">
            {{ currentAuth.legalRepresentative }}
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">
            {{ currentAuth.applyTime }}
          </el-descriptions-item>
          <el-descriptions-item label="营业执照" span="2">
            <el-image
              :src="currentAuth.businessLicenseImage"
              :preview-src-list="[currentAuth.businessLicenseImage]"
              fit="cover"
            />
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Search, Check, Close } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 搜索表单
const searchForm = reactive({
  username: "",
  authType: "",
  status: "",
  applyTime: [],
});

// 认证列表
const authList = ref([
  {
    id: "1",
    username: "user001",
    authType: "personal",
    realName: "张三",
    idCardNumber: "110101199003078888",
    status: "pending",
    applyTime: "2023-06-15 10:30:45",
    idCardFrontImage: "https://example.com/front.jpg",
    idCardBackImage: "https://example.com/back.jpg",
  },
  {
    id: "2",
    username: "company001",
    authType: "company",
    companyName: "科技创新有限公司",
    socialCreditCode: "91110108MA01F5XT3G",
    legalRepresentative: "李四",
    status: "pending",
    applyTime: "2023-06-10 14:45:22",
    businessLicenseImage: "https://example.com/license.jpg",
  },
]);

const total = ref(100);
const selectedAuths = ref([]);
const authDetailDialogVisible = ref(false);
const currentAuth = ref(null);

// 搜索和筛选
const handleSearch = () => {
  ElMessage.success("搜索成功");
};

const resetSearch = () => {
  searchForm.username = "";
  searchForm.authType = "";
  searchForm.status = "";
  searchForm.applyTime = [];
};

// 选择变化
const handleSelectionChange = (val) => {
  selectedAuths.value = val;
};

// 查看认证详情
const viewAuthDetails = (auth) => {
  currentAuth.value = auth;
  authDetailDialogVisible.value = true;
};

// 单个审核通过
const approveAuth = (auth) => {
  ElMessageBox.confirm(
    `确定要通过 ${auth.username} 的认证申请吗?`,
    "审核通过",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "success",
    }
  )
    .then(() => {
      auth.status = "approved";
      ElMessage.success("认证审核通过");
    })
    .catch(() => {
      ElMessage.info("已取消审核");
    });
};

// 单个审核拒绝
const rejectAuth = (auth) => {
  ElMessageBox.confirm(
    `确定要拒绝 ${auth.username} 的认证申请吗?`,
    "审核拒绝",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      auth.status = "rejected";
      ElMessage.success("认证审核已拒绝");
    })
    .catch(() => {
      ElMessage.info("已取消审核");
    });
};

// 批量通过
const batchApprove = () => {
  if (selectedAuths.value.length === 0) {
    ElMessage.warning("请选择要审核的申请");
    return;
  }

  ElMessageBox.confirm(
    `确定要通过选中的 ${selectedAuths.value.length} 个认证申请吗?`,
    "批量审核通过",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "success",
    }
  )
    .then(() => {
      selectedAuths.value.forEach((auth) => {
        auth.status = "approved";
      });
      ElMessage.success("批量审核通过成功");
    })
    .catch(() => {
      ElMessage.info("已取消审核");
    });
};

// 批量拒绝
const batchReject = () => {
  if (selectedAuths.value.length === 0) {
    ElMessage.warning("请选择要审核的申请");
    return;
  }

  ElMessageBox.confirm(
    `确定要拒绝选中的 ${selectedAuths.value.length} 个认证申请吗?`,
    "批量审核拒绝",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      selectedAuths.value.forEach((auth) => {
        auth.status = "rejected";
      });
      ElMessage.success("批量审核拒绝成功");
    })
    .catch(() => {
      ElMessage.info("已取消审核");
    });
};

// 分页处理
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
};

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
};

// 辅助函数：获取认证类型标签类型
const getAuthTypeTagType = (authType) => {
  const authTypeMap = {
    personal: "success",
    company: "warning",
  };
  return authTypeMap[authType] || "info";
};

// 辅助函数：获取认证类型标签
const getAuthTypeLabel = (authType) => {
  const authTypeMap = {
    personal: "个人认证",
    company: "企业认证",
  };
  return authTypeMap[authType] || "未知";
};

// 辅助函数：获取状态标签类型
const getStatusTagType = (status) => {
  const statusMap = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };
  return statusMap[status] || "info";
};

// 辅助函数：获取状态标签
const getStatusLabel = (status) => {
  const statusMap = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝",
  };
  return statusMap[status] || "未知";
};
</script>

<style lang="less" scoped>
.admin-auth {
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
