// Layout raiz compartilhado por todas as rotas.
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Caninde",
  description: "Encontre empresas de serviços locais na sua cidade",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
