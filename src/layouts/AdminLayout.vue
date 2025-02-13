<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <div class="logo">创作中心</div>
        <el-menu
          :router="true"
          :default-active="$route.path"
          class="admin-menu"
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><HomeFilled /></el-icon>
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

      <el-container>
        <el-header>
          <div class="header-content">
            <div class="left">
              <el-breadcrumb>
                <el-breadcrumb-item :to="{ path: '/admin' }">
                  首页
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{ currentPage }}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div class="right">
              <el-button type="primary" @click="$router.push('/')">
                <el-icon><House /></el-icon>返回首页
              </el-button>
              <el-dropdown>
                <div class="user-info">
                  <el-avatar :size="32" :src="userStore.userInfo?.avatar" />
                  <span class="name">{{ userStore.userInfo?.name }}</span>
                  <el-icon><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleLogout">
                      <el-icon><SwitchButton /></el-icon>退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-header>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import {
  HomeFilled,
  ArrowDown,
  House,
  SwitchButton,
  Setting,
  Wallet,
} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const currentPage = computed(() => {
  const routeMap = {
    "/admin": "仪表盘",
    "/admin/dashboard": "仪表盘",
    "/admin/nft": "NFT管理",
    "/admin/wallet": "电子钱包",
    "/admin/collection": "藏品管理",
    "/admin/trade": "交易管理",
    "/admin/user": "用户管理",
    "/admin/auth": "认证审核",
    "/admin/role": "角色管理",
    "/admin/menu": "菜单管理",
  };
  return routeMap[route.path] || "";
});

const handleLogout = () => {
  userStore.logout();
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.common-layout {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .el-container {
    height: 100%;

    .el-container {
      height: 100%;
      background-color: #f4f6f9;

      .el-main {
        padding: 20px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #ddd;
          border-radius: 3px;

          &:hover {
            background-color: #ccc;
          }
        }

        &::-webkit-scrollbar-track {
          background-color: #f4f6f9;
        }

        .el-card {
          border-radius: 4px;
          border: none;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;

          :deep(.el-card__header) {
            padding: 15px 20px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 16px;
            font-weight: 500;
            color: #666;
          }
        }
      }
    }
  }

  .el-aside {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
    border-right: 1px solid #f0f0f0;

    .logo {
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #666;
      border-bottom: 1px solid #f0f0f0;
    }

    .admin-menu {
      flex: 1;
      border-right: none;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 3px;
      }

      :deep(.el-menu-item) {
        color: #666;
        height: 50px;
        line-height: 50px;
        margin: 4px 0;
        padding: 0 20px;
        font-size: 14px;

        &:hover {
          color: #6777ef;
          background-color: #f4f6f9;
        }

        &.is-active {
          color: #6777ef;
          background-color: #f4f6f9;
          font-weight: 500;
        }

        .el-icon {
          margin-right: 10px;
          font-size: 18px;
        }
      }
    }
  }

  .el-header {
    height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 20px;

    .header-content {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        .el-breadcrumb {
          font-size: 14px;
        }
      }

      .right {
        display: flex;
        align-items: center;
        gap: 16px;

        .el-button {
          background-color: #6777ef;
          border-color: #6777ef;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.3s;

          &:hover {
            background-color: #f4f6f9;
          }

          .name {
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;

  .el-icon {
    color: #666;
  }

  &:hover {
    color: #6777ef;
    background-color: #f4f6f9;

    .el-icon {
      color: #6777ef;
    }
  }
}
</style>
