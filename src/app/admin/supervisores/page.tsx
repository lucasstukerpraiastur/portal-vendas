"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "../../../service/api"; // Ajuste o caminho se necessário
import {
  LogOut,
  Plus,
  Loader2,
  Phone,
  Mail,
  Trash2,
  Building2,
  Lock, // Novo ícone
  X, // Novo ícone para fechar modal
} from "lucide-react";

interface Supervisor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  ativo: boolean;
}

export default function AdminSupervisoresPage() {
  const { user } = useAuth();
  const router = useRouter();

  // --- ESTADOS DO FORMULÁRIO DE CRIAÇÃO ---
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  // --- ESTADOS DA AGÊNCIA ---
  const [nomeAgencia, setNomeAgencia] = useState("");
  const [docAgencia, setDocAgencia] = useState("");

  const [loading, setLoading] = useState(false);
  const [listaSupervisores, setListaSupervisores] = useState<Supervisor[]>([]);

  // --- ESTADOS DO RESET DE SENHA (MODAL) ---
  const [modalResetOpen, setModalResetOpen] = useState(false);
  const [idParaReset, setIdParaReset] = useState<number | null>(null);
  const [nomeParaReset, setNomeParaReset] = useState("");
  const [novaSenhaReset, setNovaSenhaReset] = useState("");
  const [loadingReset, setLoadingReset] = useState(false);

  // Trava de Segurança
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Carrega Lista
  useEffect(() => {
    if (user?.role === "ADMIN") {
      carregarSupervisores();
    }
  }, [user]);

  async function carregarSupervisores() {
    try {
      const response = await api.get("/api/admin/supervisores");
      setListaSupervisores(response.data);
    } catch (error) {
      console.error("Erro ao listar supervisores", error);
    }
  }

  async function handleCriarSupervisor(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/admin/supervisores", {
        nome,
        email,
        cpf,
        telefone,
        senha,
        nome_agencia: nomeAgencia,
        documento_agencia: docAgencia,
      });

      alert("Supervisor e Agência criados com sucesso!");

      // Limpa tudo
      setNome("");
      setEmail("");
      setCpf("");
      setTelefone("");
      setSenha("");
      setNomeAgencia("");
      setDocAgencia("");

      carregarSupervisores();
    } catch (error: any) {
      const msg = error.response?.data?.error || "Erro ao criar cadastro.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  // --- FUNÇÕES DE RESET DE SENHA ---
  function abrirModalReset(supervisor: Supervisor) {
    setIdParaReset(supervisor.id);
    setNomeParaReset(supervisor.nome);
    setNovaSenhaReset("");
    setModalResetOpen(true);
  }

  function fecharModalReset() {
    setModalResetOpen(false);
    setIdParaReset(null);
    setNomeParaReset("");
    setNovaSenhaReset("");
  }

  async function handleConfirmarReset() {
    if (!novaSenhaReset) return alert("Digite a nova senha.");
    if (!idParaReset) return;

    setLoadingReset(true);
    try {
      // Chama a rota que configuramos
      await api.post("/api/admin/resetar-senha", {
        tipo: "SUPERVISOR", // IMPORTANTE: Tipo correto para o backend
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

  // Loading state
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUNA 1: FORMULÁRIO */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-orange-500" /> Novo Cadastro
            </h2>

            <form onSubmit={handleCriarSupervisor} className="space-y-4">
              {/* --- DADOS PESSOAIS --- */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Ex: João da Silva"
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
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="joao@praiastur.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    CPF (Pessoal)
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="000.000.000-00"
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
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="(47) 99999-9999"
                    required
                  />
                </div>
              </div>

              {/* --- DADOS DA AGÊNCIA --- */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-orange-500" />
                  <p className="text-sm font-bold text-gray-700">
                    Dados da Agência
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Nome Fantasia
                    </label>
                    <input
                      type="text"
                      value={nomeAgencia}
                      onChange={(e) => setNomeAgencia(e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Ex: Viajar Mais Ltda"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Documento (CNPJ/CPF)
                    </label>
                    <input
                      type="text"
                      value={docAgencia}
                      onChange={(e) => setDocAgencia(e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="CNPJ ou CPF da Empresa"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* --- SENHA --- */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Senha de Acesso
                </label>
                <input
                  type="text"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Defina a senha inicial"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "CADASTRAR TUDO"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* COLUNA 2: LISTA */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Supervisores Ativos
          </h2>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {listaSupervisores.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                Nenhum supervisor cadastrado ainda.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                      Nome
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">
                      Contato
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listaSupervisores.map((sup) => (
                    <tr
                      key={sup.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {sup.nome}
                        </div>
                        <div className="text-sm text-gray-500 sm:hidden">
                          {sup.email}
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4 text-gray-400" /> {sup.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Phone className="h-4 w-4 text-gray-400" />{" "}
                          {sup.telefone}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* BOTÃO RESETAR SENHA */}
                          <button
                            onClick={() => abrirModalReset(sup)}
                            title="Resetar Senha"
                            className="text-gray-400 hover:text-orange-500 p-2 hover:bg-orange-50 rounded-lg transition-all"
                          >
                            <Lock className="h-4 w-4" />
                          </button>

                          {/* BOTÃO EXCLUIR */}
                          <button
                            title="Excluir"
                            className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                <Lock className="h-5 w-5 text-orange-500" />
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
                Você está alterando a senha do supervisor: <br />
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
                className="w-full mt-1 p-3 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
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
                className="px-4 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-md shadow-orange-200 transition-all flex items-center gap-2"
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
