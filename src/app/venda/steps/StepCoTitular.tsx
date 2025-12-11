import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StepProps } from "../types";
import { Search, Loader2 } from "lucide-react";
import api from "@/service/api";

export function StepCoTitular({
  formData,
  handleChange,
  setFormData,
}: StepProps) {
  const [loading, setLoading] = useState(false);

  const handleBuscarCPF = async () => {
    const cpfLimpo = formData.cpfCoTitular?.replace(/\D/g, "") || "";
    // Removemos a necessidade de ler a data aqui

    if (cpfLimpo.length !== 11) {
      alert("Digite um CPF válido.");
      return;
    }

    setLoading(true);
    try {
      // Volta a chamar simples, sem o parâmetro &data=
      const { data } = await api.get(`/api/consulta-cpf?cpf=${cpfLimpo}`);

      setFormData((prev) => ({
        ...prev,
        nomeCoTitular: data.nome || prev.nomeCoTitular,
        dataNascimentoCoTitular:
          data.data_nascimento || prev.dataNascimentoCoTitular,
        sexoCoTitular: data.genero || prev.sexoCoTitular,
      }));
    } catch (error: any) {
      console.error(error);
      alert("CPF não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Dados do Co-Titular (Opcional)"
        subtitle="Preencha apenas se houver segundo titular."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CPF + BOTÃO DE BUSCA */}
        <div className="relative">
          {/* MUDANÇA AQUI: text-gray-900 */}
          <label className="text-sm font-bold text-gray-900 block mb-1">
            CPF
          </label>
          <div className="relative flex items-center">
            <input
              name="cpfCoTitular"
              value={formData.cpfCoTitular}
              onChange={handleChange}
              className="w-full border p-2.5 rounded-lg pr-12 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="000.000.000-00"
              maxLength={14}
            />
            <button
              type="button"
              onClick={handleBuscarCPF}
              disabled={loading}
              className="absolute right-2 p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
              title="Buscar dados (Preencha a data antes!)"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Input
          label="Nome Completo"
          name="nomeCoTitular"
          value={formData.nomeCoTitular}
          onChange={handleChange}
          placeholder="Digite o nome completo"
          pattern="^\S+ .+$"
          title="Por favor, digite o nome e o sobrenome"
        />

        <Input
          label="RG"
          name="rgCoTitular"
          value={formData.rgCoTitular}
          onChange={handleChange}
          placeholder="Digite o RG"
        />

        <div className="flex flex-col gap-1">
          {/* MUDANÇA AQUI: text-gray-900 */}
          <label className="text-sm font-bold text-gray-900">Sexo</label>
          <select
            name="sexoCoTitular"
            value={formData.sexoCoTitular}
            onChange={handleChange}
            className="border p-2.5 rounded-lg bg-white text-gray-900"
          >
            <option value="">Selecione...</option>
            <option value="">" "</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </div>

        {/* DATA DE NASCIMENTO (IMPORTANTE PARA A BUSCA) */}
        <Input
          label="Data de Nascimento"
          type="date"
          name="dataNascimentoCoTitular"
          value={formData.dataNascimentoCoTitular}
          onChange={handleChange}
        />

        <Input
          label="Telefone"
          name="telefoneCoTitular"
          value={formData.telefoneCoTitular}
          onChange={handleChange}
          placeholder="(00) 00000-0000"
        />
        <Input
          label="Email"
          type="email"
          name="emailCoTitular"
          value={formData.emailCoTitular}
          onChange={handleChange}
          placeholder="email@exemplo.com"
        />
        <Input
          label="Profissão"
          name="profissaoCoTitular"
          value={formData.profissaoCoTitular}
          onChange={handleChange}
          placeholder="Digite a profissão"
        />
      </div>
    </Card>
  );
}
