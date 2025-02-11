import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [
        ElementPlusResolver({
          importStyle: false,
        }),
        IconsResolver({
          prefix: "Icon",
        }),
      ],
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: false,
        }),
        IconsResolver({
          enabledCollections: ["ep"],
        }),
      ],
      dts: "src/components.d.ts",
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `
          @import "@/styles/variables.less";
          @import "@/styles/mixins.less";
        `,
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000", // 本地服务器
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
