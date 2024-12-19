import { createDefineMock } from "vite-plugin-mock-dev-server";

/**
 * 创建 mock 配置
 */
export const defineMock = createDefineMock((mock) => {
  // 修改 URL 拼接方式
  mock.url = "/dev-api/api/v1/" + mock.url;

  // 添加权限验证
  if (mock.auth) {
    const originalResponse = mock.response;
    mock.response = (req) => {
      const token = req.headers["authorization"];
      if (!token) {
        return {
          code: "A0301",
          data: null,
          msg: "请先登录",
        };
      }
      return originalResponse(req);
    };
  }
});
