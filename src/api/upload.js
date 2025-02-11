import request from "@/utils/request";

// 文件上传
export function uploadFile(data) {
  return request({
    url: "/api/upload",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
}
