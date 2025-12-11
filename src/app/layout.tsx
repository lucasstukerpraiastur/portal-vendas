import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";

import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal de Vendas - Praiastur",
  description: "Sistema interno de vendas e convites",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
