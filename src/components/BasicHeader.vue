<script setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/modules/user";
import { watch } from "vue";

const userStore = useUserStore();
const { updateNavbar } = storeToRefs(userStore);
const { isLoggedIn, userInfo } = storeToRefs(userStore);

watch(updateNavbar, (newValue) => {
  if (newValue) {
    // 强制重新渲染组件
    userStore.updateNavbar = false;
    updateNavbar.value = false;
  }
});
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/"> NFT电子藏品平台 </router-link>
      </div>
      <nav class="nav-menu">
        <router-link to="/"> 首页 </router-link>
        <router-link to="/works"> 作品展示 </router-link>
        <router-link to="/market"> 交易行 </router-link>
        <router-link v-if="isLoggedIn" to="/nft"> NFT中心 </router-link>
        <router-link to="/about"> 关于我们 </router-link>
      </nav>
      <div v-if="isLoggedIn" class="user-info">
        <el-dropdown>
          <span class="user-dropdown">
            <div class="user-area">
              <el-avatar :src="userInfo.avatar" size="small" />
              <span class="nickname">{{ userInfo.nickname }}</span>
            </div>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>资料修改</el-dropdown-item>
              <el-dropdown-item divided> 退出登录 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div v-else class="auth-buttons">
        <router-link to="/login"> 登录 </router-link>
        <router-link to="/register"> 注册 </router-link>
      </div>
    </div>
  </header>
</template>

<style lang="less" scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;

    nav {
      a {
        margin-right: 20px;
        text-decoration: none;
        color: #333;

        &.router-link-active {
          color: #409eff;
        }
      }
    }

    .logo {
      font-size: 20px;
      font-weight: bold;

      a {
        color: @primary-color;
        text-decoration: none;
      }
    }

    .nav-menu {
      display: flex;
      gap: 30px;

      a {
        color: #333;
        text-decoration: none;
        font-size: 16px;

        &.router-link-active {
          color: @primary-color;
        }

        &:hover {
          color: @primary-color;
        }
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      .user-area {
        display: flex;
        .nickname {
          line-height: 24px;
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
