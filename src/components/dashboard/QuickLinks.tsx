import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const links = [
  { label: 'Usuários', href: '/dashboard/admin/users', color: 'bg-blue-100 text-blue-800' },
  { label: 'Vendas', href: '/dashboard/admin/reports', color: 'bg-green-100 text-green-800' },
  { label: 'Organizações', href: '/dashboard/admin/organizations', color: 'bg-purple-100 text-purple-800' },
  { label: 'Configurações', href: '/dashboard/admin', color: 'bg-gray-100 text-gray-800' },
];

export function QuickLinks() {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-2 p-4">
        <span className="font-semibold text-sm mb-2">Atalhos rápidos</span>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={`rounded px-3 py-2 font-medium ${link.color} hover:underline`}>
            {link.label}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
