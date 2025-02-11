import request from "@/utils/request";

// 获取作品列表
export function getWorks(params) {
  return request({
    url: "/api/works",
    method: "get",
    params,
  });
}

// 获取作品详情
export function getWorkDetail(id) {
  return request({
    url: `/api/works/${id}`,
    method: "get",
  });
}
