#!/bin/bash

echo "🔄 Iniciando desenvolvimento do backend..."

# Esperar o banco estar pronto
echo "⏳ Aguardando PostgreSQL..."
while ! pg_isready -h postgres -p 5432 -U dashmonster; do
  sleep 1
done

echo "✅ PostgreSQL pronto!"

# Executar migrações do Prisma
echo "🔄 Executando migrações do Prisma..."
npx prisma db push --accept-data-loss


# Executar seed correto conforme ambiente
echo "🌱 Executando seed..."
npm run seed || echo "Seed já executado ou erro (ignorando)"

# Iniciar aplicação
echo "🚀 Iniciando aplicação..."
npm run dev
