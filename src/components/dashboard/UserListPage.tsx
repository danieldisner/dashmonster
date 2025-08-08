
"use client";
import { cn } from '@/utils/cn';

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Pencil, Plus, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/design-system/components/primitives/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/design-system/components/primitives/Table';
import { Button } from '@/design-system/components/primitives/Button';
import { LoadingSpinner } from '@/components/ui/loading';
import { Input } from '@/design-system/components/primitives/Input';
import { useDebounce } from '@/hooks/useDebounce';

interface UserListItem {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  status: 'active' | 'inactive';
  birthdate: string; // ISO string
  lastLogin: string; // ISO string
  profession: string;
  addressStreet: string;
  addressCity: string;
  addressNumber: string;
  uf: string;
  whatsapp: string;
}

// Simulação de permissões (substitua por hook real depois)
const usePermissions = () => ({
  canCreate: true,
  canDelete: true,
  canEdit: true,
  canView: true,
});

export default function UserListPage() {
  // Mock de dados
  const [loading, setLoading] = useState(true);
  const [users] = useState<UserListItem[]>([
    {
      id: '1',
      name: 'Alice Souza',
      email: 'alice@email.com',
      avatarUrl: '',
      status: 'active',
      birthdate: '1990-05-10',
      lastLogin: '2025-08-07T18:30:00Z',
      profession: 'Engenheira',
      addressStreet: 'Rua das Flores',
      addressCity: 'São Paulo',
      addressNumber: '123',
      uf: 'SP',
      whatsapp: '11999998888',
    },
    {
      id: '2',
      name: 'Bruno Lima',
      email: 'bruno@email.com',
      avatarUrl: '',
      status: 'inactive',
      birthdate: '1985-11-22',
      lastLogin: '2025-08-06T10:15:00Z',
      profession: 'Professor',
      addressStreet: 'Av. Brasil',
      addressCity: 'Rio de Janeiro',
      addressNumber: '456',
      uf: 'RJ',
      whatsapp: '21988887777',
    },
    {
      id: '3',
      name: 'Carla Dias',
      email: 'carla@email.com',
      avatarUrl: '',
      status: 'active',
      birthdate: '1992-03-18',
      lastLogin: '2025-08-05T14:00:00Z',
      profession: 'Designer',
      addressStreet: 'Rua Central',
      addressCity: 'Belo Horizonte',
      addressNumber: '789',
      uf: 'MG',
      whatsapp: '31977776666',
    },
    {
      id: '4',
      name: 'Daniel Nunes',
      email: 'daniel@email.com',
      avatarUrl: '',
      status: 'active',
      birthdate: '1988-07-30',
      lastLogin: '2025-08-04T09:45:00Z',
      profession: 'Desenvolvedor',
      addressStreet: 'Rua Nova',
      addressCity: 'Curitiba',
      addressNumber: '321',
      uf: 'PR',
      whatsapp: '41966665555',
    },
    {
      id: '5',
      name: 'Elisa Prado',
      email: 'elisa@email.com',
      avatarUrl: '',
      status: 'inactive',
      birthdate: '1995-09-12',
      lastLogin: '2025-08-03T20:10:00Z',
      profession: 'Médica',
      addressStreet: 'Rua do Sol',
      addressCity: 'Fortaleza',
      addressNumber: '654',
      uf: 'CE',
      whatsapp: '85955554444',
    },
    {
      id: '6',
      name: 'Fábio Castro',
      email: 'fabio@email.com',
      avatarUrl: '',
      status: 'active',
      birthdate: '1983-02-25',
      lastLogin: '2025-08-02T11:20:00Z',
      profession: 'Analista',
      addressStreet: 'Rua das Palmeiras',
      addressCity: 'Salvador',
      addressNumber: '987',
      uf: 'BA',
      whatsapp: '71944443333',
    },
    {
      id: '7',
      name: 'Gabriela Tavares',
      email: 'gabriela@email.com',
      avatarUrl: '',
      status: 'active',
      birthdate: '1998-12-01',
      lastLogin: '2025-08-01T16:55:00Z',
      profession: 'Psicóloga',
      addressStreet: 'Rua do Mar',
      addressCity: 'Recife',
      addressNumber: '222',
      uf: 'PE',
      whatsapp: '81933332222',
    },
    {
      id: '8',
      name: 'Henrique Silva',
      email: 'henrique@email.com',
      avatarUrl: '',
      status: 'inactive',
      birthdate: '1980-10-10',
      lastLogin: '2025-07-31T08:00:00Z',
      profession: 'Administrador',
      addressStreet: 'Rua das Laranjeiras',
      addressCity: 'Porto Alegre',
      addressNumber: '333',
      uf: 'RS',
      whatsapp: '51922221111',
    },
  ]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const permissions = usePermissions();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filtro de busca
  const filteredUsers = useMemo(() => {
    if (!debouncedSearch) return users;
    const q = debouncedSearch.toLowerCase();
    return users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.whatsapp.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
    );
  }, [users, debouncedSearch]);

  // Helpers
  function formatWhatsApp(value: string) {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR');
  }
  function formatDateTime(date: string) {
    return new Date(date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  // Seleção em lote
  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? filteredUsers.map((u) => u.id) : []);
  };
  const handleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => checked ? [...prev, id] : prev.filter((sid) => sid !== id));
  };

  return (
    <div className="px-2 py-8 mx-auto max-w-7xl">
      <Card variant="elevated" className="border border-gray-100 shadow-xl rounded-2xl dark:border-gray-800">
        {/* Header */}
        <div className="flex flex-col gap-4 p-6 border-b md:flex-row md:items-center md:justify-between bg-gradient-to-r from-blue-50/80 via-white/80 to-transparent dark:from-blue-950/40 dark:via-gray-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full shadow-sm dark:bg-blue-900">
              <Users className="text-blue-600 w-7 h-7 dark:text-blue-300" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Usuários</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              placeholder="Buscar por nome, e-mail ou WhatsApp"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64"
              aria-label="Buscar usuários"
              data-testid="search-input"
            />
            <div className="flex gap-2 sm:ml-2">
              {permissions.canCreate && (
                <Link href="/dashboard/admin/users/new" aria-label="Cadastrar novo usuário">
                  <button
                    type="button"
                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-50/60 shadow-md border border-green-200 dark:bg-green-900/30 dark:border-green-700 transition hover:shadow-lg hover:bg-green-100/80 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-400"
                    title="Cadastrar novo usuário"
                  >
                    <Plus className="w-6 h-6 text-green-500" />
                  </button>
                </Link>
              )}
              {permissions.canDelete && (
                <Link href="/dashboard/admin/users/trash" aria-label="Ver lixeira de usuários">
                  <button
                    type="button"
                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-50/60 shadow-md border border-red-200 dark:bg-red-900/30 dark:border-red-700 transition hover:shadow-lg hover:bg-red-100/80 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-400"
                    title="Ver lixeira de usuários"
                  >
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Ações em lote e total */}
        <div className="flex flex-col gap-2 px-6 py-3 bg-white border-b md:flex-row md:items-center md:justify-between dark:bg-gray-900">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{filteredUsers.length}</span> usuário(s)
            {selected.length > 0 && (
              <span className="ml-4 font-semibold text-primary-700 dark:text-primary-400">{selected.length} selecionado(s)</span>
            )}
          </div>
          {selected.length > 0 && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => {}}>Editar em lote</Button>
              <Button variant="destructive" size="sm" onClick={() => {}}>Excluir em lote</Button>
            </div>
          )}
        </div>
        <CardContent className="pt-8 pb-4">
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {loading ? (
                <div className="flex justify-center py-12 col-span-full">
                  <LoadingSpinner size="md" text="Carregando usuários..." />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-lg col-span-full text-muted-foreground">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2 text-gray-300 dark:text-gray-700"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Nenhum usuário encontrado.
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex flex-col justify-between h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md p-6 transition-all duration-200 hover:scale-[1.025] hover:shadow-xl ${selected.includes(user.id) ? 'ring-2 ring-blue-400' : ''}`}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(user.id)}
                        onChange={e => handleSelect(user.id, e.target.checked)}
                        aria-label={`Selecionar usuário ${user.name}`}
                        className="w-4 h-4 border-gray-300 rounded accent-blue-500 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none opacity-60"
                        style={{ boxShadow: 'none' }}
                      />
                      <Link href={`/dashboard/admin/users/${user.id}`} aria-label={`Ver detalhes de ${user.name}`} tabIndex={0} className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400">
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            width={72}
                            height={72}
                            className="object-cover w-16 h-16 border rounded-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white border rounded-full bg-gradient-to-br from-blue-200 to-blue-400">
                            {user.name?.[0] || '?'}
                          </div>
                        )}
                      </Link>
                      <div className="flex flex-col min-w-0">
                        <Link href={`/dashboard/admin/users/${user.id}`} className="block text-base font-bold text-gray-900 truncate rounded dark:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400" tabIndex={0} aria-label={`Ver detalhes de ${user.name}`}>{user.name}</Link>
                        <span className="block text-xs text-gray-500 truncate rounded dark:text-gray-300">{user.email}</span>
                        <a href={`https://wa.me/55${user.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-blue-500 rounded hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label={`Abrir WhatsApp de ${user.name}`}>{formatWhatsApp(user.whatsapp)}</a>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                      <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cake" viewBox="0 0 16 16"><path d="m7.994.013-.595.79a.747.747 0 0 0 .101 1.01V4H5a2 2 0 0 0-2 2v3H2a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a2 2 0 0 0-2-2h-1V6a2 2 0 0 0-2-2H8.5V1.806A.747.747 0 0 0 8.592.802zM4 6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v.414a.9.9 0 0 1-.646-.268 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0A.9.9 0 0 1 4 6.414zm0 1.414c.49 0 .98-.187 1.354-.56a.914.914 0 0 1 1.292 0c.748.747 1.96.747 2.708 0a.914.914 0 0 1 1.292 0c.374.373.864.56 1.354.56V9H4zM1 11a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.793l-.354.354a.914.914 0 0 1-1.293 0 1.914 1.914 0 0 0-2.707 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0L1 11.793zm11.646 1.854a1.915 1.915 0 0 0 2.354.279V15H1v-1.867c.737.452 1.715.36 2.354-.28a.914.914 0 0 1 1.292 0c.748.748 1.96.748 2.708 0a.914.914 0 0 1 1.292 0c.748.748 1.96.748 2.707 0a.914.914 0 0 1 1.293 0Z"/></svg>
                        {formatDate(user.birthdate)}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/><path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
                        {user.addressCity} - {user.uf}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs text-gray-500 dark:text-gray-400">
                        Último acesso: {formatDateTime(user.lastLogin)}
                      </span>
                    </div>
                    <div className="flex justify-center gap-4 pt-5 mt-auto border-t border-gray-100 dark:border-gray-800">
                      {permissions.canView && (
                        <Link href={`/dashboard/admin/users/${user.id}`} aria-label="Visualizar usuário">
                          <Button variant="ghost" size="iconSm"><Eye className="text-blue-500 w-5 h-5" /></Button>
                        </Link>
                      )}
                      {permissions.canEdit && (
                        <Link href={`/dashboard/admin/users/${user.id}/edit`} aria-label="Editar usuário">
                          <Button variant="ghost" size="iconSm"><Pencil className="text-gray-500 w-5 h-5" /></Button>
                        </Link>
                      )}
                      {permissions.canDelete && (
                        <Button variant="ghost" size="iconSm" aria-label="Excluir usuário"><Trash2 className="text-red-500 w-5 h-5" /></Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
