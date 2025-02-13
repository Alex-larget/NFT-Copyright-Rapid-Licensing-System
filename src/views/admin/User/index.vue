<template>
  <div class="admin-user">
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

        <el-form-item label="用户角色">
          <el-select v-model="searchForm.role" placeholder="选择角色" clearable>
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
            <el-option label="创作者" value="creator" />
          </el-select>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-date-picker
            v-model="searchForm.registerTime"
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
      <el-button type="primary" @click="openAddUserDialog">
        <el-icon><Plus /></el-icon>添加用户
      </el-button>
      <el-button
        type="danger"
        :disabled="!selectedUsers.length"
        @click="batchDelete"
      >
        <el-icon><Delete /></el-icon>批量删除
      </el-button>
    </div>

    <!-- 用户列表 -->
    <el-card class="user-list">
      <el-table
        :data="userList"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="用户ID" width="100" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag :type="getRoleTagType(scope.row.role)">
              {{ getRoleLabel(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="editUser(scope.row)">
              编辑
            </el-button>
            <el-button type="warning" link @click="resetPassword(scope.row)">
              重置密码
            </el-button>
            <el-button type="danger" link @click="deleteUser(scope.row)">
              删除
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

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="userDialogVisible"
      :title="isEditMode ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="currentUser"
        :rules="userFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="currentUser.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="currentUser.email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="currentUser.role" placeholder="选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
            <el-option label="创作者" value="creator" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isEditMode" label="密码" prop="password">
          <el-input
            v-model="currentUser.password"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="userDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmUserDialog"> 确认 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Search, Plus, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 搜索表单
const searchForm = reactive({
  username: "",
  role: "",
  registerTime: [],
});

// 用户列表
const userList = ref([
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    registerTime: "2023-01-15 10:30:45",
  },
  {
    id: "2",
    username: "user001",
    email: "user001@example.com",
    role: "user",
    registerTime: "2023-03-20 14:45:22",
  },
]);

const total = ref(100);
const selectedUsers = ref([]);
const userDialogVisible = ref(false);
const isEditMode = ref(false);
const userFormRef = ref(null);

// 当前用户
const currentUser = ref({
  username: "",
  email: "",
  role: "user",
  password: "",
});

// 表单验证规则
const userFormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
  role: [{ required: true, message: "请选择用户角色", trigger: "change" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码至少6个字符", trigger: "blur" },
  ],
};

// 搜索和筛选
const handleSearch = () => {
  ElMessage.success("搜索成功");
};

const resetSearch = () => {
  searchForm.username = "";
  searchForm.role = "";
  searchForm.registerTime = [];
};

// 选择变化
const handleSelectionChange = (val) => {
  selectedUsers.value = val;
};

// 打开添加用户对话框
const openAddUserDialog = () => {
  isEditMode.value = false;
  currentUser.value = {
    username: "",
    email: "",
    role: "user",
    password: "",
  };
  userDialogVisible.value = true;
};

// 编辑用户
const editUser = (user) => {
  isEditMode.value = true;
  currentUser.value = { ...user };
  userDialogVisible.value = true;
};

// 确认用户对话框
const confirmUserDialog = () => {
  userFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditMode.value) {
        // 更新用户
        const index = userList.value.findIndex(
          (u) => u.id === currentUser.value.id
        );
        userList.value[index] = { ...currentUser.value };
        ElMessage.success("用户更新成功");
      } else {
        // 添加用户
        userList.value.push({
          id: (userList.value.length + 1).toString(),
          ...currentUser.value,
          registerTime: new Date().toLocaleString(),
        });
        ElMessage.success("用户添加成功");
      }
      userDialogVisible.value = false;
    }
  });
};

// 重置密码
const resetPassword = (user) => {
  ElMessageBox.prompt("请输入新密码", "重置密码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^.{6,}$/,
    inputErrorMessage: "密码至少6个字符",
  })
    .then(({ value }) => {
      ElMessage.success("密码重置成功");
    })
    .catch(() => {
      ElMessage.info("已取消重置");
    });
};

// 删除用户
const deleteUser = (user) => {
  ElMessageBox.confirm(`确定要删除用户 ${user.username} 吗?`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userList.value = userList.value.filter((u) => u.id !== user.id);
      ElMessage.success("删除成功");
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 批量删除
const batchDelete = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning("请选择要删除的用户");
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedUsers.value.length} 个用户吗?`,
    "批量删除",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      userList.value = userList.value.filter(
        (user) =>
          !selectedUsers.value.some((selected) => selected.id === user.id)
      );
      ElMessage.success("批量删除成功");
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

// 辅助函数：获取角色标签类型
const getRoleTagType = (role) => {
  const roleMap = {
    admin: "danger",
    creator: "warning",
    user: "success",
  };
  return roleMap[role] || "info";
};

// 辅助函数：获取角色标签
const getRoleLabel = (role) => {
  const roleMap = {
    admin: "管理员",
    creator: "创作者",
    user: "普通用户",
  };
  return roleMap[role] || "未知";
};
</script>

<style lang="less" scoped>
.admin-user {
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
