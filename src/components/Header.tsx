"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User, ShieldCheck, Sun, Menu, Briefcase } from "lucide-react";

import { useState } from "react";

export function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === "/login" || pathname === "/api/auth/signin") {
    return null;
  }

  if (!user) return null;

  const getRoleBadge = () => {
    switch (user.role) {
      case "ADMIN":
        return {
          icon: <ShieldCheck className="h-4 w-4" />,
          text: "Administrador",
          bg: "bg-orange-100 text-orange-700 border-orange-200",
        };
      case "SUPERVISOR":
        return {
          icon: <Briefcase className="h-4 w-4" />,
          text: "Supervisor",
          bg: "bg-purple-100 text-purple-700 border-purple-200",
        };
      default:
        return {
          icon: <User className="h-4 w-4" />,
          text: "Vendedor",
          bg: "bg-blue-100 text-blue-700 border-blue-200",
        };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* --- LOGO (Esquerda) --- */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              {/* ÁREA DA IMAGEM */}
              {/* 'relative' é necessário para o 'fill' funcionar. 
                  h-10 w-10 (40px) é um tamanho padrão bom para headers. */}
              <div className="relative h-16 w-16 overflow-hidden">
                <Image
                  src="/Logo-P.png" 
                  alt="Logo Praiastur"
                  fill // Ocupa todo o espaço da div pai (h-10 w-10)
                  className="object-contain" // Garante que o logo não fique esticado/achatado
                  priority // Carrega instantaneamente (sem lazy load)
                />
              </div>

              {/* ÁREA DO TEXTO */}
              {/* Se o seu logo JÁ TIVER o nome escrito, você pode apagar essa div inteira abaixo */}
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-lg leading-none tracking-tight">
                  Praiastur
                </span>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest leading-none">
                  Financeiro
                </span>
              </div>
            </Link>
          </div>

          {/* --- USER INFO (Direita - Desktop) --- */}
          <div className="hidden md:flex items-center gap-6">
            {/* Badge do Cargo */}
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border ${badge.bg} text-xs font-semibold`}
            >
              {badge.icon}
              {badge.text}
            </div>

            <div className="h-8 w-px bg-gray-100"></div>

            {/* Nome e Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-700 leading-none">
                  {user.nome.split(" ")[0]} {/* Apenas o primeiro nome */}
                </p>
                <p className="text-[10px] text-gray-400">{user.email}</p>
              </div>

              <button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                title="Sair do sistema"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU (Dropdown simples) --- */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full border border-gray-200">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="font-bold text-gray-800">{user.nome}</p>
              <p className="text-xs text-gray-500">{badge.text}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 p-3 rounded-lg text-red-600 font-medium hover:bg-red-50"
          >
            <LogOut size={18} /> Sair do Sistema
          </button>
        </div>
      )}
    </header>
  );
}
