<template>
  <div class="home">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-card shadow="hover">
          <h2>欢迎使用Vue 3 + Element Plus</h2>
          <p>这是一个基础的应用程序模板</p>
          <el-button type="primary" @click="showMessage">点击显示消息</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

const showMessage = () => {
  ElMessage.success('你好，Element Plus!')
}
</script> 