import Mock from "mockjs";
import { faker } from "@faker-js/faker/locale/zh_CN";
import "./modules/market";
import "./modules/user";
import "./modules/userCenter";
import "./modules/upload";

// 配置Mock延时
Mock.setup({
  timeout: "300-600",
});

// 生成艺术图片的函数
const generateArtImage = () => {
  const categories = [
    "abstract",
    "art",
    "painting",
    "digital-art",
    "illustration",
    "graphic-design",
    "minimalism",
    "surreal",
    "contemporary-art",
  ];

  return faker.image.urlPicsumPhotos({
    width: 1200,
    height: 800,
    grayscale: Math.random() > 0.7, // 随机黑白
    blur: Math.random() > 0.8 ? Math.floor(Math.random() * 10) : 0, // 随机模糊
  });
};

// 替换原有的 generateLandscapeImage
const generateLandscapeImage = generateArtImage;

// 用户相关接口
Mock.mock(/\/api\/user\/login/, "post", () => {
  return {
    code: 200,
    data: {
      token: faker.string.uuid(),
      userInfo: {
        id: faker.string.uuid(),
        nickname: faker.person.fullName(),
        avatar: faker.image.avatar(),
        email: faker.internet.email(),
      },
    },
    message: "登录成功",
  };
});

// 轮播图数据
Mock.mock(/\/api\/banners/, "get", () => {
  return {
    code: 200,
    data: Array.from({ length: 6 }, () => ({
      id: faker.string.uuid(),
      title: faker.lorem.sentence(),
      image: generateLandscapeImage(),
    })),
    message: "获取成功",
  };
});

// 最新作品接口
Mock.mock(/\/api\/works\/latest/, "get", () => {
  return {
    code: 200,
    data: Array.from({ length: 8 }, () => ({
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: generateLandscapeImage(),
      author: {
        id: faker.string.uuid(),
        nickname: faker.person.fullName(),
        avatar: faker.image.avatar(),
      },
    })),
    message: "获取成功",
  };
});

// 藏品相关接口
Mock.mock(/\/api\/nft\/list/, "get", () => {
  return {
    code: 200,
    data: Array.from({ length: 8 }, () => ({
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: generateLandscapeImage(),
      price: faker.commerce.price(),
      type: Math.random() > 0.5 ? "original" : "derivative",
      tradeType: Math.random() > 0.5 ? "transfer" : "authorize",
      owner: {
        id: faker.string.uuid(),
        nickname: faker.person.fullName(),
        avatar: faker.image.avatar(),
      },
    })),
    message: "获取成功",
  };
});

export default Mock;
