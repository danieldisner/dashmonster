# =============================================================================
# Script para reset completo do ambiente
# =============================================================================

Write-Host "🔄 Reset completo do ambiente Dashmonster..." -ForegroundColor Yellow

# Parar containers
Write-Host "⏹️ Parando containers..." -ForegroundColor Yellow
docker-compose down

# Remover volumes (reseta o banco)
Write-Host "🗑️ Removendo volumes (resetando banco)..." -ForegroundColor Yellow
docker-compose down -v

# Remover imagens
Write-Host "🗑️ Removendo imagens..." -ForegroundColor Yellow
docker-compose down --rmi all

# Limpar sistema Docker
Write-Host "🧹 Limpando sistema Docker..." -ForegroundColor Yellow
docker system prune -f

Write-Host "✅ Reset completo finalizado!" -ForegroundColor Green
Write-Host "▶️ Execute './dev-start.ps1' para reiniciar" -ForegroundColor Cyan
