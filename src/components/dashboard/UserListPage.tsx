"use client";

import React, { useState } from "react";
// import { getUsers, deleteUser } from "@/services/user";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from '@/design-system/components/primitives/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/design-system/components/primitives/Table';
import { Button } from '@/design-system/components/primitives/Button';
import { Users, Pencil, Plus, Eye } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading';
import { Input } from '@/design-system/components/primitives/Input';

interface UserListItem {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  status: string;
  birthdate: string; // ISO string
  baptismDate: string; // ISO string
  profession: string;
  addressStreet: string;
  addressCity: string;
  addressNumber: string;
  uf: string;
  whatsapp: string;
}

export default function UserListPage() {
  // MOCK: Usuários de exemplo
  // Simula carregamento inicial
  const [loading, setLoading] = useState(true);
  const users: UserListItem[] = [
    {
      id: '1',
      name: 'Alice Souza',
      email: 'alice@email.com',
      avatarUrl: '',
      role: 'admin',
      status: 'active',
      birthdate: '1990-05-10',
      baptismDate: '2005-08-15',
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
      role: 'user',
      status: 'inactive',
      birthdate: '1985-11-22',
      baptismDate: '2000-01-10',
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
      role: 'user',
      status: 'active',
      birthdate: '1992-03-18',
      baptismDate: '2010-09-20',
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
      role: 'admin',
      status: 'active',
      birthdate: '1988-07-30',
      baptismDate: '2008-12-05',
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
      role: 'user',
      status: 'inactive',
      birthdate: '1995-09-12',
      baptismDate: '2012-04-18',
      profession: 'Médica',
      addressStreet: 'Rua do Sol',
      addressCity: 'Fortaleza',
      addressNumber: '654',
      uf: 'CE',
      whatsapp: '85955554444',
    },
  ];
  // Helper para formatar WhatsApp
  function formatWhatsApp(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  // const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  // Filtros e paginação podem ser expandidos depois

  // Simula carregamento de dados
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  // useEffect(() => {
  //   getUsers().then((data) => {
  //     setUsers(data);
  //     setLoading(false);
  //   });
  // }, []);

  // const handleDelete = async (id: string) => {
  //   if (confirm("Tem certeza que deseja excluir este usuário?")) {
  //     await deleteUser(id);
  //     setUsers((prev) => prev.filter((u) => u.id !== id));
  //   }
  // };

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
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.whatsapp.replace(/\D/g, '').includes(search.replace(/\D/g, ''))
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2">
      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" text="Carregando usuários..." />
        </div>
      )}
      <Card variant="elevated" className="shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800">
        {/* Cabeçalho sofisticado */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between p-6 border-b bg-gradient-to-r from-blue-50/80 via-white/80 to-transparent dark:from-blue-950/40 dark:via-gray-900/80">
          {/* ...cabeçalho existente... */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 shadow">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Membros</h1>
              <div className="text-gray-500 dark:text-gray-400 text-base font-normal mt-1">Lista de membros, contatos e ações rápidas.</div>
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
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cake" viewBox="0 0 16 16"><path d="m7.994.013-.595.79a.747.747 0 0 0 .101 1.01V4H5a2 2 0 0 0-2 2v3H2a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a2 2 0 0 0-2-2h-1V6a2 2 0 0 0-2-2H8.5V1.806A.747.747 0 0 0 8.592.802zM4 6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v.414a.9.9 0 0 1-.646-.268 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0A.9.9 0 0 1 4 6.414zm0 1.414c.49 0 .98-.187 1.354-.56a.914.914 0 0 1 1.292 0c.748.747 1.96.747 2.708 0a.914.914 0 0 1 1.292 0c.374.373.864.56 1.354.56V9H4zM1 11a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.793l-.354.354a.914.914 0 0 1-1.293 0 1.914 1.914 0 0 0-2.707 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0L1 11.793zm11.646 1.854a1.915 1.915 0 0 0 2.354.279V15H1v-1.867c.737.452 1.715.36 2.354-.28a.914.914 0 0 1 1.292 0c.748.748 1.96.748 2.708 0a.914.914 0 0 1 1.292 0c.748.748 1.96.748 2.707 0a.914.914 0 0 1 1.293 0Z"/></svg>
                            {new Date(user.birthdate).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-droplet-half" viewBox="0 0 16 16"><path fillRule="evenodd" d="M7.21.8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10c0 0 2.5 1.5 5 .5s5-.5 5-.5c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/><path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/></svg>
                            {new Date(user.baptismDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.profession} | {user.addressStreet}, {user.addressCity} {user.addressNumber} - {user.uf}
                        </div>
                        <div className="text-xs mt-1">
                          <a href={`https://wa.me/55${user.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-500 hover:underline">
                            <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="15" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                            {formatWhatsApp(user.whatsapp)}
                          </a>
                        </div>
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
                  <TableHead>Nascimento</TableHead>
                  <TableHead>Batismo</TableHead>
                  <TableHead>Profissão</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead className="w-36 text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground text-lg">
                      Carregando usuários...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground text-lg">
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
                      <TableCell>{new Date(user.birthdate).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(user.baptismDate).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{user.profession}</TableCell>
                      <TableCell>{user.addressStreet}, {user.addressCity} {user.addressNumber} - {user.uf}</TableCell>
                      <TableCell>
                        <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <a href={`https://wa.me/55${user.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-500 hover:underline">
                          <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="15" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                          {formatWhatsApp(user.whatsapp)}
                        </a>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="iconSm" aria-label="Visualizar usuário"><Eye className="w-4 h-4 text-blue-500" /></Button>
                          <Link href={`/dashboard/admin/users/${user.id}/edit`}>
                            <Button variant="ghost" size="iconSm" aria-label="Editar usuário"><Pencil className="w-4 h-4 text-gray-500" /></Button>
                          </Link>
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
