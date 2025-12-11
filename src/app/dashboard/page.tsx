"use client";

import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  Ticket,
  User,
  ShieldCheck,
  Users,
  LayoutDashboard, // Ícone novo
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* === ÁREA DE GESTÃO E INDICADORES === */}
        {(user?.role === "ADMIN" || user?.role === "SUPERVISOR") && (
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
              Gestão & Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* --- NOVO BOTÃO: DASHBOARD ANALÍTICO --- */}
              <Link href="/analytics" className="group">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer h-full relative overflow-hidden">
                  {/* Efeito visual de fundo */}
                  <div className="absolute -right-4 -top-4 bg-blue-100 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                  <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform relative z-10">
                    <LayoutDashboard className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-blue-900 text-lg">
                      Dashboard Analítico
                    </h3>
                    <p className="text-sm text-blue-700">
                      KPIs, Gráficos e Metas
                    </p>
                  </div>
                </div>
              </Link>
              {/* ------------------------------------- */}

              {/* BOTÃO DO ADMIN -> SUPERVISORES */}
              {user?.role === "ADMIN" && (
                <Link href="/admin/supervisores" className="group">
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer h-full">
                    <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <ShieldCheck className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-orange-900 text-lg">
                        Supervisores
                      </h3>
                      <p className="text-sm text-orange-700">
                        Cadastrar e gerenciar
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              {/* BOTÃO DO ADMIN -> VENDEDORES */}
              {user?.role === "ADMIN" && (
                <Link href="/admin/vendedores" className="group">
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer h-full">
                    <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-orange-900 text-lg">
                        Vendedores
                      </h3>
                      <p className="text-sm text-orange-700">Vincular equipe</p>
                    </div>
                  </div>
                </Link>
              )}

              {/* BOTÃO DO SUPERVISOR -> EQUIPE */}
              {user?.role === "SUPERVISOR" && (
                <Link href="/supervisor/equipe" className="group">
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer h-full">
                    <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900 text-lg">
                        Minha Equipe
                      </h3>
                      <p className="text-sm text-purple-700">
                        Visualizar vendedores
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* === ÁREA OPERACIONAL (MANTIDA IGUAL) === */}
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
          Operacional
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Nova Venda */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Nova Venda
            </h3>
            <p className="text-gray-500 text-sm mb-8">
              Cadastrar contrato, titular e dependentes.
            </p>
            <div className="flex gap-3 mt-auto w-full">
              <Link
                href="/venda"
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Nova Venda
              </Link>
            </div>
          </div>

          {/* Convite SPA */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Ticket className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Convite</h3>
            <p className="text-gray-500 text-sm mb-8">
              Gerar voucher para visita e sorteio.
            </p>
            <div className="flex gap-3 mt-auto w-full">
              <Link
                href="/convite"
                className="flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                Novo Convite
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-400 text-xs border-t border-gray-100 mt-8">
        © 2025 Praiastur. Sistema Interno v2.0
      </footer>
    </div>
  );
}
