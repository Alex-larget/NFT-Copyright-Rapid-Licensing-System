<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <p>抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="goHome"> 返回首页 </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.not-found-content {
  text-align: center;
}

h1 {
  font-size: 120px;
  color: #3498db;
  margin-bottom: 20px;
}

p {
  font-size: 24px;
  color: #666;
  margin-bottom: 30px;
}
</style>
