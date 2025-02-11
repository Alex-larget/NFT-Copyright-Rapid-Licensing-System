<template>
  <div class="login-container">
    <el-form 
      ref="loginFormRef"
      :model="loginForm" 
      :rules="loginRules"
      @submit.prevent="handleLogin"
    >
      <el-form-item prop="username">
        <el-input 
          v-model="loginForm.username" 
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input 
          v-model="loginForm.password" 
          type="password" 
          placeholder="密码"
        />
      </el-form-item>
      <el-button 
        type="primary" 
        native-type="submit"
        :loading="loading"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/user'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const loading = ref(false)

const loginRules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }]
}

const handleLogin = async () => {
  loading.value = true
  try {
    const { data } = await login(loginForm)
    userStore.setToken(data.token)
    userStore.setUserInfo(data.userInfo)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    ElMessage.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script> 