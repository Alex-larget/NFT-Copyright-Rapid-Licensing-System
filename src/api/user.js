import request from "@/utils/request";

// 登录
export function login(data) {
  return request({
    url: "/api/user/login",
    method: "post",
    data,
  });
}

// 登出
export function logout() {
  return request({
    url: "/api/user/logout",
    method: "post",
  });
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: "/api/user/info",
    method: "get",
  });
}

// 注册
export function register(data) {
  return request({
    url: "/api/user/register",
    method: "post",
    data,
  });
}
