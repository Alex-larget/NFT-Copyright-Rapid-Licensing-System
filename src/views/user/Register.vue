<template>
  <div class="register-container">
    <el-form 
      ref="registerFormRef"
      :model="registerForm" 
      :rules="registerRules"
      @submit.prevent="handleRegister"
    >
      <el-form-item prop="username">
        <el-input 
          v-model="registerForm.username" 
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="email">
        <el-input 
          v-model="registerForm.email" 
          placeholder="邮箱"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input 
          v-model="registerForm.password" 
          type="password" 
          placeholder="密码"
        />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input 
          v-model="registerForm.confirmPassword" 
          type="password" 
          placeholder="确认密码"
        />
      </el-form-item>
      <el-button 
        type="primary" 
        native-type="submit"
        :loading="loading"
      >
        注册
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api/user'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)

const registerRules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符之间' }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入正确的邮箱地址' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少6个字符' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    { 
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
    }
  ]
}

const handleRegister = async () => {
  loading.value = true
  try {
    const { data } = await register(registerForm)
    userStore.setToken(data.token)
    userStore.setUserInfo(data.userInfo)
    ElMessage.success('注册成功')
    router.push('/')
  } catch (error) {
    ElMessage.error('注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style> 