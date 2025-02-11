import Mock from "mockjs";
import { faker } from "@faker-js/faker/locale/zh_CN";

// 生成作品列表数据
function generateWorks(count = 10) {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    image: faker.image.url(),
    category: faker.helpers.arrayElement([
      "digital-art",
      "photography",
      "music",
      "video",
    ]),
    tags: faker.helpers.arrayElements(
      ["abstract", "realistic", "modern", "traditional"],
      2
    ),
    price: faker.commerce.price(),
    author: {
      id: faker.string.uuid(),
      nickname: faker.person.fullName(),
      avatar: faker.image.avatar(),
    },
    createdAt: faker.date.recent(),
    views: faker.number.int({ min: 0, max: 10000 }),
  }));
}

// 作品列表接口
Mock.mock(/\/api\/works(\?.+)?$/, "get", (options) => {
  const params = new URLSearchParams(options.url.split("?")[1]);
  const page = parseInt(params.get("page")) || 1;
  const pageSize = parseInt(params.get("pageSize")) || 10;
  const category = params.get("category");
  const tags = params.get("tags")?.split(",") || [];

  let works = generateWorks(100);

  // 筛选
  if (category) {
    works = works.filter((work) => work.category === category);
  }
  if (tags.length > 0) {
    works = works.filter((work) => tags.some((tag) => work.tags.includes(tag)));
  }

  // 排序
  const sortType = params.get("sortType");
  const sortOrder = params.get("sortOrder");
  if (sortType) {
    works.sort((a, b) => {
      let comparison = 0;
      switch (sortType) {
        case "latest":
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        case "popular":
          comparison = b.views - a.views;
          break;
        case "price":
          comparison = b.price - a.price;
          break;
      }
      return sortOrder === "asc" ? -comparison : comparison;
    });
  }

  return {
    code: 200,
    data: {
      list: works.slice((page - 1) * pageSize, page * pageSize),
      total: works.length,
    },
    message: "获取成功",
  };
});

// 作品详情接口
Mock.mock(/\/api\/works\/\w+$/, "get", () => {
  return {
    code: 200,
    data: {
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: faker.image.url(),
      attachments: Array.from({ length: 3 }, () => faker.image.url()),
      category: faker.helpers.arrayElement([
        "digital-art",
        "photography",
        "music",
        "video",
      ]),
      tags: faker.helpers.arrayElements(
        ["abstract", "realistic", "modern", "traditional"],
        2
      ),
      originalId: faker.string.alphanumeric(10).toUpperCase(),
      price: faker.commerce.price(),
      author: {
        id: faker.string.uuid(),
        nickname: faker.person.fullName(),
        avatar: faker.image.avatar(),
      },
      createdAt: faker.date.recent(),
      views: faker.number.int({ min: 0, max: 10000 }),
    },
    message: "获取成功",
  };
});
