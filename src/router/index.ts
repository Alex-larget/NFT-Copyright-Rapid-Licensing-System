import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/works',
    name: 'Works',
    component: () => import('@/views/works/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/Register.vue')
  },
  {
    path: '/works/create',
    name: 'CreateWork',
    component: () => import('@/views/works/Create.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/works/:id',
    name: 'WorkDetail',
    component: () => import('@/views/works/Detail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 