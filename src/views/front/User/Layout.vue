<template>
  <div class="user-layout">
    <div class="container">
      <el-row :gutter="20">
        <!-- 左侧菜单 -->
        <el-col :span="6">
          <div class="menu-card">
            <div class="user-info">
              <el-avatar :size="64" :src="userStore.userInfo?.avatar" />
              <h3>{{ userStore.userInfo?.nickname }}</h3>
              <p class="email">{{ userStore.userInfo?.email }}</p>
            </div>
            <el-menu
              :default-active="activeMenu"
              class="menu-list"
              @select="handleSelect"
            >
              <el-menu-item index="center">
                <el-icon><User /></el-icon>
                <span>个人中心</span>
              </el-menu-item>
              <el-menu-item index="profile">
                <el-icon><Setting /></el-icon>
                <span>资料修改</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-col>

        <!-- 右侧内容 -->
        <el-col :span="18">
          <div class="content-card">
            <router-view />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { User, Setting } from "@element-plus/icons-vue";
import { useUserStore } from "@/store/modules/user";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const activeMenu = computed(() =>
  route.name?.toLowerCase().replace("user", "")
);

const handleSelect = (key) => {
  router.push(`/user/${key}`);
};
</script>

<style lang="less" scoped>
.user-layout {
  padding: 20px 0;

  .menu-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .user-info {
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid #f0f0f0;

      h3 {
        margin: 12px 0 4px;
        font-size: 18px;
        color: #333;
      }

      .email {
        margin: 0;
        font-size: 14px;
        color: #999;
      }
    }

    .menu-list {
      border-right: none;
    }
  }

  .content-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    min-height: 500px;
    padding: 20px;
  }
}
</style>
