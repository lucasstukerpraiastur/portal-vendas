"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/service/api";

// Componentes UI e Ícones
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { ArrowLeft, Send, Ticket } from "lucide-react";

export default function ConvitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 1. Estado para erros visuais
  const [errors, setErrors] = useState({
    nomeGanhador: false,
  });

  const [form, setForm] = useState({
    nomeGanhador: "",
    telefone: "",
    email: "",
    cidade: "",
    estado: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Limpa o erro visual assim que começa a digitar
    if (name === "nomeGanhador" && errors.nomeGanhador) {
      setErrors((prev) => ({ ...prev, nomeGanhador: false }));
    }
  };

  // 2. Validação ao sair do campo (Blur)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "nomeGanhador") {
      const nomes = value.trim().split(" ");
      // Se tiver menos de 2 nomes ou estiver vazio, marca erro
      if (!value || nomes.length < 2) {
        setErrors((prev) => ({ ...prev, nomeGanhador: true }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 3. Validação final antes de enviar (Trava de segurança)
    const nomes = form.nomeGanhador.trim().split(" ");
    if (nomes.length < 2) {
      setErrors((prev) => ({ ...prev, nomeGanhador: true }));
      alert("Por favor, digite o Nome e o Sobrenome do ganhador.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/convites", form);
      alert("✅ Convite enviado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao enviar convite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 px-4 py-4 mb-8">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="p-2 h-10 w-10 rounded-full border-gray-200"
            >
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-green-700">
            <Ticket size={24} />
            <h1 className="text-xl font-bold text-gray-800">Novo Convite</h1>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader
              title="Dados do Cliente"
              subtitle="Gere um voucher para visita e sorteio"
            />

            <div className="space-y-4 px-2">
              {/* CAMPO NOME - VALIDADO */}
              <div>
                <Input
                  label="Nome do Ganhador"
                  name="nomeGanhador"
                  value={form.nomeGanhador}
                  onChange={handleChange}
                  onBlur={handleBlur} // Chama a validação aqui
                  required
                  placeholder="Nome completo do cliente"
                  className={
                    errors.nomeGanhador
                      ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500"
                      : ""
                  }
                />
                {errors.nomeGanhador && (
                  <span className="text-xs text-red-500 mt-1 block">
                    Digite o Nome e o Sobrenome.
                  </span>
                )}
              </div>

              <Input
                label="Telefone / WhatsApp"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                required
                placeholder="(00) 00000-0000"
              />

              <Input
                label="Email (OBRIGATÓRIO)"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="cliente@email.com"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Cidade"
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  placeholder="Cidade"
                />
                <Input
                  label="Estado"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  placeholder="UF"
                />
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
            >
              <Send size={20} /> ENVIAR CONVITE
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
