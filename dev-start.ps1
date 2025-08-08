# =============================================================================
# Script de Desenvolvimento - Dashmonster
# =============================================================================

Write-Host "Dashmonster - Iniciando Ambiente de Desenvolvimento" -ForegroundColor Green

# Parar containers existentes
Write-Host "Parando containers existentes..." -ForegroundColor Yellow
docker-compose down --remove-orphans 2>$null

# Limpar volumes se necessario (descomente se quiser resetar o banco)
# Write-Host "Removendo volumes..." -ForegroundColor Yellow
# docker-compose down -v

# Verificar se o Docker esta rodando
Write-Host "Verificando Docker..." -ForegroundColor Yellow
if (-not (Get-Process "Docker Desktop" -ErrorAction SilentlyContinue)) {
    Write-Host "Docker Desktop nao esta rodando. Inicie o Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

# Construir e iniciar containers
Write-Host "Construindo e iniciando containers..." -ForegroundColor Yellow
docker-compose up --build -d

# Aguardar containers ficarem prontos
Write-Host "Aguardando containers ficarem prontos..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar status dos containers
Write-Host "Status dos containers:" -ForegroundColor Yellow
docker-compose ps

# Verificar logs do backend
Write-Host "Ultimos logs do backend:" -ForegroundColor Yellow
docker-compose logs backend --tail=10

# Testar endpoints
Write-Host "Testando endpoints..." -ForegroundColor Yellow

try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:4000/health" -Method GET -TimeoutSec 10
    Write-Host "Backend OK: $($healthCheck.message)" -ForegroundColor Green
}
catch {
    Write-Host "Backend nao esta respondendo" -ForegroundColor Red
}

try {
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 10
    if ($frontendCheck.StatusCode -eq 200) {
        Write-Host "Frontend OK: Rodando na porta 3000" -ForegroundColor Green
    }
}
catch {
    Write-Host "Frontend nao esta respondendo" -ForegroundColor Red
}

Write-Host ""
Write-Host "Ambiente pronto!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Banco: localhost:5432" -ForegroundColor Cyan
Write-Host ""
Write-Host "Usuarios de teste:" -ForegroundColor Yellow
Write-Host "   Admin: admin@dashmonster.com / senha123" -ForegroundColor White
Write-Host "   Responsavel: joao.silva@dashmonster.com / senha123" -ForegroundColor White
Write-Host "   Operador: operador@dashmonster.com / senha123" -ForegroundColor White
Write-Host "   Estudante: estudante@dashmonster.com / senha123" -ForegroundColor White
Write-Host ""
Write-Host "Comandos uteis:" -ForegroundColor Yellow
Write-Host "   docker-compose logs -f          # Ver logs em tempo real" -ForegroundColor White
Write-Host "   docker-compose restart backend  # Reiniciar backend" -ForegroundColor White
Write-Host "   docker-compose down             # Parar tudo" -ForegroundColor White
