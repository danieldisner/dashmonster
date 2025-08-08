#!/usr/bin/env pwsh
# ===============================================
# Dashmonster Project Organization Script
# Remove arquivos desnecessários e organiza documentação
# ===============================================

Write-Host "🧹 Organizando Projeto Dashmonster..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Criar diretórios de documentação se não existirem
Write-Host "`n📁 Criando estrutura de documentação..." -ForegroundColor Cyan

if (-not (Test-Path "docs/status")) {
    New-Item -Path "docs/status" -ItemType Directory -Force
    Write-Host "✅ Criado: docs/status/" -ForegroundColor Green
}

if (-not (Test-Path "docs/development")) {
    New-Item -Path "docs/development" -ItemType Directory -Force
    Write-Host "✅ Criado: docs/development/" -ForegroundColor Green
}

# Mover documentação importante para docs/status/
Write-Host "`n📄 Movendo documentação de status..." -ForegroundColor Cyan

$statusDocs = @(
    "BACKEND_STATUS_CURRENT.md",
    "PROJECT_STATUS_FINAL.md", 
    "DESIGN_SYSTEM_STATUS_FINAL.md",
    "INTEGRATION_SUCCESS.md",
    "REFACTORING_SUMMARY.md"
)

foreach ($doc in $statusDocs) {
    if (Test-Path $doc) {
        Move-Item $doc "docs/status/" -Force
        Write-Host "✅ Movido: $doc -> docs/status/" -ForegroundColor Green
    }
}

# Mover documentação de desenvolvimento
Write-Host "`n🚀 Movendo documentação de desenvolvimento..." -ForegroundColor Cyan

$devDocs = @(
    "BACKEND_DEVELOPMENT_PLAN.md",
    "STRATEGIC_DEVELOPMENT_PLAN.md",
    "FUTURE_PARAMETERIZATION_STRATEGY.md"
)

foreach ($doc in $devDocs) {
    if (Test-Path $doc) {
        Move-Item $doc "docs/development/" -Force
        Write-Host "✅ Movido: $doc -> docs/development/" -ForegroundColor Green
    }
}

# Remover scripts duplicados/desnecessários
Write-Host "`n🗑️  Removendo scripts desnecessários..." -ForegroundColor Yellow

$unnecessaryScripts = @(
    "dashmonster-new.ps1",
    "dashmonster-fixed.ps1", 
    "build-optimized.ps1",
    "cleanup-project.ps1",
    "fix-permissions.ps1"
)

foreach ($script in $unnecessaryScripts) {
    if (Test-Path $script) {
        Remove-Item $script -Force
        Write-Host "🗑️  Removido: $script" -ForegroundColor Yellow
    }
}

# Remover arquivos de configuração duplicados
Write-Host "`n🗑️  Removendo arquivos duplicados..." -ForegroundColor Yellow

$duplicates = @(
    ".dockerignore.new",
    ".gitignore.new"
)

foreach ($file in $duplicates) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "🗑️  Removido: $file" -ForegroundColor Yellow
    }
}

# Remover arquivo de exemplo
Write-Host "`n🗑️  Removendo arquivos de exemplo..." -ForegroundColor Yellow

if (Test-Path "example-mobile-improvements.tsx") {
    Remove-Item "example-mobile-improvements.tsx" -Force
    Write-Host "🗑️  Removido: example-mobile-improvements.tsx" -ForegroundColor Yellow
}

# Remover documentação desatualizada
Write-Host "`n🗑️  Removendo documentação desatualizada..." -ForegroundColor Yellow

$outdatedDocs = @(
    "ACCOUNT_HOLDER_IMPLEMENTATION_REPORT.md",
    "BACKEND_ADAPTATION_STATUS.md",
    "BENEFICIARIOS_SISTEMA_COMPLETO.md", 
    "BUSINESS_LOGIC_FIXES.md",
    "DATABASE_DOCUMENTATION.md",
    "DESIGN_SYSTEM_AUDIT.md",
    "DESIGN_SYSTEM_STATUS.md",
    "DOCKER_OPTIMIZATION.md",
    "INTERFACE_REQUIREMENTS_CHECKLIST.md",
    "PRODUCTION_COMPATIBILITY_ANALYSIS.md",
    "REFACTORING_REPORT.md",
    "ROADMAP_ESTUDOS.md"
)

foreach ($doc in $outdatedDocs) {
    if (Test-Path $doc) {
        Remove-Item $doc -Force
        Write-Host "🗑️  Removido: $doc" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Organização concluída!" -ForegroundColor Green
Write-Host "`n📋 Estrutura final:" -ForegroundColor Cyan
Write-Host "  📁 docs/status/          - Status reports" -ForegroundColor White
Write-Host "  📁 docs/development/     - Development docs" -ForegroundColor White
Write-Host "  📄 dashmonster.ps1            - Main Docker script" -ForegroundColor White
Write-Host "  📄 dev-*.ps1            - Development scripts" -ForegroundColor White
Write-Host "  📄 docker-compose.yml   - Docker configuration" -ForegroundColor White
Write-Host "  📄 README.md            - Project documentation" -ForegroundColor White
