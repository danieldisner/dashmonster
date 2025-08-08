git clone https://github.com/danieldisner/dashmonster.git
docker-compose up -d
dashmonster/
dashmonster/

# Dashmonster Admin Dashboard Starter

![Build](https://img.shields.io/badge/build-stable-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-100%25-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Um painel administrativo moderno, responsivo e pronto para expansão, ideal como ponto de partida para novos sistemas de gestão, SaaS ou portais internos. Estruturado para acelerar o desenvolvimento de funcionalidades de negócio, com arquitetura robusta, autenticação, RBAC, e design system próprio.

---

## ✨ Visão Geral

O **Dashmonster Admin Dashboard** é um template completo para sistemas administrativos, com:

- 🔐 **Autenticação e RBAC**: Controle de acesso por papéis
- 🧩 **Design System**: Componentes reutilizáveis e responsivos
- 📊 **Dashboard Modular**: Cards, gráficos e widgets prontos
- 🗂️ **Gestão de Recursos**: CRUD genérico para entidades
- 🌗 **Theme Switcher**: Light/Dark mode
- � **Mobile-First**: Layout adaptável para qualquer dispositivo
- �️ **Pronto para novas features**: Estrutura DDD e separação clara de domínios

Ideal para projetos que precisam de um painel administrativo robusto, mas flexível para crescer.

---

## 🚀 Quick Start

### Pré-requisitos
- **Docker** & **Docker Compose**
- **Node.js** >= 18
- **Git**

### Instalação

```bash
# 1. Clone o repositório
git clone <seu-fork-ou-repo>.git
cd dashmonster

# 2. Suba o ambiente de desenvolvimento
docker-compose up -d

# 3. Acesse:
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
```

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS**
- **Framer Motion**
- **React Hook Form** + **Zod**
- **Zustand** (estado global)

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** + **bcrypt**

### DevOps
- **Docker** + **Docker Compose**
- Scripts de automação para setup e seed

---

## 📁 Estrutura do Projeto

```

├── src/                # Frontend (Next.js)
│   ├── app/           # App Router
│   ├── components/    # UI e design system
│   ├── features/      # Features por domínio
│   ├── services/      # Serviços e APIs
│   └── store/         # Zustand
├── backend/           # Backend (Node.js + Express)
│   ├── src/           # Código fonte
│   ├── prisma/        # Schema e migrações
│   └── docker/        # Scripts de inicialização
├── docs/              # Documentação
└── docker-compose.yml # Orquestração Docker
```

---

## 🔧 Desenvolvimento

### Scripts Principais

```bash
# Frontend
npm run dev         # Next.js dev server
npm run build       # Build de produção
npm run start       # Servidor de produção

# Backend
cd backend
npm run dev         # API com hot reload
npm run build       # Build TypeScript
npm run seed        # Popular banco de dados
```

### Scripts de Automação

```bash
./dev-start.ps1     # Inicia ambiente completo
./dev-reset.ps1     # Reset total do ambiente
./dev-stop.ps1      # Para todos os serviços
```

---

## 🧩 Pronto para Expansão

- Estrutura DDD para separar domínios de negócio
- CRUD genérico para entidades (exemplo: usuários, papéis, permissões)
- Sistema de autenticação JWT e RBAC
- Design system próprio e fácil de customizar
- Pronto para receber integrações, dashboards, relatórios e mais

---

## 📚 Documentação

- [docs/README.md](docs/README.md) — Visão geral e guias
- [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) — Arquitetura e padrões
- [docs/backend/API.md](docs/backend/API.md) — Endpoints da API
- [docs/frontend/README.md](docs/frontend/README.md) — Guia do frontend

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Dashmonster Admin Dashboard Starter — O ponto de partida para seu próximo sistema!**
O script `dev-start.ps1` executa:
