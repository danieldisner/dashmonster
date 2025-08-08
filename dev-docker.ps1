#!/usr/bin/env powershell

# Dashmonster - Development with Docker
# This script starts the development environment using Docker to avoid large local node_modules

param(
    [switch]$Clean,
    [switch]$Build,
    [switch]$Logs,
    [switch]$Stop,
    [switch]$Status
)

Write-Host "🚀 Dashmonster - Development Environment" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Function to show help
function Show-Help {
    Write-Host "`n📖 Usage:" -ForegroundColor Cyan
    Write-Host "  .\dev-docker.ps1           # Start development environment" -ForegroundColor White
    Write-Host "  .\dev-docker.ps1 -Clean    # Clean and rebuild containers" -ForegroundColor White
    Write-Host "  .\dev-docker.ps1 -Build    # Force rebuild containers" -ForegroundColor White
    Write-Host "  .\dev-docker.ps1 -Logs     # Show container logs" -ForegroundColor White
    Write-Host "  .\dev-docker.ps1 -Stop     # Stop all containers" -ForegroundColor White
    Write-Host "  .\dev-docker.ps1 -Status   # Show container status" -ForegroundColor White
}

# Clean up if requested
if ($Clean) {
    Write-Host "`n🧹 Cleaning up containers and volumes..." -ForegroundColor Yellow
    docker-compose down -v
    docker system prune -f
    docker volume prune -f
    Write-Host "✅ Cleanup complete!" -ForegroundColor Green
}

# Stop containers if requested
if ($Stop) {
    Write-Host "`n🛑 Stopping development environment..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "✅ Environment stopped!" -ForegroundColor Green
    exit 0
}

# Show status if requested
if ($Status) {
    Write-Host "`n📊 Container Status:" -ForegroundColor Cyan
    docker-compose ps
    Write-Host "`n📈 Resource Usage:" -ForegroundColor Cyan
    docker stats --no-stream
    exit 0
}

# Show logs if requested
if ($Logs) {
    Write-Host "`n📋 Container Logs:" -ForegroundColor Cyan
    docker-compose logs -f
    exit 0
}

# Build containers if requested or first time
if ($Build -or !(docker-compose ps -q)) {
    Write-Host "`n🔨 Building containers..." -ForegroundColor Cyan
    docker-compose build
}

# Check if containers are already running
$runningContainers = docker-compose ps -q
if ($runningContainers) {
    Write-Host "`n✅ Development environment is already running!" -ForegroundColor Green
    Write-Host "`n🌐 Services:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:4000" -ForegroundColor White
    Write-Host "   Database: localhost:5432" -ForegroundColor White
    Write-Host "   pgAdmin:  http://localhost:8080" -ForegroundColor White
    
    $restart = Read-Host "`n🔄 Restart containers? (y/N)"
    if ($restart -eq "y" -or $restart -eq "Y") {
        docker-compose restart
        Write-Host "✅ Containers restarted!" -ForegroundColor Green
    }
}
else {
    # Start development environment
    Write-Host "`n🚀 Starting development environment..." -ForegroundColor Cyan
    docker-compose up -d
    
    # Wait for services to be ready
    Write-Host "`n⏳ Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    # Check health status
    Write-Host "`n🏥 Health Check:" -ForegroundColor Cyan
    $healthyServices = 0
    $totalServices = 0
    
    docker-compose ps --format "table {{.Name}}\t{{.Status}}" | ForEach-Object {
        if ($_ -match "ashmonster-") {
            $totalServices++
            if ($_ -match "healthy|Up") {
                $healthyServices++
                Write-Host "✅ $_" -ForegroundColor Green
            }
            else {
                Write-Host "❌ $_" -ForegroundColor Red
            }
        }
    }
    
    if ($healthyServices -eq $totalServices) {
        Write-Host "`n🎉 All services are healthy!" -ForegroundColor Green
    }
    else {
        Write-Host "`n⚠️  Some services may need more time to start" -ForegroundColor Yellow
    }
    
    Write-Host "`n🌐 Development URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:4000" -ForegroundColor White
    Write-Host "   Database: localhost:5432" -ForegroundColor White
    Write-Host "   pgAdmin:  http://localhost:8080 (admin@dashmonster.com / admin123)" -ForegroundColor White
}

Write-Host "`n📝 Useful Commands:" -ForegroundColor Cyan
Write-Host "   .\dev-docker.ps1 -Logs     # View logs" -ForegroundColor White
Write-Host "   .\dev-docker.ps1 -Status   # Check status" -ForegroundColor White
Write-Host "   .\dev-docker.ps1 -Stop     # Stop environment" -ForegroundColor White
Write-Host "   docker-compose exec backend npm run prisma:studio  # Database browser" -ForegroundColor White
