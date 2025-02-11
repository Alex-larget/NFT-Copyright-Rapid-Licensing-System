<template>
  <div class="basic-layout">
    <header class="header">
      <nav>
        <router-link to="/"> 首页 </router-link>
        <router-link to="/works"> 作品展示 </router-link>
        <router-link to="/market"> 交易行 </router-link>
        <router-link v-if="isLoggedIn" to="/nft"> NFT中心 </router-link>
        <router-link to="/about"> 关于我们 </router-link>
      </nav>
      <div v-if="isLoggedIn" class="user-info">
        <el-dropdown>
          <span class="user-dropdown">
            {{ userInfo.nickname }}
            <el-avatar :src="userInfo.avatar" size="small" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>资料修改</el-dropdown-item>
              <el-dropdown-divider />
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['Home', 'Works', 'Market']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
    <footer class="footer">
      <p>© 2024 NFT电子藏品平台 版权所有</p>
    </footer>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useMainStore } from "@/store";

export default {
  name: "BasicLayout",
  setup() {
    const store = useMainStore();
    const isLoggedIn = computed(() => store.isLoggedIn);
    const userInfo = computed(() => store.userInfo);

    return {
      isLoggedIn,
      userInfo,
    };
  },
};
</script>

<style scoped lang="less">
.basic-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

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
}

.main-content {
  flex: 1;
  padding: 20px;
}

.footer {
  text-align: center;
  padding: 20px;
  background: #f7f7f7;
}
</style>
