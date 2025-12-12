# API 文档

## 在线文档地址
Swagger UI：http://localhost:3000/api
所有 API 接口的完整文档、测试工具和类型定义都在 Swagger 中提供。

## 快速开始
1. 启动后端服务
2. 访问 http://localhost:3000/api
3. 在页面中直接测试所有接口

## 认证方式
请求头需携带 JWT Token，格式：

```http
Authorization: Bearer <your_jwt_token>
```

Token 获取：通过 /auth/login 接口登录后获取。

## 文档使用提示
Swagger UI 提供完整的接口列表、参数说明、在线测试和响应示例。