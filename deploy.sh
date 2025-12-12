#!/bin/bash

echo "🚀 开始部署电商管理系统..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 未安装Docker，请先安装Docker"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ 未安装Docker Compose，请先安装"
    exit 1
fi

# 复制环境文件
if [ ! -f "./backend/.env" ]; then
    echo "📝 创建后端环境文件..."
    cp ./backend/.env.example ./backend/.env
fi

# 构建并启动服务
echo "🔨 构建Docker镜像..."
docker-compose build

echo "🚀 启动服务..."
docker-compose up -d

echo "📊 查看服务状态..."
docker-compose ps

echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址："
echo "  前端：http://localhost:5173"
echo "  后端API：http://localhost:3000"
echo "  API文档：http://localhost:3000/api"
echo ""
echo "📋 常用命令："
echo "  查看日志：docker-compose logs -f"
echo "  停止服务：docker-compose down"
echo "  重启服务：docker-compose restart"