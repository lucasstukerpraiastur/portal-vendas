"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link"; // <--- Importamos o Link aqui
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // O signIn agora retorna os dados do usuário
      const user = await signIn({ email, password: senha });

      // LÓGICA DE REDIRECIONAMENTO POR CARGO
      switch (user.role) {
        case "ADMIN":
          router.push("/");
          break;
        case "SUPERVISOR":
          router.push("/");
          break;
        case "VENDEDOR":
          router.push("/");
          break;
        default:
          router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Erro ao acessar. Verifique suas credenciais.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
      {/* Card Principal */}
      <Card className="w-full max-w-md shadow-xl shadow-orange-500/5 border-0 bg-white relative overflow-hidden p-0">
        {/* Barra de destaque superior (Laranja Praiastur) */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>

        {/* Header Personalizado */}
        <div className="space-y-4 text-center pb-8 pt-12 px-6">
          {/* Logo Icon (Sol/Energia) */}
          <div className="mx-auto bg-orange-50 w-24 h-24 rounded-2xl flex items-center justify-center mb-4 group transition-all duration-300 hover:bg-orange-100">
            <Image
              src="/Logo-P.png"
              alt="Logo Praiastur"
              width={70} // Aumentei de 40 para 70
              height={70} // Aumentei de 40 para 70
              className="group-hover:scale-110 transition-transform duration-300 object-contain"
              priority
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Praiastur <span className="text-orange-500">Financeiro</span>
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Bem-vindo de volta. Acesse sua conta.
            </p>
          </div>
        </div>

        {/* Conteúdo do Formulário */}
        <div className="px-6 pb-6">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <Input
                  type="email"
                  placeholder="usuario@praiastur.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Input Senha */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1">
                  Senha
                </label>
                {/* CORREÇÃO: Agora usamos o Link do Next.js para a rota correta */}
                <Link
                  href="/esqueci-senha"
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium hover:underline transition-all"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium animate-in fade-in">
                {error}
              </div>
            )}

            {/* Botão Laranja */}
            <Button
              type="submit"
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold tracking-wide shadow-lg shadow-orange-500/20 transition-all duration-300 rounded-lg"
              disabled={loading}
              isLoading={loading}
            >
              {loading ? "Entrando..." : "ACESSAR SISTEMA"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-center py-6 bg-gray-50/50 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} Praiastur. Todos os direitos
            reservados.
          </p>
        </div>
      </Card>
    </div>
  );
}
