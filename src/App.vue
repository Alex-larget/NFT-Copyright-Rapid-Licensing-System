<template>
  <div id="app">
    <el-config-provider>
      <Navbar />
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import '@/mock/nft'
import Navbar from '@/components/Navbar.vue'
// 可以在这里添加全局配置
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 