import { Router } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

export function setupRouterGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    
    // 需要登录的路由
    const authRoutes = ['/profile', '/works/create']
    
    if (authRoutes.includes(to.path) && !userStore.isLoggedIn) {
      ElMessage.warning('请先登录')
      next('/login')
    } else {
      next()
    }
  })
} 