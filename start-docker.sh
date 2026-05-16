#!/bin/bash
# Quick Start Script for Docker Development

echo "================================"
echo "Team Task Manager - Docker Setup"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop from https://www.docker.com"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Desktop with Docker Compose"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env.docker exists
if [ ! -f ".env.docker" ]; then
    echo "❌ .env.docker file not found!"
    echo "Please create .env.docker with the required environment variables"
    exit 1
fi

echo "✅ .env.docker file found"
echo ""

# Start Docker Compose
echo "Starting Docker containers..."
echo "Building and starting frontend + backend + database..."
echo ""

docker-compose up --build

# Instructions after Ctrl+C
echo ""
echo "================================"
echo "Application stopped"
echo "================================"
echo ""
echo "To stop and remove containers:"
echo "  docker-compose down"
echo ""
echo "To stop and remove everything (including database):"
echo "  docker-compose down -v"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f app"
echo ""
echo "To view database logs:"
echo "  docker-compose logs -f mongo"
echo ""
