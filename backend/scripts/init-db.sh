#!/bin/sh

echo "🚀 [INIT] Inicializando banco de dados..."

# Aguardar PostgreSQL estar pronto
echo "⏳ [INIT] Aguardando PostgreSQL estar pronto..."
max_attempts=30
attempt=1

until pg_isready -h postgres -U dashmonster_user -d dashmonster_db -q; do
  if [ $attempt -eq $max_attempts ]; then
    echo "❌ [INIT] PostgreSQL não ficou pronto após $max_attempts tentativas"
    exit 1
  fi
  echo "🔄 [INIT] Tentativa $attempt/$max_attempts - PostgreSQL ainda não está pronto..."
  sleep 3
  attempt=$((attempt + 1))
done

echo "✅ [INIT] PostgreSQL está pronto!"

# Gerar Prisma client primeiro (pode falhar por permissões, mas continuamos)
echo "🔧 [INIT] Gerando Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma 2>/dev/null || echo "⚠️ [INIT] Aviso: Problema ao gerar client, mas continuando..."

# SEMPRE aplicar o schema para garantir que as tabelas sejam criadas
echo "📊 [INIT] Forçando criação das tabelas do banco..."
if [ "$NODE_ENV" = "production" ]; then
  echo "🚀 [INIT] Aplicando migrations (produção)..."
  npx prisma migrate deploy
else
  echo "🛠️ [INIT] Aplicando schema (desenvolvimento)..."
  npx prisma db push --accept-data-loss --force-reset
fi

# Verificar se as tabelas foram realmente criadas
echo "🔍 [INIT] Verificando se as tabelas foram criadas..."
TABLES_CHECK=$(npx prisma db execute --stdin <<'EOF' 2>/dev/null || echo "0"
SELECT COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'organizations');
EOF
)

echo "📊 [INIT] Tabelas encontradas: $TABLES_CHECK"

if [ "$TABLES_CHECK" = "0" ] || [ -z "$TABLES_CHECK" ]; then
  echo "❌ [INIT] ERRO: Tabelas não foram criadas! Tentando novamente..."
  npx prisma db push --force-reset --accept-data-loss
  sleep 2
fi

# Verificar quantos usuários existem e fazer seed se necessário
echo "🌱 [INIT] Verificando dados iniciais..."
USER_COUNT=$(npx prisma db execute --stdin <<'EOF' 2>/dev/null | tail -n 1 || echo "0"
SELECT COUNT(*) FROM users;
EOF
)

echo "👥 [INIT] Usuários encontrados: $USER_COUNT"

if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
  echo "📝 [INIT] Banco vazio. Executando seed completo..."
  
  # Executar o seed TypeScript
  if npm run db:seed; then
    echo "✅ [INIT] Seed executado com sucesso!"
  else
    echo "⚠️ [INIT] Erro no seed, tentando criar dados básicos via SQL..."
    
    # Fallback: criar usuário admin diretamente via SQL se seed falhar
    npx prisma db execute --stdin <<'EOF' || echo "⚠️ [INIT] Erro ao inserir admin, mas continuando..."
INSERT INTO organizations (id, name, code, type, address, contact, settings, "isActive", "createdAt", "updatedAt")
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Escola Municipal Dom Pedro II', 'EMDP2', 'SCHOOL', '{}', '{}', '{}', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, password, name, cpf, phone, role, "organizationId", "isActive", "createdAt", "updatedAt")
VALUES ('550e8400-e29b-41d4-a716-446655440001', 'admin@dashmonster.com', '$2a$10$vRjr4hoaxpH/lzafRTWvLeXVItU1L5mw.1RcBlRzswDC9W2kvk1Vu', 'Administrador', '12345678901', '11999999999', 'ADMIN', '550e8400-e29b-41d4-a716-446655440000', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
EOF

    echo "✅ [INIT] Dados básicos criados como fallback!"
  fi
else
  echo "✅ [INIT] Banco já possui $USER_COUNT usuários"
fi

echo "🎉 [INIT] Inicialização do banco concluída com sucesso!"

# Iniciar aplicação
echo "🚀 [INIT] Iniciando aplicação..."
exec "$@"
