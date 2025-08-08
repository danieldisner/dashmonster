import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ReactQueryProvider } from '@/components/providers/react-query-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashmonster - Dashboard Facilitado",
  description: "Dashboard Facilitado",
  keywords: ["cantina", "escola", "gerenciamento", "créditos", "alunos"],
  authors: [{ name: "Dashmonster Team" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
