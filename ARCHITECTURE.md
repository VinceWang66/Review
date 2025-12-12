一、架构概览​
本项目采用经典的前后端分离架构，后端基于 NestJS 框架构建 RESTful API，前端使用 React 构建用户界面，通过 Prisma ORM 连接 PostgreSQL 数据库。
​
Review
├── 前端层 (React + TypeScript)
│ ├── assets/ # 静态资源
│ ├── pages/ # 应用页面
│ ├── style/ # 样式文件
│ └── utils/ # 工具函数（api）
│
├── 后端层 (NestJS + TypeScript)
│ ├── src/ # 源代码目录
│ │ ├── modules/ # 业务模块化设计
│ │ ├── prisma/ # 数据库ORM层
│ │ └── 核心文件 # 应用配置和入口
│ └── 配置文件 # package.json、.env等
│
└── 基础设施层
├── Docker容器化部署
└── PostgreSQL数据库
​
二、后端架构设计​
2.1 模块化设计​
​
backend/ # 后端工程根目录​
├── src/ # 应用源码​
│   ├── admin/                  # 管理员模块（含 jwt-admin.guard, jwt.strategy）​
│   ├── auth/                   # 登录注册与 JWT 验证（jwt-auth.guard, jwt.strategy）​
│   ├── categories/             # 商品分类​
│   ├── order_items/            # 订单项​
│   ├── orders/                 # 订单​
│   ├── owner_guard/            # 资源归属 Guard​
│   ├── prisma/                 # PrismaModule / PrismaService​
│   ├── prisma-client-exception/# Prisma 异常过滤器​
│   ├── products/               # 商品​
│   ├── seller/                 # 卖家模块（jwt-seller.guard, jwt.strategy）​
│   ├── users/                  # 用户​
│   ├── test/                   # 示例控制器​
│   ├── app.controller.ts / app.module.ts / app.service.ts​
│   └── main.ts                 # 应用入口​
├── prisma/ # 数据层​
│   ├── schema.prisma / schema-fixed.prisma / migrations/ / seed.ts​
├── dist/   # 构建产物​
├── Dockerfile.backend / nest-cli.json / tsconfig*.json / package.json / package-lock.json​
└── generated/ # 生成的 Prisma 类型（源码态）​

2.2 数据流设计​
HTTP 请求 → 全局拦截器（日志记录） → 全局守卫（JWT 验证 → 角色检查） → 数据验证管道（DTO 校验） → 模块控制器 → 模块服务 → Prisma 服务（数据访问） → PostgreSQL 数据库 → 响应格式化拦截器 → 返回 JSON 响应
2.3 核心模块职责​
​
| 模块名称 | 核心职责 | 依赖模块 |
|----------|----------|----------|
| auth | 用户注册、登录、JWT令牌生成与验证 | users、owner_guard |
| categories | 商品分类CRUD、分类层级管理 | - |
| products | 商品CRUD、库存管理、商品查询 | categories、seller |
| orders | 订单创建、状态更新、订单查询 | users、products、order_items |
| order_items | 订单项关联、商品数量/金额计算 | orders、products |
| admin | 系统配置、全局数据统计、用户管理 | users、products、orders |
| seller | 商家商品管理、订单处理、销售统计 | products、orders、users |
​
三、前端架构设计​
3.1 组件化结构​
​  
src/
├── App.css
├── App.tsx
├── assets/
│   └── react.svg
├── common/                      # 鉴权拦截
├── pages/                       # 应用页面
│   ├── admin/                   # 管理端界面    
│   ├── category_manager/        # 分类管理
│   ├── index/                   # 登陆注册
│   └── product_manager/         # 商品管理
├── index.css
├── main.tsx
├── style/
│   └── style.tsx                # 样式封装
└── utils/
    └── api.ts                   # api链接
​
3.2 前端数据流设计​
用户操作 → 组件事件触发 → 调用工具函数/API请求 → 状态更新（组件状态） → UI重新渲染
四、关键设计决策​
4.1 模块化后端设计​
按业务领域拆分模块，每个模块包含独立的控制器、服务、数据模型，实现高内聚低耦合​
模块间通过依赖注入实现通信，避免直接引用，降低耦合度​
新增功能时只需创建新模块并注册到根模块，扩展性强，不影响现有功能​
4.2 权限控制体系​
用户请求 → JWT验证（Auth模块） → 角色检查（Guard中间件） → 数据权限过滤（Service层） → 业务处理。
JWT验证：无状态认证，通过请求头携带Token，验证有效性与过期时间。
角色检查：基于RBAC模型，判断用户角色（普通用户/卖家/管理员）是否有权访问接口。
数据权限过滤：Service层根据用户身份过滤数据（如卖家只能操作自己的商品，用户只能查看自己的订单）。
4.3 数据库设计​
选用PostgreSQL关系型数据库，保证交易数据、订单数据的一致性与完整性。
使用Prisma ORM，提供类型安全的数据访问，减少SQL注入风险，提升开发效率。
关键操作（如订单创建、库存扣减）使用事务保证原子性，避免数据不一致。
合理设计数据表关系（一对一、一对多、多对多），优化查询性能。
五、部署架构​
5.1 容器化部署​
```yaml
# docker-compose.yml 核心结构
version: '3.8'
services:
  postgres:      # PostgreSQL数据库服务
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=review_db
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: always # 自动重启

  backend:       # NestJS后端服务
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    environment:
      - NODE_ENV=production # 生产环境标识
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/review_db?schema=public
      - JWT_SECRET=your-secret-key
      - JWT_EXPIRES_IN=3600s
    restart: always

  frontend:      # React前端服务
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://backend:3000
    restart: always

volumes:
  postgres-data:
​
5.2 网络通信流程​
用户浏览器 → 前端容器 (:5173) → 后端容器 (:3000) → 数据库容器 (:5432)​
前端容器通过 Nginx 提供静态资源服务，反向代理 API 请求到后端容器​
后端容器与数据库容器通过 Docker 内部网络通信，数据库不直接暴露公网，提升安全性​
所有服务通过 Docker Compose 编排，实现一键启动、停止、重启​
六、架构优势与扩展方向​
6.1 当前架构优势​
前后端分离：前端与后端独立开发、测试、部署，技术栈解耦，提升开发效率​
模块化设计：业务功能边界清晰，便于维护和迭代，支持多人协作开发​
类型安全：前后端均使用 TypeScript，减少类型错误，提升代码可读性和可维护性​
容器化部署：环境一致性强，部署流程简化，支持开发、测试、生产环境统一配置​
权限体系完善：基于 JWT 和 RBAC 模型，保障系统安全性，支持多角色管理​
6.2 未来扩展方向​
微服务拆分：将核心模块（用户、商品、订单）拆分为独立微服务，通过 API 网关聚合，提升系统容错性和扩展性​
缓存层引入：添加 Redis 缓存热点数据（商品列表、分类数据、用户信息），减少数据库查询压力，提升响应速度​
消息队列集成：使用 RabbitMQ 或 Kafka 处理异步任务（订单通知、库存变更、邮件发送等），提高系统吞吐量​
分布式存储：将商品图片、静态资源迁移至对象存储服务（如 MinIO、阿里云 OSS），减轻应用服务器压力​
服务监控：集成 Prometheus + Grafana 实现系统性能监控、日志收集与告警，提升运维效率