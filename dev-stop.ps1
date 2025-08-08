# =============================================================================
# Script para parar o ambiente de desenvolvimento
# =============================================================================

Write-Host "⏹️ Parando ambiente Dashmonster..." -ForegroundColor Yellow

# Parar todos os containers
docker-compose down

Write-Host "✅ Ambiente parado com sucesso!" -ForegroundColor Green
