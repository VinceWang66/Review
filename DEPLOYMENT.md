方式一：使用 Docker Compose（推荐）​

环境要求​
Docker 20.10+​
Docker Compose 2.0+​
部署步骤​
克隆项目​
git clone ​
cd repo  # 进入项目根目录（请根据实际仓库名称调整目录名）​
启动服务​
选择以下任一方式启动：​
\# 方式1：一键部署（如果项目提供了 deploy.sh 脚本）​
chmod +x deploy.sh​
./deploy.sh​

\# 方式2：手动部署​
docker-compose up -d​

访问应用​
前端页面：http://localhost:5173​
后端 API：http://localhost:3000​
API 文档：http://localhost:3000/api​

常用管理命令​
\# 查看服务运行状态​
docker-compose ps​

\# 实时查看服务日志（-f 表示跟踪日志输出）​
docker-compose logs -f​

\# 停止所有服务（保留容器和数据）​
docker-compose down​

\# 重启所有服务​
docker-compose restart​

\# 代码更新后重建服务（重新构建镜像并启动）​
docker-compose up -d --build​

\# 部署数据库模型​
docker-compose exec backend npx prisma migrate reset
​
### 常见问题排查

#### Docker 镜像拉取失败（国内用户）
如果遇到 `failed to fetch anonymous token` 或连接超时：

1. **配置国内镜像源**
   ```bash
   # 创建或修改 ~/.docker/daemon.json
   {
     "registry-mirrors": [
       "https://docker.mirrors.ustc.edu.cn",
       "https://hub-mirror.c.163.com"
     ]
   }
配置后重启 Docker Desktop。

2.手动拉取基础镜像
```bash
docker pull node:18-alpine
docker pull nginx:alpine
docker pull postgres:15-alpine
```

3.检查网络连接
确保能访问 registry.docker.io
尝试使用代理（如有）
更换网络环境


方式二：传统本地部署​

环境要求​
Node.js 18+​
PostgreSQL 14+​
包管理器：npm 或 yarn​

部署步骤​

克隆项目并进入目录​
git clone <仓库地址>​
cd repo  # 进入项目根目录​
​

安装依赖​
\# 安装后端依赖​
cd backend​
npm install  # 或 yarn install​

​

\# 安装前端依赖（安装完成后返回项目根目录）​
cd ../frontend​
npm install  # 或 yarn install​
cd ..​

配置环境变量​
\# 后端环境变量配置（进入 backend 目录）​
cd backend​
cp .env.example .env  # 复制示例配置文件​
\# 编辑 .env 文件，配置数据库连接等关键信息​
\# 推荐使用编辑器打开：vim .env 或 code .env（根据实际编辑器调整）​
cd ..​

\# （可选）前端环境变量配置​
cd frontend​
cp .env.example .env  # 如有前端配置需求，按此步骤复制并编辑​
cd ..​

数据库设置​
\# 进入后端目录执行数据库迁移​
cd backend​
npx prisma migrate deploy  # 应用数据库迁移脚本，创建表结构​
cd ..​

启动服务​
\# 启动后端服务（在 backend 目录下）​
cd backend​
npm run start  # 或 yarn start（根据 package.json 配置的脚本调整）​
\# 新建终端，启动前端服务（在 frontend 目录下）​
cd frontend​
npm run dev  # 开发环境启动（热更新），生产环境使用 npm run build + 静态服务部署​

补充说明​
生产环境部署前端时，需先执行 npm run build 构建静态文件，再通过 Nginx 等服务器托管​
数据库需提前创建好对应的数据库实例，确保 .env 中配置的数据库用户拥有创建表的权限​
若启动失败，可查看终端输出日志排查端口占用、依赖缺失或配置错误等问题