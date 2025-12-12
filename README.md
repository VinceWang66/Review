电商管理系统（Review）
**

## 相关文档

[数据库](./DATABASE.md) · [架构](./ARCHITECTURE.md) · [部署](./DEPLOYMENT.md) · [API](./API\_DOCUMENTATION.md)

## 项目简介

一个完整的电商前后端分离系统，基于 NestJS + React 技术栈构建，包含用户认证、商品管理、购物流程等核心功能，支持多角色权限控制，适用于快速搭建电商平台原型或二次开发。

## 功能特性

### 用户系统

- 用户注册 / 登录（JWT 认证）
- 角色权限控制（用户 / 卖家 / 管理员）

### 商品管理

- 商品完整 CRUD 操作
- 分类管理
- 商品列表 / 详情展示
- 商家商品管理界面

### 购物流程

- 多商品购买支持
- 购物车逻辑实现


## 技术栈

### 后端技术

- 框架: NestJS + TypeScript
- 数据库: PostgreSQL + Prisma ORM
- 认证: JWT 令牌 + 密码哈希
- 文档: Swagger 自动生成 API 文档
- 验证: 数据验证管道

### 前端技术
- 框架: React 18 + TypeScript
- UI 库: Ant Design 5.0
- 路由: React Router 6
- 构建: Vite 5.0

## 快速开始

# 方式一：传统部署（推荐首次体验）
## 1. 克隆项目
git clone https://github.com/VinceWang66/Review.git
cd Review

## 2. 启动后端服务
cd backend
npm install  # 安装依赖
npm run start:dev  # 开发环境启动（热更新）

## 3. 启动前端服务（新建终端，返回项目根目录）
cd ../frontend
npm install  # 安装依赖
npm run dev  # 开发环境启动

# 方式二：Docker 部署（一键启动，推荐生产 / 测试环境）
## 1. 克隆项目并进入目录
git clone https://github.com/VinceWang66/Review.git
cd Review

## 2. 一键启动所有服务（后端、前端、数据库）
docker-compose up -d

# 环境配置

### Docker 部署（默认）
项目已包含完整的 Docker 配置，开箱即用：

```bash
# 一键启动所有服务
docker-compose up -d
```
默认使用容器内 PostgreSQL 数据库，配置如下：
数据库：ecommerce
用户名：admin
密码：admin123
连接：postgresql://admin:admin123@postgres:5432/ecommerce

#本地开发配置
如需在宿主机开发，配置后端环境变量：
## 1. 复制环境变量示例
```bash
cp backend/.env.example backend/.env
```
## 2. 修改 .env 文件
- 连接宿主机数据库或容器数据库
- 修改 JWT 密钥（生产环境必须）


## 访问地址

前端应用: http://localhost:5173
后端 API: http://localhost:3000
API 文档: http://localhost:3000/api（Swagger 自动生成）

## 默认账户

系统初始化后会创建默认管理员账户：
- **邮箱**: `admin@example.com`
- **密码**: `admin123`
- **角色**: 管理员

管理员可以登录后创建商家账户和普通用户。
商家账户可以进一步管理商品。

```markdown
## ⚠️ 安全警告（生产环境必读）

### 必须修改的配置
默认配置仅用于开发测试，**生产环境部署前必须修改**：

1. **JWT 密钥**
   - 默认：`zjP9h6ZI5LoSKCRj`（已公开）
   - 建议生成新密钥：
     ```bash
     openssl rand -base64 32
     # 或
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

2. **数据库密码**
   - 修改 `docker-compose.yml` 中的 `POSTGRES_PASSWORD`
   - 同步修改后端 `DATABASE_URL` 中的密码

3. **管理员密码**
   - 默认：`admin123`
   - 首次登录后立即修改
