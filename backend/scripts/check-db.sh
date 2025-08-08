#!/bin/sh

echo "🔍 Verificando se tabelas existem..."

# Tentar contar usuários para verificar se as tabelas existem
TABLES_EXIST=$(npx prisma db execute --stdin <<'EOF' 2>/dev/null || echo "0"
SELECT COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';
EOF
)

if [ "$TABLES_EXIST" = "0" ] || [ -z "$TABLES_EXIST" ]; then
  echo "❌ Tabelas não existem. Saindo..."
  exit 1
fi

echo "✅ Tabelas existem!"

# Verificar quantos usuários existem
USER_COUNT=$(npx prisma db execute --stdin <<'EOF' 2>/dev/null || echo "0"
SELECT COUNT(*) as count FROM users;
EOF
)

echo "👥 Usuários no banco: $USER_COUNT"

if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
  echo "🌱 Banco vazio, precisa ser populado."
  exit 2
else
  echo "✅ Banco já possui dados."
  exit 0
fi
