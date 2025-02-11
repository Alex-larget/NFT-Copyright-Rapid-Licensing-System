import request from "@/utils/request";

// 获取NFT列表
export function getNFTList(params) {
  return request({
    url: "/api/market/nfts",
    method: "get",
    params,
  });
}

// 获取NFT详情
export function getNFTDetail(id) {
  return request({
    url: `/api/market/nfts/${id}`,
    method: "get",
  });
}

// 创建交易
export function createTrade(data) {
  return request({
    url: "/api/market/trades",
    method: "post",
    data,
  });
}
