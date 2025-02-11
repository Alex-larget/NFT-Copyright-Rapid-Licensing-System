import Mock from "mockjs";
import { faker } from "@faker-js/faker/locale/zh_CN";

// 生成用户统计数据
Mock.mock("/api/user/stats", "get", () => {
  return {
    code: 200,
    data: {
      nftCount: faker.number.int({ min: 0, max: 100 }),
      totalAmount: faker.number.float({ min: 0, max: 100000, precision: 2 }),
      pendingCount: faker.number.int({ min: 0, max: 10 }),
    },
    message: "获取成功",
  };
});

// 生成最近交易记录
Mock.mock("/api/user/trades/recent", "get", () => {
  const trades = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    nftName: faker.commerce.productName(),
    type: faker.helpers.arrayElement(["transfer", "authorize"]),
    price: faker.commerce.price(),
    status: faker.helpers.arrayElement(["pending", "success", "failed"]),
    createTime: faker.date.recent(),
  }));

  return {
    code: 200,
    data: trades,
    message: "获取成功",
  };
});

// 生成用户NFT列表
Mock.mock("/api/user/nfts", "get", () => {
  const nfts = Array.from({ length: 6 }, () => ({
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    image: faker.image.url(),
    price: faker.commerce.price(),
    type: faker.helpers.arrayElement(["original", "child"]),
    status: faker.helpers.arrayElement(["normal", "trading", "locked"]),
    createTime: faker.date.recent(),
  }));

  return {
    code: 200,
    data: nfts,
    message: "获取成功",
  };
});

// 更新用户资料
Mock.mock("/api/user/profile", "put", () => {
  return {
    code: 200,
    message: "更新成功",
  };
});

// 修改密码
Mock.mock("/api/user/password", "put", (options) => {
  const { oldPassword } = JSON.parse(options.body);

  // 模拟密码验证
  if (oldPassword === "123456") {
    return {
      code: 200,
      message: "修改成功",
    };
  } else {
    return {
      code: 400,
      message: "原密码错误",
    };
  }
});
