import { createRouter, createWebHistory } from "vue-router";
import FrontLayout from "@/layouts/FrontLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
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
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: () => import("@/views/admin/Dashboard/index.vue"),
      },
      {
        path: "wallet",
        name: "AdminWallet",
        component: () => import("@/views/admin/Wallet/index.vue"),
      },
      {
        path: "collection",
        name: "AdminCollection",
        component: () => import("@/views/admin/Collection/index.vue"),
      },
      {
        path: "trade",
        name: "AdminTrade",
        component: () => import("@/views/admin/Trade/index.vue"),
      },
      {
        path: "user",
        name: "AdminUser",
        component: () => import("@/views/admin/User/index.vue"),
      },
      {
        path: "auth",
        name: "AdminAuth",
        component: () => import("@/views/admin/Auth/index.vue"),
      },
      {
        path: "role",
        name: "AdminRole",
        component: () => import("@/views/admin/Role/index.vue"),
      },
      {
        path: "menu",
        name: "AdminMenu",
        component: () => import("@/views/admin/Menu/index.vue"),
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
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/front/NotFound/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const mainStore = useMainStore();
  const token = mainStore.token;
  const userInfo = mainStore.userInfo;

  // 需要管理员权限的路由
  const adminRoutes = [
    "/admin",
    "/admin/dashboard",
    "/admin/wallet",
    "/admin/collection",
    "/admin/trade",
    "/admin/user",
    "/admin/auth",
    "/admin/role",
    "/admin/menu",
  ];

  // 检查是否需要登录
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next("/login");
      return;
    }

    // 检查管理员权限
    // if (to.matched.some((record) => record.meta.requiresAdmin)) {
    //   if (!userInfo || userInfo.role !== "admin") {
    //     next("/");
    //     return;
    //   }
    // }
  }

  next();
});

export default router;
