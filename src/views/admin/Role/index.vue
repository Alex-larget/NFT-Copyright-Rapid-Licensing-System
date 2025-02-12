<template>
  <div class="admin-role">
    <h1>角色管理</h1>

    <!-- 操作按钮 -->
    <div class="operation-buttons">
      <el-button type="primary" @click="openAddRoleDialog">
        <el-icon><Plus /></el-icon>添加角色
      </el-button>
    </div>

    <!-- 角色列表 -->
    <el-card class="role-list">
      <el-table :data="roleList" stripe>
        <el-table-column prop="id" label="角色ID" width="100" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column label="权限" width="300">
          <template #default="scope">
            <el-tag
              v-for="permission in scope.row.permissions"
              :key="permission"
              type="info"
              class="permission-tag"
            >
              {{ getPermissionLabel(permission) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="editRole(scope.row)">
              编辑
            </el-button>
            <el-button
              type="warning"
              link
              @click="configPermissions(scope.row)"
            >
              配置权限
            </el-button>
            <el-button type="danger" link @click="deleteRole(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="isEditMode ? '编辑角色' : '添加角色'"
      width="500px"
    >
      <el-form
        ref="roleFormRef"
        :model="currentRole"
        :rules="roleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="currentRole.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="currentRole.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmRoleDialog"> 确认 </el-button>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog v-model="permissionDialogVisible" title="配置权限" width="600px">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          {{ currentRole.name }}
        </el-form-item>
        <el-form-item label="权限选择">
          <el-tree
            ref="permissionTreeRef"
            :data="permissionTreeData"
            show-checkbox
            node-key="id"
            :default-checked-keys="currentRole.permissions"
            @check="handlePermissionCheck"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="permissionDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmPermissions"> 确认 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 角色列表数据
const roleList = ref([
  {
    id: "1",
    name: "超级管理员",
    description: "系统最高权限角色",
    permissions: [
      "dashboard",
      "user_manage",
      "role_manage",
      "nft_manage",
      "trade_manage",
    ],
  },
  {
    id: "2",
    name: "内容审核员",
    description: "负责NFT和用户内容审核",
    permissions: ["nft_manage", "auth_manage"],
  },
  {
    id: "3",
    name: "财务管理员",
    description: "负责交易和财务管理",
    permissions: ["trade_manage", "wallet_manage"],
  },
]);

// 权限树数据
const permissionTreeData = [
  {
    id: "dashboard",
    label: "仪表盘",
    children: [{ id: "dashboard_view", label: "查看仪表盘" }],
  },
  {
    id: "user_manage",
    label: "用户管理",
    children: [
      { id: "user_list", label: "用户列表" },
      { id: "user_add", label: "添加用户" },
      { id: "user_edit", label: "编辑用户" },
      { id: "user_delete", label: "删除用户" },
    ],
  },
  {
    id: "role_manage",
    label: "角色管理",
    children: [
      { id: "role_list", label: "角色列表" },
      { id: "role_add", label: "添加角色" },
      { id: "role_edit", label: "编辑角色" },
      { id: "role_delete", label: "删除角色" },
    ],
  },
  {
    id: "nft_manage",
    label: "NFT管理",
    children: [
      { id: "nft_list", label: "藏品列表" },
      { id: "nft_create", label: "创建藏品" },
      { id: "nft_edit", label: "编辑藏品" },
      { id: "nft_delete", label: "删除藏品" },
    ],
  },
  {
    id: "trade_manage",
    label: "交易管理",
    children: [
      { id: "trade_list", label: "交易列表" },
      { id: "trade_confirm", label: "确认交易" },
      { id: "trade_cancel", label: "取消交易" },
    ],
  },
];

// 对话框相关
const roleDialogVisible = ref(false);
const permissionDialogVisible = ref(false);
const isEditMode = ref(false);
const roleFormRef = ref(null);
const permissionTreeRef = ref(null);

// 当前角色
const currentRole = ref({
  id: "",
  name: "",
  description: "",
  permissions: [],
});

// 表单验证规则
const roleFormRules = {
  name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在2-10个字符", trigger: "blur" },
  ],
  description: [
    { max: 100, message: "描述不能超过100个字符", trigger: "blur" },
  ],
};

// 添加角色
const openAddRoleDialog = () => {
  isEditMode.value = false;
  currentRole.value = {
    id: "",
    name: "",
    description: "",
    permissions: [],
  };
  roleDialogVisible.value = true;
};

// 编辑角色
const editRole = (role) => {
  isEditMode.value = true;
  currentRole.value = { ...role };
  roleDialogVisible.value = true;
};

// 确认角色对话框
const confirmRoleDialog = () => {
  roleFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditMode.value) {
        // 更新角色
        const index = roleList.value.findIndex(
          (r) => r.id === currentRole.value.id
        );
        roleList.value[index] = { ...currentRole.value };
        ElMessage.success("角色更新成功");
      } else {
        // 添加角色
        currentRole.value.id = (roleList.value.length + 1).toString();
        roleList.value.push({ ...currentRole.value });
        ElMessage.success("角色添加成功");
      }
      roleDialogVisible.value = false;
    }
  });
};

// 配置权限
const configPermissions = (role) => {
  currentRole.value = { ...role };
  permissionDialogVisible.value = true;
};

// 处理权限树选择
const handlePermissionCheck = (data, { checkedKeys }) => {
  currentRole.value.permissions = checkedKeys;
};

// 确认权限配置
const confirmPermissions = () => {
  const index = roleList.value.findIndex((r) => r.id === currentRole.value.id);
  roleList.value[index].permissions = currentRole.value.permissions;
  ElMessage.success("权限配置成功");
  permissionDialogVisible.value = false;
};

// 删除角色
const deleteRole = (role) => {
  ElMessageBox.confirm(`确定要删除角色 ${role.name} 吗?`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      roleList.value = roleList.value.filter((r) => r.id !== role.id);
      ElMessage.success("删除成功");
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 获取权限标签
const getPermissionLabel = (permission) => {
  const flattenPermissions = {};

  permissionTreeData.forEach((category) => {
    category.children.forEach((perm) => {
      flattenPermissions[perm.id] = perm.label;
    });
  });

  return flattenPermissions[permission] || permission;
};
</script>

<style lang="less" scoped>
.admin-role {
  .operation-buttons {
    margin-bottom: 20px;
  }

  .permission-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
