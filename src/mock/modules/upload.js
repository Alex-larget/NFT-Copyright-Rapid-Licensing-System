import Mock from "mockjs";
import { faker } from "@faker-js/faker/locale/zh_CN";

// 文件上传接口
Mock.mock("/api/upload", "post", () => {
  return {
    code: 200,
    data: {
      url: faker.image.avatar(), // 返回一个随机头像URL
      filename: faker.system.fileName(),
    },
    message: "上传成功",
  };
});
