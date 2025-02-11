import Mock from 'mockjs'
import { UserInfo, UserRole } from '@/types/user'

// 模拟登录
Mock.mock('/api/login', 'post', {
  code: 200,
  message: '登录成功',
  data: {
    token: '@guid',
    userInfo: {
      id: '@id',
      username: '@cname',
      email: '@email',
      avatar: '@image(100x100)',
      wallet: '0x' + '@string("hex", 40)',
      role: UserRole.NORMAL
    }
  }
})

// 模拟注册
Mock.mock('/api/register', 'post', {
  code: 200,
  message: '注册成功',
  data: {
    token: '@guid',
    userInfo: {
      id: '@id',
      username: '@cname',
      email: '@email',
      avatar: '@image(100x100)',
      wallet: '0x' + '@string("hex", 40)',
      role: UserRole.NORMAL
    }
  }
}) 