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

  const category = categories[Math.floor(Math.random() * categories.length)];

  return faker.image.urlPicsumPhotos({
    width: 1200,
    height: 800,
    grayscale: Math.random() > 0.7,
    blur: Math.random() > 0.8 ? Math.floor(Math.random() * 10) : 0,
  });
};

// 轮播图数据
Mock.mock(/\/api\/banners/, "get", () => {
  return {
    code: 200,
    data: Array.from({ length: 3 }, () => ({
      id: faker.string.uuid(),
      title: faker.lorem.sentence(),
      image: generateArtImage(),
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
      image: generateArtImage(),
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
      image: generateArtImage(),
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

// 最新NFT接口
Mock.mock(/\/api\/nft\/latest/, "get", () => {
  return {
    code: 200,
    data: Array.from({ length: 8 }, () => ({
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: generateArtImage(),
      category: faker.helpers.arrayElement(["original", "derivative"]),
      price: faker.commerce.price(),
      owner: {
        id: faker.string.uuid(),
        nickname: faker.person.fullName(),
        avatar: faker.image.avatar(),
      },
    })),
    message: "获取成功",
  };
});

// 作品列表接口
Mock.mock(/\/api\/works/, "get", () => {
  return {
    code: 200,
    data: {
      total: 100, // 总数据量
      list: Array.from({ length: 12 }, () => ({
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image: generateArtImage(),
        category: faker.helpers.arrayElement([
          "digital-art",
          "photography",
          "illustration",
          "graphic-design",
        ]),
        tags: faker.helpers.arrayElements(
          ["abstract", "modern", "minimalist", "colorful", "surreal"],
          { min: 1, max: 3 }
        ),
        author: {
          id: faker.string.uuid(),
          nickname: faker.person.fullName(),
          avatar: faker.image.avatar(),
        },
        price: faker.commerce.price(),
        createdAt: faker.date.past().toISOString(),
        likes: faker.number.int({ min: 0, max: 1000 }),
        views: faker.number.int({ min: 0, max: 10000 }),
      })),
    },
    message: "获取成功",
  };
});

// 交易行接口
Mock.mock(/\/api\/market/, "get", () => {
  return {
    code: 200,
    data: {
      total: 100, // 总数据量
      list: Array.from({ length: 12 }, () => ({
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image: generateArtImage(),
        category: faker.helpers.arrayElement(["original", "derivative"]),
        tradeType: faker.helpers.arrayElement(["transfer", "authorize"]),
        price: faker.commerce.price(),
        originalPrice: faker.commerce.price(),
        priceChange: faker.number.float({ min: -50, max: 50, precision: 0.01 }),
        tags: faker.helpers.arrayElements(
          ["trending", "new", "limited", "popular"],
          { min: 1, max: 2 }
        ),
        owner: {
          id: faker.string.uuid(),
          nickname: faker.person.fullName(),
          avatar: faker.image.avatar(),
        },
        createdAt: faker.date.past().toISOString(),
        views: faker.number.int({ min: 0, max: 10000 }),
        likes: faker.number.int({ min: 0, max: 1000 }),
        authorizationScope: faker.helpers.arrayElements(
          ["commercial", "personal", "exhibition", "digital"],
          { min: 1, max: 2 }
        ),
      })),
    },
    message: "获取成功",
  };
});

export default Mock;
