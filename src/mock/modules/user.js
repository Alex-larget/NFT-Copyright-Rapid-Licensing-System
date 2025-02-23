import Mock from "mockjs";
import { faker } from "@faker-js/faker/locale/zh_CN";

// 模拟用户数据
const users = [
  {
    username: "admin",
    password: "123456",
    userInfo: {
      id: "1",
      nickname: "管理员",
      avatar: faker.image.avatar(),
      email: "admin@example.com",
      role: "admin",
    },
  },
  {
    username: "user",
    password: "123456",
    userInfo: {
      id: "2",
      nickname: "测试用户",
      avatar: faker.image.avatar(),
      email: "user@example.com",
      role: "user",
    },
  },
];

// 登录接口
Mock.mock(/\/api\/user\/login/, "post", (options) => {
  // 获取请求体数据
  const body = JSON.parse(options.body);
  const { username, password } = body;

  // 简单的验证逻辑,实际项目中需要替换为真实的验证逻辑
  if (["admin", "user"].includes(username) && password === "123456") {
    return {
      code: 200,
      data: {
        token: faker.string.uuid(),
        userInfo: {
          id: faker.string.uuid(),
          username: "admin",
          nickname: "管理员",
          avatar: faker.image.avatar(),
          email: faker.internet.email(),
          bio: faker.lorem.paragraph(),
        },
      },
      message: "登录成功",
    };
  } else {
    return {
      code: 401,
      message: "用户名或密码错误",
    };
  }
});

// 注册接口
Mock.mock("/api/user/register", "post", (options) => {
  const { username, email } = JSON.parse(options.body);

  // 模拟用户名和邮箱重复检查
  if (username === "admin" || username === "user") {
    return {
      code: 400,
      message: "用户名已存在",
    };
  }

  if (email === "admin@example.com" || email === "user@example.com") {
    return {
      code: 400,
      message: "邮箱已被使用",
    };
  }

  return {
    code: 200,
    message: "注册成功",
  };
});

// 登出接口
Mock.mock("/api/user/logout", "post", () => {
  return {
    code: 200,
    message: "登出成功",
  };
});

// 获取用户信息接口
Mock.mock("/api/user/info", "get", () => {
  return {
    code: 200,
    data: users[1].userInfo,
    message: "获取成功",
  };
});
