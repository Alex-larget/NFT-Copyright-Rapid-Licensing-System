<template>
  <div id="app">
    <router-view />
    <BasicFooter />
  </div>
</template>

<script setup>
import BasicFooter from "@/components/BasicFooter.vue";
import { createPinia, setActivePinia } from "pinia";
import { useRouter } from "vue-router";
import { useMainStore } from "@/store";

const pinia = createPinia();
setActivePinia(pinia);

const router = useRouter();
const store = useMainStore();
</script>

<style>
/* 全局样式 */
</style>
