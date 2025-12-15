"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; //
import api from "@/service/api"; //
import {
  Plus,
  Loader2,
  ShieldCheck,
  Phone,
  Mail,
  Trash2,
  Briefcase,
  Filter,
  Lock, // Ícone novo para resetar senha
  X, // Ícone para fechar modal
} from "lucide-react";

interface Supervisor {
  id: number;
  nome: string;
}

interface Vendedor {
  id: number;
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string;
  id_supervisor: number;
  ativo: boolean;
}

export default function AdminVendedoresPage() {
  const { user } = useAuth();

  // --- ESTADOS DO FORMULÁRIO DE CRIAÇÃO ---
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [idSupervisor, setIdSupervisor] = useState("");
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DO RESET DE SENHA (MODAL) ---
  const [modalResetOpen, setModalResetOpen] = useState(false);
  const [idParaReset, setIdParaReset] = useState<number | null>(null);
  const [nomeParaReset, setNomeParaReset] = useState("");
  const [novaSenhaReset, setNovaSenhaReset] = useState("");
  const [loadingReset, setLoadingReset] = useState(false);

  // --- DADOS E LISTAS ---
  const [listaSupervisores, setListaSupervisores] = useState<Supervisor[]>([]);
  const [listaVendedores, setListaVendedores] = useState<Vendedor[]>([]);

  // --- ESTADO DO FILTRO (Dropdown) ---
  const [filtroSupervisor, setFiltroSupervisor] = useState("");

  // Carregar dados iniciais
  useEffect(() => {
    carregarSupervisores();
    carregarVendedores();
  }, []);

  async function carregarSupervisores() {
    try {
      const response = await api.get("/api/admin/supervisores");
      setListaSupervisores(response.data);
    } catch (error) {
      console.error("Erro supervisores", error);
    }
  }

  async function carregarVendedores() {
    try {
      const response = await api.get("/api/admin/vendedores");
      setListaVendedores(response.data);
    } catch (error) {
      console.error("Erro vendedores", error);
    }
  }

  // --- LÓGICA DE FILTRO ---
  const vendedoresFiltrados = listaVendedores.filter((vend) => {
    if (!filtroSupervisor) return true;
    return vend.id_supervisor === Number(filtroSupervisor);
  });

  // --- CRIAR VENDEDOR ---
  async function handleCriarVendedor(e: React.FormEvent) {
    e.preventDefault();
    if (!idSupervisor) {
      alert("Selecione um Supervisor.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/admin/vendedores", {
        nome_completo: nome,
        email,
        cpf,
        telefone,
        senha,
        id_supervisor: Number(idSupervisor),
      });

      alert("Vendedor cadastrado!");

      // Limpa e recarrega
      setNome("");
      setEmail("");
      setCpf("");
      setTelefone("");
      setSenha("");
      setIdSupervisor("");
      carregarVendedores();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao criar vendedor.");
    } finally {
      setLoading(false);
    }
  }

  // --- FUNÇÕES DE RESET DE SENHA ---
  function abrirModalReset(vendedor: Vendedor) {
    setIdParaReset(vendedor.id);
    setNomeParaReset(vendedor.nome_completo);
    setNovaSenhaReset("");
    setModalResetOpen(true);
  }

  function fecharModalReset() {
    setModalResetOpen(false);
    setIdParaReset(null);
    setNomeParaReset("");
    setNovaSenhaReset("");
  }

  async function handleApagarVendedor(vendedor: Vendedor) {
    const confirmacao = window.confirm(
      `Tem certeza que deseja inativar o vendedor ${vendedor.nome_completo}?`
    );

    if (!confirmacao) return;

    try {
      await api.delete(`/api/admin/vendedores/${vendedor.id}`);
      alert("Vendedor inativado com sucesso!");
      carregarVendedores();
    } catch (error: any) {
      console.error("Erro ao apagar vendedor", error);
      alert(error.response?.data?.error || "Erro ao inativar vendedor.");
    }
  }

  async function handleConfirmarReset() {
    if (!novaSenhaReset) return alert("Digite a nova senha.");
    if (!idParaReset) return;

    setLoadingReset(true);
    try {
      // Ajuste a URL abaixo se sua rota for diferente (ex: /api/resetar-senha)
      await api.post("/api/admin/resetar-senha", {
        tipo: "VENDEDOR", // Importante para o switch/case do backend
        id: idParaReset,
        novaSenha: novaSenhaReset,
      });

      alert("Senha alterada com sucesso!");
      fecharModalReset();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao resetar senha.");
    } finally {
      setLoadingReset(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUNA 1: FORMULÁRIO (STICKY) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-purple-600" /> Novo Vendedor
            </h2>

            <form onSubmit={handleCriarVendedor} className="space-y-4">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <label className="text-xs font-bold text-purple-700 uppercase mb-2 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Vincular a Equipe
                </label>
                <select
                  value={idSupervisor}
                  onChange={(e) => setIdSupervisor(e.target.value)}
                  className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white text-gray-900 text-sm"
                  required
                >
                  <option value="">Selecione o Supervisor...</option>
                  {listaSupervisores.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Senha Inicial
                </label>
                <input
                  type="text"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-purple-100"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "CADASTRAR"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* --- COLUNA 2: LISTA COM FILTRO FIXO --- */}
        <div className="lg:col-span-2">
          {/* HEADER DA TABELA + DROPDOWN DE FILTRO */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              Equipe de Vendas
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {vendedoresFiltrados.length}
              </span>
            </h2>

            {/* O SELECT DE FILTRO FIXO */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-500" />
              </div>
              <select
                value={filtroSupervisor}
                onChange={(e) => setFiltroSupervisor(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-300 bg-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium text-gray-700 cursor-pointer"
              >
                <option value="">Todas as Equipes</option>
                {listaSupervisores.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    Equipe: {sup.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {vendedoresFiltrados.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                <Briefcase className="h-12 w-12 mb-3 opacity-20" />
                <p>Nenhum vendedor encontrado nesta equipe.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                      Vendedor
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">
                      Contato
                    </th>
                    {!filtroSupervisor && (
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">
                        Equipe
                      </th>
                    )}
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vendedoresFiltrados.map((vend) => {
                    const supervisor = listaSupervisores.find(
                      (s) => s.id === vend.id_supervisor
                    );
                    return (
                      <tr
                        key={vend.id}
                        className={`transition-colors group border-b border-gray-100 ${
                          !vend.ativo
                            ? "bg-gray-100 text-gray-500"
                            : "hover:bg-purple-50/30"
                        }`}
                      >
                        <td className="p-4">
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                              {vend.nome_completo?.charAt(0).toUpperCase()}
                            </div>
                            {vend.nome_completo}
                          </div>
                          <div className="text-xs text-gray-500 sm:hidden mt-1 pl-10">
                            {vend.email}
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3 text-gray-400" />{" "}
                            {vend.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Phone className="h-3 w-3 text-gray-400" />{" "}
                            {vend.telefone}
                          </div>
                          <div>
                            {!vend.ativo && (
                              <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 uppercase font-bold">
                                Inativo
                              </span>
                            )}
                          </div>
                        </td>

                        {!filtroSupervisor && (
                          <td className="p-4 hidden md:table-cell">
                            {supervisor ? (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                {supervisor.nome}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                        )}

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* BOTÃO RESETAR SENHA */}
                            <button
                              onClick={() => abrirModalReset(vend)}
                              title="Resetar Senha"
                              className="text-gray-400 hover:text-purple-600 p-2 hover:bg-purple-50 rounded-lg transition-all"
                            >
                              <Lock className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleApagarVendedor(vend)}
                              title="Excluir"
                              className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* --- MODAL DE RESET DE SENHA --- */}
      {modalResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header do Modal */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                Resetar Senha
              </h3>
              <button
                onClick={fecharModalReset}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Você está alterando a senha do vendedor: <br />
                <span className="font-bold text-gray-900">{nomeParaReset}</span>
              </p>

              <label className="text-xs font-semibold text-gray-500 uppercase">
                Nova Senha
              </label>
              <input
                type="text"
                value={novaSenhaReset}
                onChange={(e) => setNovaSenhaReset(e.target.value)}
                placeholder="Digite a nova senha..."
                className="w-full mt-1 p-3 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Footer do Modal */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={fecharModalReset}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loadingReset}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarReset}
                disabled={loadingReset}
                className="px-4 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md shadow-purple-200 transition-all flex items-center gap-2"
              >
                {loadingReset ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" /> Salvando...
                  </>
                ) : (
                  "Confirmar Alteração"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
