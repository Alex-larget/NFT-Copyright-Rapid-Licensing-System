<template>
  <div id="app">
    <router-view />
    <BasicFooter />
  </div>
</template>

<script>
import BasicFooter from "@/components/BasicFooter.vue";

export default {
  name: "App",
  components: {
    BasicFooter,
  },
};
</script>

<style>
/* 全局样式 */
</style>
