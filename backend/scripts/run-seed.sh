#!/bin/bash
# scripts/run-seed.sh

if [ "$NODE_ENV" = "production" ]; then
  echo "[SEED] Executando seed de produção..."
  npx tsx prisma/seed.ts
else
  echo "[SEED] Executando seed de desenvolvimento..."
  npx tsx prisma/seed.dev.ts
fi