```

### 安全建议
- 使用 HTTPS 协议
- 定期备份数据库
- 监控系统日志
- 保持依赖包更新

## 详细部署指南

##方式一：Docker Compose 部署（推荐）
环境要求
Docker 20.10+
Docker Compose 2.0+
部署步骤
环境检查
### 验证Docker版本
docker --version
### 验证Docker Compose版本
docker-compose --version

若版本不满足要求，请参考Docker 官方文档和Docker Compose 官方文档进行升级。
克隆项目并进入目录
git clone https://github.com/VinceWang66/Review.git
cd Review  # 进入项目根目录

##启动服务

### 后台启动所有服务（-d 表示 detached 模式）

docker-compose up -d

启动成功后，Docker 会自动拉取所需镜像（PostgreSQL、后端、前端）并创建容器。
服务验证

### 查看容器运行状态
docker-compose ps

若所有服务状态为 up，表示启动成功；若有服务启动失败，可通过日志排查：
### 查看指定服务日志（例如后端服务）
docker-compose logs -f backend

常用管理命令
### 查看所有服务状态
docker-compose ps

### 实时查看所有服务日志
docker-compose logs -f

### 停止所有服务（保留容器和数据）
docker-compose down

### 停止并删除容器、网络（保留数据卷）
docker-compose down --volumes

### 重启所有服务
docker-compose restart

### 代码更新后重建服务
docker-compose up -d --build

### 进入后端容器执行命令（例如数据库操作）
docker-compose exec backend bash

### 备份数据库（将PostgreSQL数据导出为SQL文件）
docker-compose exec db pg\_dump -U postgres review\_db > backup\_$(date +%Y%m%d).sql

##方式二：传统本地部署
###环境要求
Node.js 18+
PostgreSQL 14+
包管理器：npm 或 yarn
数据库客户端（可选）：pgAdmin、DBeaver 等
部署步骤
##环境准备

### 验证Node.js版本
node --version
### 验证npm版本
npm --version
### 验证PostgreSQL服务（确保已启动）
systemctl status postgresql  # Linux
### 或
pg\_ctl status  # macOS

克隆项目并进入目录
git clone https://github.com/VinceWang66/Review.git
cd Review

安装依赖
### 安装后端依赖
```bash
cd backend
npm install  # 或 yarn install
cd ..
```

### 安装前端依赖
```bash
cd frontend
npm install  # 或 yarn install
cd ..
```

环境变量配置
后端配置：
```bash
cd backend
cp .env.example .env  # 复制示例配置
# 编辑.env文件，配置关键信息
vim .env  # 或使用其他编辑器
```

##.env 文件核心配置项：
### 数据库配置
DATABASE\_URL="postgresql://username:password@localhost:5432/review\_db?schema=public"
### JWT配置
JWT\_SECRET="your-secret-key"
JWT\_EXPIRES\_IN="3600s"
### 服务端口
PORT=3000

##前端配置（可选）：
```bash
cd frontend
cp .env.example .env
```
## 配置后端API地址
```bash
VITE\_API\_BASE\_URL="http://localhost:3000"
cd ..
```

##数据库初始化
```bash
## 进入后端目录
cd backend
# 1. 创建数据库（若未手动创建）
npx prisma db push
# 2. 执行数据库迁移
npx prisma migrate deploy
# 3. 填充测试数据（包括管理员账户）
npx prisma db seed
cd ..
```

##启动服务
###开发环境：
```bash
# 启动后端（热更新）
cd backend
npm run start:dev
# 新建终端，启动前端（热更新）
cd frontend
npm run dev
```

### 服务初始化
首次启动后，系统会自动：
1. 创建数据库表结构
2. 执行数据迁移
3. 创建默认管理员账户（admin@example.com / admin123）

如需重新初始化：
```bash
# 重置数据库并重新初始化
docker-compose down --volumes
docker-compose up -d
docker-compose exec backend npx prisma db seed
```

##生产环境：
```bash
# 后端构建并启动
cd backend
npm run build
npm run start:prod

