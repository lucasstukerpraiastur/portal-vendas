"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

function AtivarContaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    tipo: "erro" | "sucesso" | "";
    msg: string;
  }>({ tipo: "", msg: "" });

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) {
      setToken(t);
    } else {
      setStatus({
        tipo: "erro",
        msg: "Token inválido ou não encontrado na URL.",
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (senha.length < 6) {
      setStatus({
        tipo: "erro",
        msg: "A senha precisa ter pelo menos 6 caracteres.",
      });
      return;
    }

    if (senha !== confirmarSenha) {
      setStatus({ tipo: "erro", msg: "As senhas não coincidem." });
      return;
    }

    setLoading(true);
    setStatus({ tipo: "", msg: "" });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      await axios.post(`${apiUrl}/api/auth-vendedor/ativar-conta`, {
        token,
        senha,
      });

      setStatus({
        tipo: "sucesso",
        msg: "Senha criada com sucesso! Redirecionando...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      const msgErro =
        error.response?.data?.message ||
        "Erro ao ativar conta. Tente novamente.";
      setStatus({ tipo: "erro", msg: msgErro });
    } finally {
      setLoading(false);
    }
  };

  if (!token && status.tipo === "erro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center border-l-4 border-red-500">
          <h2 className="text-red-600 text-xl font-bold mb-2">Link Inválido</h2>
          <p className="text-gray-800">{status.msg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo à Equipe!
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Defina sua senha para acessar o painel de vendas.
          </p>
        </div>

        {status.msg && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm font-bold border ${
              status.tipo === "sucesso"
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
            }`}
          >
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {/* CORREÇÃO: Label mais escura e visível (text-gray-900) */}
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Nova Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              // CORREÇÃO: Fundo branco (bg-white) e texto preto (text-gray-900) para alto contraste
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition bg-white text-gray-900 placeholder-gray-400"
              placeholder="Digite sua senha segura"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition bg-white text-gray-900 placeholder-gray-400"
              placeholder="Repita a senha"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-bold text-white text-lg transition duration-200 shadow-md ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800 hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? "Ativando..." : "Definir Senha e Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AtivarContaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-gray-600 font-medium">
          Carregando...
        </div>
      }
    >
      <AtivarContaContent />
    </Suspense>
  );
}
