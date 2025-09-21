#!/bin/bash

# MCP Nexus Development Setup Script

echo "🚀 Starting MCP Nexus Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.local.example..."
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env
        echo "📝 Please edit .env file with your actual configuration before running again."
        exit 1
    else
        echo "❌ No .env.local.example found. Please create .env file manually."
        exit 1
    fi
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🐳 Starting services..."
docker-compose up -d

echo "📊 Checking service status..."
docker-compose ps

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🌐 Next.js App: http://localhost:3000"
echo "🗄️  SQL Server: localhost:1433 (if enabled)"
echo ""
echo "📝 Useful commands:"
echo "  - View logs: docker-compose logs -f nextjs-app"
echo "  - Stop services: docker-compose down"
echo "  - Restart: docker-compose restart"
echo "  - Shell access: docker-compose exec nextjs-app sh"
echo ""
echo "🔧 To access MCP Nexus: http://localhost:3000/mcp-nexus"
