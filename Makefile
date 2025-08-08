# Dashmonster - Container Management Commands

# Development (with volume mounts for hot reload)
dev:
	docker-compose up -d

# Production (optimized containers)
prod:
	docker-compose -f docker-compose.prod.yml up -d

# Build optimized containers
build:
	docker build -t dashmonster-frontend:optimized .
	docker build -t dashmonster-backend:optimized ./backend

# Stop all containers
stop:
	docker-compose down
	docker-compose -f docker-compose.prod.yml down

# Clean everything (containers, images, volumes)
clean:
	docker-compose down -v
	docker system prune -af
	docker volume prune -f

# Show container status
status:
	docker-compose ps
	docker stats --no-stream

# Show logs
logs:
	docker-compose logs -f

# Install dependencies locally (if needed)
install:
	npm ci
	cd backend && npm ci

# Database operations
db-migrate:
	docker-compose exec backend npm run prisma:migrate

db-seed:
	docker-compose exec backend npm run prisma:seed

db-studio:
	docker-compose exec backend npm run prisma:studio

# Container size analysis
analyze:
	@echo "📊 Container Sizes:"
	@docker images dashmonster-* --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
	@echo "\n📁 Project Size:"
	@powershell "Get-ChildItem -Recurse -File | Measure-Object -Property Length -Sum | ForEach-Object { 'Total: ' + [math]::Round($_.Sum / 1MB, 2) + ' MB' }"

# Help
help:
	@echo "Dashmonster - Available Commands:"
	@echo "  make dev      - Start development environment"
	@echo "  make prod     - Start production environment"
	@echo "  make build    - Build optimized containers"
	@echo "  make stop     - Stop all containers"
	@echo "  make clean    - Clean containers and volumes"
	@echo "  make status   - Show container status"
	@echo "  make logs     - Show container logs"
	@echo "  make install  - Install dependencies locally"
	@echo "  make analyze  - Analyze container and project sizes"

.PHONY: dev prod build stop clean status logs install db-migrate db-seed db-studio analyze help
