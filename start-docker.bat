@echo off
REM Quick Start Script for Docker Development (Windows)

echo.
echo ================================
echo Team Task Manager - Docker Setup
echo ================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ^❌ Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ^❌ Docker Compose is not installed or not in PATH
    echo Please install Docker Desktop with Docker Compose
    pause
    exit /b 1
)

echo ^✅ Docker and Docker Compose are installed
echo.

REM Check if .env.docker exists
if not exist ".env.docker" (
    echo ^❌ .env.docker file not found!
    echo Please create .env.docker with the required environment variables
    pause
    exit /b 1
)

echo ^✅ .env.docker file found
echo.

REM Start Docker Compose
echo Starting Docker containers...
echo Building and starting frontend + backend + database...
echo.

docker-compose up --build

REM Instructions after Ctrl+C
echo.
echo ================================
echo Application stopped
echo ================================
echo.
echo To stop and remove containers:
echo   docker-compose down
echo.
echo To stop and remove everything (including database):
echo   docker-compose down -v
echo.
echo To view logs:
echo   docker-compose logs -f app
echo.
echo To view database logs:
echo   docker-compose logs -f mongo
echo.
pause
