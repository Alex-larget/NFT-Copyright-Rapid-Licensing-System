import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupRouterGuard } from './router/guard'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/mock/nft'
import '@/mock/user'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

setupRouterGuard(router)

window.addEventListener('error', (event) => {
  if (event.message === 'ResizeObserver loop completed with undelivered notifications.') {
    // 忽略这个特定的警告
    event.stopImmediatePropagation()
  }
})

app.mount('#app') 