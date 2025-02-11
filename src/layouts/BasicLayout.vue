<template>
  <div class="basic-layout">
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['Home', 'Works', 'Market']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useMainStore } from "@/store";

export default {
  name: "BasicLayout",
  setup() {
    const store = useMainStore();
    const isLoggedIn = computed(() => store.isLoggedIn);
    const userInfo = computed(() => store.userInfo);

    return {
      isLoggedIn,
      userInfo,
    };
  },
};
</script>

<style scoped lang="less">
.basic-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.footer {
  text-align: center;
  padding: 20px;
  background: #f7f7f7;
}
</style>
