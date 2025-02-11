<template>
  <div class="front-layout">
    <!-- 导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">NFT电子藏品平台</router-link>
        </div>
        <nav class="nav-menu">
          <router-link to="/">首页</router-link>
          <router-link to="/works">作品展示</router-link>
          <router-link to="/market">交易行</router-link>
          <router-link v-if="isLoggedIn" to="/nft">NFT中心</router-link>
          <router-link to="/about">关于我们</router-link>
        </nav>
        <div class="user-area">
          <template v-if="isLoggedIn">
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" :src="userInfo.avatar" />
                <span class="nickname">{{ userInfo.nickname }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToUserCenter">个人中心</el-dropdown-item>
                  <el-dropdown-item @click="goToProfile">资料修改</el-dropdown-item>
                  <el-divider direction="horizontal" />
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="goToLogin">登录</el-button>
          </template>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© {{ currentYear }} NFT电子藏品平台 版权所有</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store'

const router = useRouter()
const store = useMainStore()

const isLoggedIn = computed(() => store.isLoggedIn)
const userInfo = computed(() => store.userInfo)
const currentYear = computed(() => new Date().getFullYear())

const goToLogin = () => router.push('/login')
const goToUserCenter = () => router.push('/user/center')
const goToProfile = () => router.push('/user/profile')

const handleLogout = async () => {
  await store.logout()
  router.push('/login')
}
</script>

<style lang="less" scoped>
@import "@/styles/variables.less";
@import "@/styles/mixins.less";

.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

  .user-area {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      
      .nickname {
        margin-left: 8px;
      }
    }
  }
}

.main-content {
  flex: 1;
  margin-top: 60px;
  min-height: calc(100vh - 60px - 60px); // 减去header和footer的高度
}

.footer {
  height: 60px;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
</style> 