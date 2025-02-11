import { defineStore } from "pinia";
import { login, logout } from "@/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "null"),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    // 登录
    async login(data) {
      try {
        const res = await login(data);
        this.token = res.data.token;
        this.userInfo = res.data.userInfo;

        // 保存到本地存储
        localStorage.setItem("token", this.token);
        localStorage.setItem("userInfo", JSON.stringify(this.userInfo));

        return res;
      } catch (error) {
        throw error;
      }
    },

    // 登出
    async logout() {
      try {
        await logout();
        this.clearUserInfo();
      } catch (error) {
        console.error("登出失败:", error);
        // 即使接口失败也清除本地信息
        this.clearUserInfo();
      }
    },

    // 清除用户信息
    clearUserInfo() {
      this.token = "";
      this.userInfo = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },

    // 更新用户信息
    updateUserInfo(data) {
      this.userInfo = {
        ...this.userInfo,
        ...data,
      };
      localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
    },
  },
});
