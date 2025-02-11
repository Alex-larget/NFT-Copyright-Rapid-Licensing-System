import { defineStore } from "pinia";
import { login, logout } from "@/api/user";
import {
  setToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
} from "@/utils/auth";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    userInfo: getUserInfo(),
    updateNavbar: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    // 登录
    async login(loginForm) {
      const res = await login(loginForm);
      if (res.code === 200) {
        this.token = res.data.token;
        this.updateUserInfo(res.data.userInfo);
        setToken(res.data.token);
        this.updateNavbar = true;
        return res;
      } else {
        throw new Error(res.message);
      }
    },

    // 登出
    async logout() {
      try {
        await logout();
        this.clearUserInfo();
        this.updateNavbar = true;
      } catch (error) {
        console.error("登出失败:", error);
        // 即使接口失败也清除本地信息
        this.clearUserInfo();
        this.updateNavbar = true;
      }
    },

    // 清除用户信息
    clearUserInfo() {
      this.token = "";
      this.userInfo = null;
      removeToken();
      removeUserInfo();
    },

    // 更新用户信息
    updateUserInfo(data) {
      this.userInfo = {
        ...this.userInfo,
        ...data,
      };
      setUserInfo(this.userInfo);
    },
  },
});
