import request from "@/utils/request";

// 获取用户统计数据
export function getUserStats() {
  return request({
    url: "/api/user/stats",
    method: "get",
  });
}

// 获取最近交易记录
export function getRecentTrades(params) {
  return request({
    url: "/api/user/trades/recent",
    method: "get",
    params,
  });
}

// 获取用户的NFT列表
export function getUserNFTs(params) {
  return request({
    url: "/api/user/nfts",
    method: "get",
    params,
  });
}

// 更新用户资料
export function updateUserProfile(data) {
  return request({
    url: "/api/user/profile",
    method: "put",
    data,
  });
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: "/api/user/password",
    method: "put",
    data,
  });
}
