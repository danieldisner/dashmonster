import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seed de desenvolvimento não pode ser executado em produção!');
  }

  // ...existing code from your current seed.ts...

  // Permissões básicas
  await prisma.permission.createMany({
    data: [
      { name: 'manage_users', description: 'Gerenciar usuários' },
      { name: 'manage_roles', description: 'Gerenciar regras' },
      { name: 'manage_menus', description: 'Gerenciar menus' },
      { name: 'manage_organizations', description: 'Gerenciar organizações' },
    ],
    skipDuplicates: true,
  });

  // Criação de tenant demo
  const demoTenant = await prisma.tenant.create({
    data: {
      name: 'Demo Tenant',
    },
  });

  // Buscar os ids das permissões criadas
  const manageUsers = await prisma.permission.findUnique({ where: { name: 'manage_users' } });
  const manageRoles = await prisma.permission.findUnique({ where: { name: 'manage_roles' } });
  const manageMenus = await prisma.permission.findUnique({ where: { name: 'manage_menus' } });
  const manageOrganizations = await prisma.permission.findUnique({ where: { name: 'manage_organizations' } });

  // Regras básicas
  const adminRole = await prisma.role.upsert({
    where: { name_tenantId: { name: 'Admin', tenantId: demoTenant.id } },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrador do sistema',
      tenantId: demoTenant.id,
      permissions: {
        create: [
          { permissionId: manageUsers?.id! },
          { permissionId: manageRoles?.id! },
          { permissionId: manageMenus?.id! },
          { permissionId: manageOrganizations?.id! },
        ],
      },
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name_tenantId: { name: 'Operator', tenantId: demoTenant.id } },
    update: {},
    create: {
      name: 'Operator',
      description: 'Operador do sistema',
      tenantId: demoTenant.id,
      permissions: {
        create: [
          { permissionId: manageUsers?.id! },
        ],
      },
    },
  });

  // Menus principais
  await prisma.menu.createMany({
    data: [
      { label: 'Usuários', icon: 'User', path: '/usuarios', order: 1, tenantId: demoTenant.id },
      { label: 'Regras', icon: 'Shield', path: '/regras', order: 2, tenantId: demoTenant.id },
      { label: 'Menus', icon: 'Menu', path: '/menus', order: 3, tenantId: demoTenant.id },
      { label: 'Organizações', icon: 'Building', path: '/organizacoes', order: 4, tenantId: demoTenant.id },
    ],
    skipDuplicates: true,
  });

  // Atualizar roles para vincular ao tenant
  await prisma.role.update({ where: { id: adminRole.id }, data: { tenantId: demoTenant.id } });
  await prisma.role.update({ where: { id: userRole.id }, data: { tenantId: demoTenant.id } });

  // Criação de usuários demo vinculados ao tenant
  const demoUsers = [
    {
      name: 'Admin',
      email: 'admin@dashmonster.com',
      password: await hashPassword('123456'),
      role: 'Admin',
      tenantId: demoTenant.id,
    },
    {
      name: 'Operador',
      email: 'operador@dashmonster.com',
      password: await hashPassword('123456'),
      role: 'Operator',
      tenantId: demoTenant.id,
    },
  ];
  await prisma.user.createMany({ data: demoUsers });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
