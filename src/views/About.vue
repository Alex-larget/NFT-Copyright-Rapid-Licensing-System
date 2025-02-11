<template>
  <div class="about">
    <el-descriptions title="项目信息" :column="1" border>
      <el-descriptions-item label="项目名称">Vue 3 + Element Plus 应用</el-descriptions-item>
      <el-descriptions-item label="技术栈">Vue 3, TypeScript, Element Plus</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ currentTime }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentTime = ref(new Date().toLocaleString())
</script> 