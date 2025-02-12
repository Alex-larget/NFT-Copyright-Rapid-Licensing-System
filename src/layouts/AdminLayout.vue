<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <el-icon size="large">
            <Coin />
          </el-icon>
          <span>NFT管理平台</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><DataBoard /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>

          <el-sub-menu index="nft">
            <template #title>
              <el-icon><Wallet /></el-icon>
              <span>NFT管理</span>
            </template>
            <el-menu-item index="/admin/wallet"> 电子钱包 </el-menu-item>
            <el-menu-item index="/admin/collection"> 藏品管理 </el-menu-item>
            <el-menu-item index="/admin/trade"> 交易管理 </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/admin/user"> 用户管理 </el-menu-item>
            <el-menu-item index="/admin/auth"> 认证审核 </el-menu-item>
            <el-menu-item index="/admin/role"> 角色管理 </el-menu-item>
            <el-menu-item index="/admin/menu"> 菜单管理 </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 头部 -->
        <el-header>
          <div class="header-right">
            <el-dropdown>
              <span class="admin-info">
                <el-avatar :src="userInfo.avatar" />
                <span>{{ userInfo.nickname }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { Coin, DataBoard, Wallet, Setting } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);
const activeMenu = computed(() => route.path);

const handleMenuSelect = (index) => {
  router.push(index);
};

const handleLogout = async () => {
  await userStore.logout();
  router.push("/login");
};
</script>

<style lang="less" scoped>
.admin-layout {
  height: 100vh;

  .sidebar {
    background-color: #2c3e50;
    color: white;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      background-color: #1f2d3d;

      .el-icon {
        margin-right: 10px;
        color: white;
      }

      span {
        font-size: 18px;
        font-weight: bold;
        color: white;
      }
    }

    .el-menu {
      border-right: none;
      background-color: #2c3e50;

      .el-menu-item,
      .el-submenu__title {
        color: white;

        &:hover {
          background-color: #34495e;
        }

        &.is-active {
          background-color: #3498db;
        }
      }
    }
  }

  .el-header {
    background-color: white;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-bottom: 1px solid #eee;

    .header-right {
      .admin-info {
        display: flex;
        align-items: center;
        cursor: pointer;

        .el-avatar {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
