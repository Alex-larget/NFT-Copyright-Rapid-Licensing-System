const TokenKey = "token";
const UserInfoKey = "userInfo";

export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function setToken(token) {
  localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  localStorage.removeItem(TokenKey);
}

export function getUserInfo() {
  const userInfo = localStorage.getItem(UserInfoKey);
  return userInfo ? JSON.parse(userInfo) : null;
}

export function setUserInfo(userInfo) {
  localStorage.setItem(UserInfoKey, JSON.stringify(userInfo));
}

export function removeUserInfo() {
  localStorage.removeItem(UserInfoKey);
}
