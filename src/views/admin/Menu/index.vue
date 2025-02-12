<template>
  <div class="admin-menu">
    <h1>菜单管理</h1>

    <!-- 操作按钮 -->
    <div class="operation-buttons">
      <el-button type="primary" @click="openAddMenuDialog">
        <el-icon><Plus /></el-icon>添加菜单
      </el-button>
    </div>

    <!-- 菜单树 -->
    <el-card class="menu-tree">
      <el-tree
        :data="menuList"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        draggable
        @node-drag-end="handleDragEnd"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <span>{{ data.label }}</span>
            <span class="menu-actions">
              <el-button
                type="primary"
                link
                size="small"
                @click.stop="editMenu(data)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                size="small"
                @click.stop="deleteMenu(data)"
              >
                删除
              </el-button>
            </span>
          </div>
        </template>
      </el-tree>
    </el-card>

    <!-- 添加/编辑菜单对话框 -->
    <el-dialog
      v-model="menuDialogVisible"
      :title="isEditMode ? '编辑菜单' : '添加菜单'"
      width="500px"
    >
      <el-form
        ref="menuFormRef"
        :model="currentMenu"
        :rules="menuFormRules"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="label">
          <el-input v-model="currentMenu.label" />
        </el-form-item>

        <el-form-item label="菜单路径" prop="path">
          <el-input v-model="currentMenu.path" />
        </el-form-item>

        <el-form-item label="菜单图标">
          <el-select v-model="currentMenu.icon" placeholder="选择图标">
            <el-option
              v-for="icon in iconList"
              :key="icon"
              :label="icon"
              :value="icon"
            >
              <el-icon><component :is="icon" /></el-icon>
              <span>{{ icon }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="currentMenu.parentId"
            :data="menuList"
            :props="defaultProps"
            placeholder="选择上级菜单"
            check-strictly
            clearable
          />
        </el-form-item>

        <el-form-item label="是否显示" prop="hidden">
          <el-switch v-model="currentMenu.hidden" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="menuDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="confirmMenuDialog"> 确认 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Plus } from "@element-plus/icons-vue";
import * as ElementPlusIcons from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 图标列表
const iconList = Object.keys(ElementPlusIcons);

// 菜单列表数据
const menuList = ref([
  {
    id: "1",
    label: "首页",
    path: "/dashboard",
    icon: "DataBoard",
    children: [],
  },
  {
    id: "2",
    label: "NFT管理",
    path: "/nft",
    icon: "Wallet",
    children: [
      {
        id: "2-1",
        label: "藏品列表",
        path: "/nft/collection",
        icon: "Goods",
      },
      {
        id: "2-2",
        label: "交易管理",
        path: "/nft/trade",
        icon: "Sell",
      },
    ],
  },
  {
    id: "3",
    label: "系统管理",
    path: "/system",
    icon: "Setting",
    children: [
      {
        id: "3-1",
        label: "用户管理",
        path: "/system/user",
        icon: "User",
      },
      {
        id: "3-2",
        label: "角色管理",
        path: "/system/role",
        icon: "UserFilled",
      },
      {
        id: "3-3",
        label: "菜单管理",
        path: "/system/menu",
        icon: "Menu",
      },
    ],
  },
]);

// 树节点配置
const defaultProps = {
  children: "children",
  label: "label",
};

// 对话框相关
const menuDialogVisible = ref(false);
const isEditMode = ref(false);
const menuFormRef = ref(null);

// 当前菜单
const currentMenu = ref({
  id: "",
  label: "",
  path: "",
  icon: "",
  parentId: "",
  hidden: false,
});

// 表单验证规则
const menuFormRules = {
  label: [
    { required: true, message: "请输入菜单名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在2-10个字符", trigger: "blur" },
  ],
  path: [{ required: true, message: "请输入菜单路径", trigger: "blur" }],
};

// 添加菜单
const openAddMenuDialog = () => {
  isEditMode.value = false;
  currentMenu.value = {
    id: "",
    label: "",
    path: "",
    icon: "",
    parentId: "",
    hidden: false,
  };
  menuDialogVisible.value = true;
};

// 编辑菜单
const editMenu = (menu) => {
  isEditMode.value = true;
  currentMenu.value = { ...menu };
  menuDialogVisible.value = true;
};

// 确认菜单对话框
const confirmMenuDialog = () => {
  menuFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditMode.value) {
        // 更新菜单
        updateMenuInTree(menuList.value, currentMenu.value);
        ElMessage.success("菜单更新成功");
      } else {
        // 添加菜单
        currentMenu.value.id = generateMenuId();
        addMenuToTree(menuList.value, currentMenu.value);
        ElMessage.success("菜单添加成功");
      }
      menuDialogVisible.value = false;
    }
  });
};

// 生成菜单ID
const generateMenuId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// 更新树中的菜单
const updateMenuInTree = (tree, menu) => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === menu.id) {
      tree[i] = { ...menu };
      return true;
    }
    if (tree[i].children) {
      if (updateMenuInTree(tree[i].children, menu)) {
        return true;
      }
    }
  }
  return false;
};

// 添加菜单到树
const addMenuToTree = (tree, menu) => {
  if (!menu.parentId) {
    tree.push(menu);
    return;
  }

  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === menu.parentId) {
      if (!tree[i].children) {
        tree[i].children = [];
      }
      tree[i].children.push(menu);
      return;
    }
    if (tree[i].children) {
      addMenuToTree(tree[i].children, menu);
    }
  }
};

// 删除菜单
const deleteMenu = (menu) => {
  ElMessageBox.confirm(`确定要删除菜单 ${menu.label} 吗?`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      removeMenuFromTree(menuList.value, menu);
      ElMessage.success("删除成功");
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 从树中移除菜单
const removeMenuFromTree = (tree, menu) => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === menu.id) {
      tree.splice(i, 1);
      return true;
    }
    if (tree[i].children) {
      if (removeMenuFromTree(tree[i].children, menu)) {
        return true;
      }
    }
  }
  return false;
};

// 拖拽结束处理
const handleDragEnd = (draggingNode, dropNode, dropType) => {
  ElMessage.success("菜单排序成功");
};
</script>

<style lang="less" scoped>
.admin-menu {
  .operation-buttons {
    margin-bottom: 20px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;

    .menu-actions {
      display: none;
    }

    &:hover {
      .menu-actions {
        display: block;
      }
    }
  }
}
</style>
