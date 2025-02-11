import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { UserInfo } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 使用 ref 存储 token 和用户信息
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(
    JSON.parse(localStorage.getItem('userInfo') || 'null')
  )

  // 计算属性：是否已登录
  const isLoggedIn = computed(() => !!token.value)

  // 设置 token
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 设置用户信息
  function setUserInfo(info: UserInfo) {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    logout
  }
}) 