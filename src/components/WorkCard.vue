<template>
  <div class="work-card" @click="goToDetail">
    <div class="work-image">
      <el-image :src="work.image" fit="cover" :preview-src-list="[work.image]">
        <template #error>
          <div class="image-placeholder">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
    </div>
    <div class="work-info">
      <h3 class="title">
        {{ work.title }}
      </h3>
      <p class="description">
        {{ work.description }}
      </p>
      <div class="author">
        <el-avatar :size="24" :src="work.author.avatar" />
        <span class="name">{{ work.author.nickname }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Picture } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const props = defineProps({
  work: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const goToDetail = () => {
  router.push(`/works/${props.work.id}`);
};
</script>

<style lang="less" scoped>
@import "@/styles/variables.less";
@import "@/styles/mixins.less";

.work-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }

  .work-image {
    height: 200px;
    overflow: hidden;

    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      color: #909399;
      font-size: 24px;
    }
  }

  .work-info {
    padding: 16px;

    .title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      .text-ellipsis();
    }

    .description {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
      .text-ellipsis();
    }

    .author {
      display: flex;
      align-items: center;
      gap: 8px;

      .name {
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
