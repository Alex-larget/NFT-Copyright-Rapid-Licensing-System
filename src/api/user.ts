import request from '@/utils/request'
import { LoginForm, RegisterForm, UserInfo } from '@/types/user'

export const getUserList = () => {
  return request.get('/users')
}

export const login = (data: LoginForm) => {
  return request.post<{
    token: string
    userInfo: UserInfo
  }>('/login', data)
}

export const register = (data: RegisterForm) => {
  return request.post<{
    token: string
    userInfo: UserInfo
  }>('/register', data)
}

// 更新用户信息
export const updateUserProfile = (data: Partial<UserInfo>) => {
  return request.put<UserInfo>('/user/profile', data)
} 