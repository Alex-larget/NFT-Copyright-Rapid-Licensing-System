import Mock from "mockjs";
import { faker } from "@faker-js/faker/locale/zh_CN";

// 生成NFT列表数据
function generateNFTs(count = 10) {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    image: faker.image.url(),
    type: faker.helpers.arrayElement(["original", "child"]),
    tradeType: faker.helpers.arrayElement(["transfer", "authorize"]),
    price: faker.commerce.price(),
    validUntil: faker.date.future(),
    authScopes: faker.helpers.arrayElements(
      [
        { label: "商业使用", value: "commercial" },
        { label: "衍生创作", value: "derivative" },
        { label: "展览展示", value: "exhibition" },
        { label: "广告宣传", value: "advertising" },
      ],
      faker.number.int({ min: 1, max: 4 })
    ),
    owner: {
      id: faker.string.uuid(),
      nickname: faker.person.fullName(),
      avatar: faker.image.avatar(),
    },
    createdAt: faker.date.recent(),
  }));
}

// NFT列表接口
Mock.mock(/\/api\/market\/nfts(\?.+)?$/, "get", (options) => {
  const params = new URLSearchParams(options.url.split("?")[1]);
  const page = parseInt(params.get("page")) || 1;
  const pageSize = parseInt(params.get("pageSize")) || 10;
  const keyword = params.get("keyword");
  const nftType = params.get("nftType");
  const tradeType = params.get("tradeType");
  const minPrice = parseFloat(params.get("minPrice"));
  const maxPrice = parseFloat(params.get("maxPrice"));
  const validityStart = params.get("validityStart");
  const validityEnd = params.get("validityEnd");
  const authScopes = params.get("authScopes")?.split(",") || [];

  let nfts = generateNFTs(100);

  // 关键词搜索
  if (keyword) {
    nfts = nfts.filter(
      (nft) =>
        nft.title.toLowerCase().includes(keyword.toLowerCase()) ||
        nft.id.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 藏品类型筛选
  if (nftType) {
    nfts = nfts.filter((nft) => nft.type === nftType);
  }

  // 交易类型筛选
  if (tradeType) {
    nfts = nfts.filter((nft) => nft.tradeType === tradeType);
  }

  // 价格区间筛选
  if (!isNaN(minPrice)) {
    nfts = nfts.filter((nft) => parseFloat(nft.price) >= minPrice);
  }
  if (!isNaN(maxPrice)) {
    nfts = nfts.filter((nft) => parseFloat(nft.price) <= maxPrice);
  }

  // 有效期筛选
  if (validityStart) {
    const startDate = new Date(validityStart);
    nfts = nfts.filter((nft) => new Date(nft.validUntil) >= startDate);
  }
  if (validityEnd) {
    const endDate = new Date(validityEnd);
    nfts = nfts.filter((nft) => new Date(nft.validUntil) <= endDate);
  }

  // 授权范围筛选
  if (authScopes.length > 0) {
    nfts = nfts.filter((nft) =>
      authScopes.every((scope) =>
        nft.authScopes.some((item) => item.value === scope)
      )
    );
  }

  return {
    code: 200,
    data: {
      list: nfts.slice((page - 1) * pageSize, page * pageSize),
      total: nfts.length,
    },
    message: "获取成功",
  };
});

// NFT详情接口
Mock.mock(/\/api\/market\/nfts\/\w+$/, "get", () => {
  return {
    code: 200,
    data: {
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: faker.image.url(),
      type: faker.helpers.arrayElement(["original", "child"]),
      tradeType: faker.helpers.arrayElement(["transfer", "authorize"]),
      price: faker.commerce.price(),
      validUntil: faker.date.future(),
      authScopes: faker.helpers.arrayElements(
        [
          { label: "商业使用", value: "commercial" },
          { label: "衍生创作", value: "derivative" },
          { label: "展览展示", value: "exhibition" },
          { label: "广告宣传", value: "advertising" },
        ],
        faker.number.int({ min: 1, max: 4 })
      ),
      owner: {
        id: faker.string.uuid(),
        nickname: faker.person.fullName(),
        avatar: faker.image.avatar(),
      },
      createdAt: faker.date.recent(),
    },
    message: "获取成功",
  };
});

// 创建交易接口
Mock.mock("/api/market/trades", "post", () => {
  return {
    code: 200,
    data: {
      id: faker.string.uuid(),
      createdAt: faker.date.recent(),
    },
    message: "交易创建成功",
  };
});
