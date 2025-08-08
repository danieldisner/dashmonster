-- =============================================================================
-- Dashmonster Database Initialization Script
-- =============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
-- Não é necessário criar enums customizados, pois o Prisma usa strings para enums

-- Organizations (Escolas/Redes)
CREATE TABLE "Company" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    tradeName TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Users (Base para todos os tipos)
CREATE TABLE "User" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    isActive BOOLEAN DEFAULT true,
    lastLogin TIMESTAMP,
    organizationId TEXT REFERENCES "Company"(id),
    photoUrl TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Units (Unidades (Franquias))
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "organizationId" UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    "operatingHours" JSONB DEFAULT '{}',
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("organizationId", code)
);

-- Account Holders (Responsáveis Financeiros)


-- Transactions (Transações de Venda)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "beneficiaryId" UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
    "unitId" UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    "operatorId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" payment_method NOT NULL,
    status transaction_status DEFAULT 'PENDING',
    "processedAt" TIMESTAMP DEFAULT NOW(),
    "refundedAt" TIMESTAMP,
    "refundReason" TEXT,
    notes TEXT,
    "receiptNumber" VARCHAR(100) UNIQUE NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Transaction Items (Itens da Transação)
CREATE TABLE "transactionItems" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "transactionId" UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    "itemId" UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Audit Log (Log de Auditoria)
CREATE TABLE "auditLogs" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    "tableName" VARCHAR(100) NOT NULL,
    "recordId" VARCHAR(100) NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Indexes para performance


-- Dados iniciais
INSERT INTO "Company" (id, name, cnpj, tradeName, address, phone, email, createdAt, updatedAt) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Empresa Exemplo', '12345678000199', 'Empresa Exemplo LTDA', 'Rua Exemplo, 123', '11999999999', 'contato@empresa.com', NOW(), NOW());

-- Usuários de teste (senha: 123456)
INSERT INTO "User" (id, email, password, name, role, isActive, organizationId, createdAt, updatedAt) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@dashmonster.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'Admin', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'operador@dashmonster.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maria Operadora', 'Operator', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- Unidade de exemplo


COMMIT;
