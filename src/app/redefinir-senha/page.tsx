"use client";

import { useState } from "react";
import axios from "axios";
import { Mail, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    tipo: "erro" | "sucesso" | "";
    msg: string;
  }>({ tipo: "", msg: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus({ tipo: "", msg: "" });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      await axios.post(`${apiUrl}/api/auth-vendedor/esqueci-senha`, { email });

      setStatus({
        tipo: "sucesso",
        msg: "Se o e-mail estiver cadastrado, enviamos um link de recuperação para ele. Verifique sua caixa de entrada (e spam).",
      });
      setEmail("");
    } catch (error: any) {
      const msg =
        error.response?.data?.error ||
        "Erro ao solicitar recuperação. Tente novamente.";
      setStatus({ tipo: "erro", msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border-t-4 border-orange-500 p-8">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <KeyRound className="text-orange-600 h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Recuperar Senha
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Digite seu e-mail para receber as instruções.
          </p>
        </div>

        {/* Feedback */}
        {status.msg && (
          <div
            className={`p-4 rounded-lg mb-6 text-sm font-bold border ${
              status.tipo === "sucesso"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
              E-mail Cadastrado
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition shadow-sm"
                placeholder="exemplo@praiastur.com.br"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-bold text-white text-base transition-all shadow-md hover:shadow-lg flex justify-center items-center uppercase tracking-wide ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Enviar Link de Recuperação"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft size={16} /> Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
