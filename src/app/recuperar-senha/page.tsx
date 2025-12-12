"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function RecuperarSenhaForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Pega o token da URL (ex: ?token=abcde...)
  const token = searchParams.get("token");

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    msg: string;
  }>({ type: "", msg: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    if (!token) {
      setStatus({ type: "error", msg: "Token inválido ou ausente na URL." });
      return;
    }

    if (senha.length < 6) {
      setStatus({
        type: "error",
        msg: "A senha deve ter no mínimo 6 caracteres.",
      });
      return;
    }

    if (senha !== confirmarSenha) {
      setStatus({ type: "error", msg: "As senhas não coincidem." });
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      // 2. Envia para o backend trocar a senha
      await axios.post(`${apiUrl}api/auth-vendedor/redefinir-senha`, {
        token,
        senha,
      });

      setStatus({
        type: "success",
        msg: "Senha alterada com sucesso! Redirecionando...",
      });

      // Redireciona para o login após 3 segundos
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        "Erro ao redefinir senha. O link pode ter expirado.";
      setStatus({ type: "error", msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border-t-4 border-orange-500 p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Nova Senha
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Defina sua nova senha de acesso.
        </p>
      </div>

      {status.msg && (
        <div
          className={`p-4 rounded-lg mb-6 text-sm font-bold flex gap-2 items-center ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {status.msg}
        </div>
      )}

      {!token ? (
        <div className="text-center text-red-500 font-bold py-10">
          Token não encontrado. Verifique o link do seu e-mail.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Senha */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                // MUDANÇA 1: Adicionei 'text-gray-900' para a senha ficar PRETA
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-orange-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Campo 2: Confirmar Senha */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1">
              Confirmar Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                // MUDANÇA 2: Adicionei 'text-gray-900' e 'placeholder-orange-300' aqui também
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="Repita a senha"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-12 rounded-lg font-bold text-white transition-all shadow-md hover:shadow-lg flex justify-center items-center uppercase tracking-wide ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Redefinir Senha"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

// Página Principal com Suspense (Obrigatório no Next.js para useSearchParams)
export default function RecuperarSenhaPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 font-sans">
      <Suspense
        fallback={
          <div className="text-orange-500 font-bold">Carregando...</div>
        }
      >
        <RecuperarSenhaForm />
      </Suspense>
    </div>
  );
}
