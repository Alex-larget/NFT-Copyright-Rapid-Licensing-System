<template>
  <nav class="navbar">
    <el-menu 
      mode="horizontal" 
      :router="true"
      active-text-color="#409EFF"
    >
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/works">作品展示</el-menu-item>
    </el-menu>
    <div class="navbar-right">
      <template v-if="!userStore.isLoggedIn">
        <el-button @click="router.push('/login')">登录</el-button>
        <el-button type="primary" @click="router.push('/register')">
          注册
        </el-button>
      </template>
      <template v-else>
        <el-dropdown>
          <span>
            <el-avatar :src="userStore.userInfo?.avatar" />
            {{ userStore.userInfo?.username }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/profile')">
                个人中心
              </el-dropdown-item>
              <el-dropdown-item @click="handleLogout">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    router.push('/login')
  })
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.navbar-right {
  display: flex;
  align-items: center;
}
</style> 