# 前端构建（需Nginx等服务器托管）
cd frontend
npm run build
```
### 构建产物在 dist 目录，配置Nginx指向该目录


## 项目结构

```
Review/
├── backend/                # 后端服务（NestJS）
│   ├── src/                # 源代码
│   │   ├── modules/        # 业务模块
│   │   │   ├── admin/      # 管理员模块
│   │   │   ├── auth/       # 认证模块
│   │   │   ├── categories/ # 分类模块
│   │   │   ├── order_items/# 订单项模块
│   │   │   ├── orders/     # 订单模块
│   │   │   ├── owner_guard/# 权限守卫
│   │   │   ├── products/   # 商品模块
│   │   │   ├── seller/     # 卖家模块
│   │   │   ├── test/       # 测试模块
│   │   │   └── users/      # 用户模块
│   │   ├── prisma/         # Prisma配置
│   │   │   ├── schema.prisma    # 数据库模型
│   │   │   └── prisma-client-exception/ # 异常处理
│   │   ├── prisma.module.ts     # Prisma模块
│   │   ├── prisma.service.ts    # Prisma服务
│   │   ├── prisma.service.spec.ts # Prisma服务测试
│   │   ├── app.controller.ts    # 根控制器
│   │   ├── app.controller.spec.ts # 控制器测试
│   │   ├── app.module.ts        # 根模块
│   │   ├── app.service.ts       # 根服务
│   │   └── main.ts              # 应用入口
│   ├── .env.example        # 环境变量示例
│   └── package.json        # 依赖配置
├── frontend/               # 前端应用（React）
│   ├── src/                # 源代码
│   │   ├── assets/         # 静态资源
│   │   ├── components/     # 公共组件
│   │   ├── style/          # 样式文件
│   │   ├── utils/          # 工具函数
│   │   ├── App.css         # 主应用样式
│   │   ├── App.tsx         # 主应用组件
│   │   ├── index.css       # 全局样式
│   │   └── main.tsx        # 应用入口
│   ├── .env.example        # 环境变量示例
│   └── package.json        # 依赖配置
├── docker-compose.yml      # Docker编排配置
├── ARCHITECTURE.md         # 系统架构设计文档
├── DATABASE.md             # 数据库设计文档
├── DEPLOYMENT.md           # 部署指南
└── API_DOCUMENTATION.md    # API接口文档
```

## 开发状态

当前版本：v1.0 - 基础功能完成

开发中：管理后台增强功能

计划中：订单模块完善、数据统计分析、支付集成



## 许可证
MIT License

## 常见问题

### 1. 如何登录系统？
系统初始化后已有默认管理员账户：
- 邮箱：`admin@example.com`
- 密码：`admin123`

### 2. 如何创建商家账户？
管理员登录后，在用户管理界面可以将普通用户设置为卖家角色。

### 3. 数据库没有初始数据？
执行种子数据命令：

```bash
# 传统方式
npx prisma db seed

# Docker 方式
docker-compose exec backend npx prisma db seed
```

### 4. 前端显示"获取数据失败"？
按以下步骤排查：
确保后端服务已启动：docker-compose ps
检查后端日志：docker-compose logs backend
确认数据库迁移已执行：npx prisma migrate deploy

### 5. 如何修改管理员密码？
方法一：重新执行种子数据（会重置为 admin123）
方法二：直接操作数据库：
```sql
UPDATE users SET password = '新密码哈希值' WHERE email = 'admin@example.com';
```

### 端口占用：
若启动时提示端口被占用，可修改 .env 文件中的 PORT（后端）或 VITE\_PORT（前端）配置。

数据库连接失败：
根据部署方式检查：

**Docker 部署**：
- 检查 `docker-compose.yml` 中的 `DATABASE_URL`
- 确认数据库容器正常运行：`docker-compose ps`
- 默认连接：`postgresql://admin:admin123@postgres:5432/ecommerce`

**本地开发**：
- 检查 `backend/.env` 中的 `DATABASE_URL`
- 确认 PostgreSQL 服务已启动
- 可能需要修改连接地址为 `localhost`

### 依赖安装失败：
尝试更换 npm 镜像源（npm config set registry https://registry.npm.taobao.org）或使用 yarn 安装。