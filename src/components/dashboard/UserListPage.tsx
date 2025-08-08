"use client";

import { useEffect, useState } from "react";
// import { getUsers, deleteUser } from "@/services/user";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/design-system/components/primitives/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/design-system/components/primitives/Table';
import { Button } from '@/design-system/components/primitives/Button';
import { Users, Pencil, Trash2, Plus, Eye } from 'lucide-react';
import { Input } from '@/design-system/components/primitives/Input';

export default function UserListPage() {
  // MOCK: Usuários de exemplo
  const [users, setUsers] = useState<any[]>([
    {
      id: '1',
      name: 'Alice Souza',
      email: 'alice@email.com',
      avatarUrl: '',
      role: 'admin',
      status: 'active',
    },
    {
      id: '2',
      name: 'Bruno Lima',
      email: 'bruno@email.com',
      avatarUrl: '',
      role: 'user',
      status: 'inactive',
    },
    {
      id: '3',
      name: 'Carla Dias',
      email: 'carla@email.com',
      avatarUrl: '',
      role: 'user',
      status: 'active',
    },
    {
      id: '4',
      name: 'Daniel Nunes',
      email: 'daniel@email.com',
      avatarUrl: '',
      role: 'admin',
      status: 'active',
    },
    {
      id: '5',
      name: 'Elisa Prado',
      email: 'elisa@email.com',
      avatarUrl: '',
      role: 'user',
      status: 'inactive',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  // Filtros e paginação podem ser expandidos depois
  // useEffect(() => {
  //   getUsers().then((data) => {
  //     setUsers(data);
  //     setLoading(false);
  //   });
  // }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // Seleção em lote
  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? users.map((u) => u.id) : []);
  };
  const handleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => checked ? [...prev, id] : prev.filter((sid) => sid !== id));
  };

  // Filtro de busca simples
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2">
      <Card variant="elevated" className="shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800">
        {/* Cabeçalho sofisticado */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between p-6 border-b bg-gradient-to-r from-blue-50/80 via-white/80 to-transparent dark:from-blue-950/40 dark:via-gray-900/80">
          {/* ...cabeçalho existente... */}
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 shadow">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Usuários</h1>
              <div className="text-gray-500 dark:text-gray-400 text-base font-normal mt-1">Gerencie os usuários do sistema, permissões e avatares.</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 items-end md:items-center">
            <Input
              placeholder="Buscar por nome ou e-mail"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-56"
            />
            <Link href="/dashboard/admin/users/new">
              <Button variant="primary" size="lg" leftIcon={<Plus className="w-5 h-5" />}>Novo Usuário</Button>
            </Link>
          </div>
        </div>
        {/* Ações em lote e total */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-6 py-3 border-b bg-white dark:bg-gray-900">
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">{filteredUsers.length}</span> usuário(s)
            {selected.length > 0 && (
              <span className="ml-4 text-primary-700 dark:text-primary-400 font-semibold">{selected.length} selecionado(s)</span>
            )}
          </div>
          {selected.length > 0 && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => {}}>Editar em lote</Button>
              <Button variant="destructive" size="sm" onClick={() => {}}>Excluir em lote</Button>
            </div>
          )}
        </div>
        <CardContent className="pt-6 pb-2">
          {/* Grid responsivo para mobile/tablet, tabela para desktop */}
          <div className="block md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-8 text-muted-foreground text-lg">Carregando usuários...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground text-lg">Nenhum usuário encontrado.</div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className={`rounded-xl border bg-white dark:bg-gray-900 shadow p-4 flex flex-col gap-3 relative ${selected.includes(user.id) ? 'ring-2 ring-blue-400' : ''}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(user.id)}
                        onChange={e => handleSelect(user.id, e.target.checked)}
                        aria-label={`Selecionar usuário ${user.name}`}
                        className="accent-blue-500"
                      />
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover border w-12 h-12"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-white text-xl font-bold border">
                          {user.name?.[0] || '?'}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-gray-500 dark:text-gray-300 text-sm">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'}`}>{user.role}</span>
                      <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>{user.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="ghost" size="iconSm" aria-label="Visualizar usuário"><Eye className="w-4 h-4 text-blue-500" /></Button>
                      <Link href={`/dashboard/admin/users/${user.id}/edit`}>
                        <Button variant="ghost" size="iconSm" aria-label="Editar usuário"><Pencil className="w-4 h-4 text-gray-500" /></Button>
                      </Link>
                      <Button variant="ghost" size="iconSm" onClick={() => handleDelete(user.id)} aria-label="Excluir usuário"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Tabela para desktop */}
          <div className="hidden md:block overflow-x-auto">
            <Table variant="striped" size="default" className="rounded-xl overflow-hidden">
              {/* ...TableHeader, TableBody, TableRow, TableCell existentes... */}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selected.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={e => handleSelectAll(e.target.checked)}
                      aria-label="Selecionar todos"
                    />
                  </TableHead>
                  <TableHead className="w-24">Avatar</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-36 text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-lg">
                      Carregando usuários...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-lg">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className={selected.includes(user.id) ? 'bg-blue-50/60 dark:bg-blue-950/30' : ''}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected.includes(user.id)}
                          onChange={e => handleSelect(user.id, e.target.checked)}
                          aria-label={`Selecionar usuário ${user.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            width={56}
                            height={56}
                            className="rounded-full object-cover border-2 border-white dark:border-gray-800 shadow w-14 h-14"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-white text-2xl font-bold border-2 border-white dark:border-gray-800 shadow">
                            {user.name?.[0] || '?'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 dark:text-white">{user.name}</TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-300">{user.email}</TableCell>
                      <TableCell>
                        <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'}`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="iconSm" aria-label="Visualizar usuário"><Eye className="w-4 h-4 text-blue-500" /></Button>
                          <Link href={`/dashboard/admin/users/${user.id}/edit`}>
                            <Button variant="ghost" size="iconSm" aria-label="Editar usuário"><Pencil className="w-4 h-4 text-gray-500" /></Button>
                          </Link>
                          <Button variant="ghost" size="iconSm" onClick={() => handleDelete(user.id)} aria-label="Excluir usuário"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
