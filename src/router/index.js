import { createRouter, createWebHistory } from "vue-router";
import FrontLayout from "@/layouts/FrontLayout.vue";
import { useMainStore } from "@/store";

const routes = [
  {
    path: "/",
    component: FrontLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/front/Home/index.vue"),
      },
      {
        path: "works",
        name: "Works",
        component: () => import("@/views/front/Works/index.vue"),
      },
      {
        path: "market",
        name: "Market",
        component: () => import("@/views/front/Market/index.vue"),
      },
      {
        path: "nft",
        name: "NFTCenter",
        component: () => import("@/views/front/NFTCenter/index.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "about",
        name: "About",
        component: () => import("@/views/front/About/index.vue"),
      },
      {
        path: "user",
        component: () => import("@/views/front/User/Layout.vue"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "center",
            name: "UserCenter",
            component: () => import("@/views/front/User/Center.vue"),
          },
          {
            path: "profile",
            name: "UserProfile",
            component: () => import("@/views/front/User/Profile.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/front/Login/index.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/front/Register/index.vue"),
  },
  {
    path: "/works/:id",
    name: "WorkDetail",
    component: () => import("@/views/front/Works/detail.vue"),
  },
  {
    path: "/market/:id",
    name: "NFTDetail",
    component: () => import("@/views/front/Market/detail.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const store = useMainStore();
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
