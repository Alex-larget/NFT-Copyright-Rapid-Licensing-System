<template>
  <div class="login-page">
    <div class="login-container">
      <h2>登录</h2>
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        label-width="0"
        size="large"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="register-link">
        <span>还没有账号？</span>
        <el-button type="primary" link @click="goToRegister">立即注册</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/modules/user";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const formRef = ref();
const loading = ref(false);

const loginForm = reactive({
  username: "",
  password: "",
});

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
};

const handleLogin = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        await userStore.login(loginForm);
        ElMessage.success("登录成功");
        
        // 跳转到之前的页面或首页
        const redirect = route.query.redirect || "/";
        router.replace(redirect);
      } catch (error) {
        ElMessage.error(error.message || "登录失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

const goToRegister = () => {
  router.push("/register");
};
</script>

<style lang="less" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.login-container {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }

  .login-button {
    width: 100%;
  }

  .register-link {
    margin-top: 16px;
    text-align: center;
    color: #666;
  }
}
</style> 