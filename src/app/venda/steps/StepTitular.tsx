import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StepProps } from "../types";
import { Search, Loader2 } from "lucide-react";
import api from "@/service/api";

export function StepTitular({
  formData,
  handleChange,
  setFormData,
}: StepProps) {
  const [loading, setLoading] = useState(false);

  // 1. Adicionei 'nomeTitular' ao estado de erros
  const [errors, setErrors] = useState({
    telefone: false,
    email: false,
    nomeTitular: false,
  });

  const handleBuscarCPF = async () => {
    const cpfLimpo = formData.cpfTitular.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      alert("Digite um CPF válido.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get(`/api/consulta-cpf?cpf=${cpfLimpo}`);

      setFormData((prev) => ({
        ...prev,
        nomeTitular: data.nome || prev.nomeTitular,
        dataNascimentoTitular:
          data.data_nascimento || prev.dataNascimentoTitular,
        sexoTitular: data.genero || prev.sexoTitular,
      }));
    } catch (error: any) {
      console.error(error);
      alert("CPF não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Atualizei a função handleBlur para aceitar 'nomeTitular' e validar sobrenome
  const handleBlur = (
    field: "telefone" | "email" | "nomeTitular",
    value: string
  ) => {
    let hasError = false;

    if (field === "nomeTitular") {
      // Verifica se está vazio OU se não tem pelo menos 2 nomes
      const nomes = value.trim().split(" ");
      hasError = !value || nomes.length < 2;
    } else {
      // Para telefone e email, verifica apenas se está vazio (ou adicione regex se quiser)
      hasError = !value || value.trim() === "";
    }

    setErrors((prev) => ({ ...prev, [field]: hasError }));
  };

  return (
    <Card>
      <CardHeader title="Dados do Titular" subtitle="Responsável financeiro" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CAMPO DE CPF */}
        <div className="relative">
          <label className="text-sm font-bold text-gray-900 block mb-1">
            CPF
          </label>
          <div className="relative flex items-center">
            <input
              name="cpfTitular"
              value={formData.cpfTitular}
              onChange={handleChange}
              className="w-full border p-2.5 rounded-lg pr-12 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              placeholder="000.000.000-00"
              maxLength={14}
            />
            <button
              type="button"
              onClick={handleBuscarCPF}
              disabled={loading}
              className="absolute right-2 p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
              title="Buscar dados do CPF"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* NOME COMPLETO - ATUALIZADO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-900">
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <Input
            name="nomeTitular"
            value={formData.nomeTitular}
            onChange={(e) => {
              handleChange(e);
              // Limpa o erro assim que o usuário começa a corrigir
              if (errors.nomeTitular)
                setErrors((prev) => ({ ...prev, nomeTitular: false }));
            }}
            // 3. Chama a validação ao sair do campo
            onBlur={(e) => handleBlur("nomeTitular", e.target.value)}
            required
            placeholder="Digite o nome completo"
            // Adiciona borda vermelha se tiver erro
            className={`bg-white ${
              errors.nomeTitular ? "border-red-500 ring-1 ring-red-500" : ""
            }`}
          />
          {/* Mensagem de erro abaixo do input */}
          {errors.nomeTitular && (
            <span className="text-xs text-red-500">
              Digite o Nome e o Sobrenome.
            </span>
          )}
        </div>

        {/* RG */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-900">RG</label>
          <Input
            name="rgTitular"
            value={formData.rgTitular}
            onChange={handleChange}
            placeholder="Digite o RG"
            className="bg-white"
          />
        </div>

        {/* SEXO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-900">Sexo</label>
          <select
            name="sexoTitular"
            value={formData.sexoTitular}
            onChange={handleChange}
            required
            className="border p-2.5 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </div>

        {/* DATA NASCIMENTO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-900">
            Data de Nascimento
          </label>
          <Input
            type="date"
            name="dataNascimentoTitular"
            value={formData.dataNascimentoTitular}
            onChange={handleChange}
            required
            className="bg-white"
          />
        </div>

        {/* TELEFONE (OBRIGATÓRIO) */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-900">
            Telefone <span className="text-red-500">*</span>
          </label>
          <Input
            name="telefoneTitular"
            value={formData.telefoneTitular}
            onChange={(e) => {
              handleChange(e);
              if (errors.telefone)
                setErrors((prev) => ({ ...prev, telefone: false }));
            }}
            onBlur={(e) => handleBlur("telefone", e.target.value)}
            required
            placeholder="(00) 00000-0000"
            className={`bg-white ${
              errors.telefone ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.telefone && (
            <span className="text-xs text-red-500">
              Telefone é obrigatório.
            </span>
          )}
        </div>

        {/* ESTADO CIVIL */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-900">
            Estado Civil
          </label>
          <Input
            name="estadoCivilTitular"
            value={formData.estadoCivilTitular}
            onChange={handleChange}
            placeholder="Ex: Casado(a)"
            className="bg-white"
          />
        </div>

        {/* PROFISSÃO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-900">Profissão</label>
          <Input
            name="profissaoTitular"
            value={formData.profissaoTitular}
            onChange={handleChange}
            placeholder="Digite a profissão"
            className="bg-white"
          />
        </div>

        {/* EMAIL (OBRIGATÓRIO) */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-900">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            name="emailTitular"
            value={formData.emailTitular}
            onChange={(e) => {
              handleChange(e);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: false }));
            }}
            onBlur={(e) => handleBlur("email", e.target.value)}
            placeholder="Digite o email"
            className={`bg-white ${
              errors.email ? "border-red-500 focus:ring-red-500" : ""
            }`}
            required
          />
          {errors.email && (
            <span className="text-xs text-red-500">Email é obrigatório.</span>
          )}
        </div>
      </div>
    </Card>
  );
}
