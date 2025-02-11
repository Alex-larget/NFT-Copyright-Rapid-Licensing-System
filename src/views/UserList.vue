<template>
  <div class="user-list">
    <h2>用户列表</h2>
    <el-table :data="users" border>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="email" label="邮箱" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserList } from '@/api/user'

const users = ref([])

onMounted(async () => {
  const response = await getUserList()
  users.value = response.data.list
})
</script> 