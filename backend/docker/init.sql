-- Arquivo de inicialização do banco PostgreSQL
-- Este script é executado quando o container do PostgreSQL é iniciado

-- Habilitar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar esquema se não existir
CREATE SCHEMA IF NOT EXISTS public;

-- Configurações de timezone
SET timezone = 'America/Sao_Paulo';

-- Configurações de encoding
ALTER DATABASE dashmonster SET timezone TO 'America/Sao_Paulo';

-- Garantir que o usuário existe e tem permissões
DO $do$ BEGIN IF NOT EXISTS (
    SELECT
    FROM pg_catalog.pg_roles
    WHERE
        rolname = 'da_user'
) THEN
CREATE ROLE dashmonster_user LOGIN PASSWORD 'dashmonster_secure_password';

END IF;

END $do$;

-- Dar permissões completas ao usuário
GRANT ALL PRIVILEGES ON DATABASE dashmonster TO dashmonster_user;

GRANT ALL ON SCHEMA public TO dashmonster_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dashmonster_user;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dashmonster_user;

GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO dashmonster_user;

-- Alterar o owner do banco para o usuário
ALTER DATABASE dashmonster OWNER TO dashmonster_user;

-- Mensagem de confirmação
SELECT 'Database dashmonster initialized successfully with user dashmonster_user!' as message;