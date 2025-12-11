"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/service/api";
import {
  LogOut,
  Users,
  Mail,
  Phone,
  Calendar,
  BadgeCheck,
  Plus,
  Trash2,
  X,
  Loader2,
  UserPlus,
} from "lucide-react";

interface Vendedor {
  id: number;
  nome_completo: string;
  email: string;
  telefone: string;
  ativo: boolean;
  criado_em: string;
}

export default function SupervisorEquipePage() {
  const { user, signOut } = useAuth();
  const [equipe, setEquipe] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [novoVendedor, setNovoVendedor] = useState({
    nome_completo: "",
    email: "",
    cpf: "",
    telefone: "",
  });

  async function carregarEquipe() {
    try {
      const response = await api.get("/api/supervisor/equipe");
      setEquipe(response.data);
    } catch (error) {
      console.error("Erro ao carregar equipe", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarEquipe();
  }, []);

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/supervisor/equipe/vendedor", novoVendedor);
      alert("Convite enviado com sucesso!");
      setModalOpen(false);
      setNovoVendedor({ nome_completo: "", email: "", cpf: "", telefone: "" });
      carregarEquipe();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao adicionar vendedor.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemover(id: number, nome: string) {
    if (!confirm(`Tem certeza que deseja remover ${nome} da equipe?`)) return;
    try {
      await api.delete(`/api/supervisor/equipe/${id}`);
      setEquipe((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      alert("Erro ao remover vendedor.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* HEADER ESCURO PARA CONTRASTE */}
      <header className="bg-white border-b border-gray-300 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 p-2.5 rounded-lg shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                Painel do Supervisor
              </p>
              <h1 className="text-xl font-extrabold text-gray-900 leading-none">
                Minha Equipe
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 font-medium hidden md:inline-block">
              Olá, <strong className="text-purple-700">{user?.nome}</strong>
            </span>
            <button
              onClick={signOut}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-200"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-300 pb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              Vendedores Ativos
            </h2>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold border border-purple-200 shadow-sm">
              {equipe.length} membros
            </span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <UserPlus size={19} />
            Novo Vendedor
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin h-10 w-10 mb-4 text-purple-600" />
            <p className="font-medium">Carregando dados da equipe...</p>
          </div>
        ) : equipe.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl text-center shadow border border-gray-200">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Equipe Vazia
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Você ainda não tem vendedores vinculados. Adicione novos membros
              para começar a gerenciar suas vendas.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="text-purple-700 font-bold hover:underline"
            >
              + Adicionar primeiro membro
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipe.map((vendedor) => (
              <div
                key={vendedor.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 hover:shadow-md hover:border-purple-300 transition-all group relative"
              >
                <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-purple-600 rounded-r-full"></div>

                <div className="flex items-start justify-between mb-4 pl-4">
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-gray-900 text-lg truncate pr-2">
                      {vendedor.nome_completo}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-800 bg-green-100 px-2.5 py-1 rounded-md mt-1.5 border border-green-200">
                      <BadgeCheck className="h-3.5 w-3.5" /> ATIVO
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      handleRemover(vendedor.id, vendedor.nome_completo)
                    }
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                    title="Remover Vendedor"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-3 pl-4 border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <Mail className="h-4 w-4 text-purple-600 shrink-0" />
                    <span className="truncate">{vendedor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>{vendedor.telefone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 pt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Desde:{" "}
                      {new Date(vendedor.criado_em).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- MODAL DE ALTO CONTRASTE --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 border border-gray-300">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-extrabold text-xl text-gray-900">
                Novo Vendedor
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-900 p-1 hover:bg-gray-200 rounded-md transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAdicionar} className="p-6 space-y-5">
              {/* NOME COMPLETO */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                  Nome Completo
                </label>
                <input
                  required
                  type="text"
                  value={novoVendedor.nome_completo}
                  onChange={(e) =>
                    setNovoVendedor({
                      ...novoVendedor,
                      nome_completo: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg text-gray-900 font-medium placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition shadow-sm"
                  placeholder="Ex: João da Silva"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                  E-mail Profissional
                </label>
                <input
                  required
                  type="email"
                  value={novoVendedor.email}
                  onChange={(e) =>
                    setNovoVendedor({ ...novoVendedor, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg text-gray-900 font-medium placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition shadow-sm"
                  placeholder="usuario@empresa.com"
                />
              </div>

              {/* CPF e TELEFONE (Lado a Lado) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                    CPF
                  </label>
                  <input
                    required
                    type="text"
                    value={novoVendedor.cpf}
                    onChange={(e) =>
                      setNovoVendedor({ ...novoVendedor, cpf: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg text-gray-900 font-medium placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition shadow-sm"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={novoVendedor.telefone}
                    onChange={(e) =>
                      setNovoVendedor({
                        ...novoVendedor,
                        telefone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg text-gray-900 font-medium placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition shadow-sm"
                    placeholder="(47) 99999-9999"
                  />
                </div>
              </div>

              {/* BOTÕES DE AÇÃO */}
              <div className="pt-6 flex gap-3 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-bold transition text-sm uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-bold transition shadow-md hover:shadow-lg flex justify-center items-center gap-2 text-sm uppercase"
                >
                  {saving ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Enviar Convite"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
