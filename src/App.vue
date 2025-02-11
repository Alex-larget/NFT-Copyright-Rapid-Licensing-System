<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>我的Vue 3 + Element Plus 应用</h1>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// 可以在这里添加应用级别的逻辑
</script>

<style>
#app {
  font-family: Arial, sans-serif;
}
</style> 