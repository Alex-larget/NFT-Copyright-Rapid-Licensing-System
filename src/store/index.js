import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => {
    const state = {
      token: localStorage.getItem("token") || "",
      // 定义状态
    };
    return state;
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
    // ...
  },

  actions: {
    // 定义动作
  },
});
