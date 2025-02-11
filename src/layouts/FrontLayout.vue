<template>
  <div class="front-layout">
    <!-- 导航栏 -->
    <BasicHeader />

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <!-- <footer class="footer">
      <p>© {{ currentYear }} NFT电子藏品平台 版权所有</p>
    </footer> -->
  </div>
</template>

<script setup>
import BasicHeader from "@/components/BasicHeader.vue";
</script>

<style lang="less" scoped>
@import "@/styles/variables.less";
@import "@/styles/mixins.less";

.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-top: 60px;
  min-height: calc(100vh - 60px - 60px); // 减去header和footer的高度
}

.footer {
  height: 60px;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
</style>
