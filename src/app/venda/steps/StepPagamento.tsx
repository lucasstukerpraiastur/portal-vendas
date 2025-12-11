import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StepProps } from "../types";

// --- TABELA DE PREÇOS 2025 ---
const TABELA_OURO_2025 = [
  { p: 1, v: 4200.0 },
  { p: 2, v: 2160.0 },
  { p: 3, v: 1475.0 },
  { p: 4, v: 1120.0 },
  { p: 5, v: 908.0 },
  { p: 6, v: 760.0 },
  { p: 7, v: 655.0 },
  { p: 8, v: 575.0 },
  { p: 9, v: 515.0 },
  { p: 10, v: 465.0 },
  { p: 11, v: 425.0 },
  { p: 12, v: 392.0 },
  { p: 13, v: 365.0 },
  { p: 14, v: 340.0 },
  { p: 15, v: 318.0 },
  { p: 16, v: 300.0 },
  { p: 17, v: 285.0 },
  { p: 18, v: 270.0 },
  { p: 19, v: 260.0 },
  { p: 20, v: 250.0 },
  { p: 21, v: 240.0 },
  { p: 22, v: 230.0 },
  { p: 23, v: 222.0 },
  { p: 24, v: 215.0 },
];

// --- LISTA 1: OPÇÕES PARA ENTRADA (Conforme vendaService.js - FORMA_PAGAMENTO_ENTRADA_MAP) ---
const OPCOES_ENTRADA = [
  { label: "Pix", value: "Pix" }, // Backend espera "Pix"
  { label: "Dinheiro", value: "Dinheiro" },
  { label: "Cartão de Crédito", value: "Cartão de Crédito" },
  { label: "Cartão de Débito", value: "Cartão de Débito" },
  { label: "Boleto", value: "Boleto" },
  { label: "Cheque", value: "Cheque" },
  {
    label: "Cartão de Crédito + Dinheiro",
    value: "Cartão de Crédito + Dinheiro",
  },
  // Backend Entrada chama de "Cartão de Débito + Crédito"
  {
    label: "Cartão de Crédito + Cartão de Débito",
    value: "Cartão de Débito + Crédito",
  },
  { label: "Cartão de Débito + Pix", value: "Cartão de Débito + Pix" },
  { label: "Cartão de Crédito + Pix", value: "Cartão de Crédito + Pix" },
  { label: "Pix + Dinheiro", value: "Pix + Dinheiro" },
];

// --- LISTA 2: OPÇÕES PARA PLANO (Conforme vendaService.js - FORMA_PAGAMENTO_MAP) ---
const OPCOES_PLANO = [
  { label: "Pix", value: "PIX" }, // Backend espera "PIX" (Maiúsculo)
  { label: "Cartão de Crédito", value: "Cartão de Crédito" },
  { label: "Boleto", value: "Boleto" },
  { label: "Cartão de Débito", value: "Cartão de Débito" },
  { label: "Cheque", value: "Cheque" },
  {
    label: "Cartão de Crédito + Dinheiro",
    value: "Cartão de Crédito + Dinheiro",
  },
  {
    label: "Cartão de Crédito + Cartão de Débito",
    value: "Cartão de Crédito + Cartão de Débito",
  },
  { label: "Cartão de Débito + Pix", value: "Cartão de Débito + Pix" },
  { label: "Boleto + Cartão de Crédito", value: "Boleto + Cartão de Crédito" },
  { label: "Pix + Dinheiro", value: "Pix + Dinheiro" },
  // REMOVIDO: "Cartão de Crédito + Pix" (Não existe no mapa de Plano do backend)
];

export function StepPagamento({
  formData,
  handleChange,
  setFormData,
}: StepProps) {
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const handleSelecionarOpcao = (parcelas: number, valorParcela: number) => {
    if (!setFormData) return;
    const totalCalculado = parcelas * valorParcela;

    setFormData((prev) => ({
      ...prev,
      valorTotalPlano: totalCalculado.toFixed(2),
      detalhesParcelamento: `${parcelas}x de ${formatMoney(valorParcela)}`,
    }));
  };

  const isPlanoOuro = formData.tipoContratoNome === "Ouro";

  return (
    <Card>
      <CardHeader title="Negociação e Pagamento" />

      {/* =================================================================
          BLOCO 1: ENTRADA
      ================================================================= */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 border-b pb-2 border-gray-300">
          1. Dados da Entrada (Sinal)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Valor da Entrada (R$)"
            name="valorEntrada"
            type="number"
            value={formData.valorEntrada}
            onChange={handleChange}
            placeholder="0,00"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-900">
              Forma de Pagamento (Entrada)
            </label>
            <select
              name="formaDePagamentoEntradaNome"
              value={formData.formaDePagamentoEntradaNome}
              onChange={handleChange}
              className="border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm"
            >
              <option value="">Selecione...</option>
              {/* USANDO A LISTA ESPECÍFICA DE ENTRADA */}
              {OPCOES_ENTRADA.map((opcao) => (
                <option key={`entrada-${opcao.value}`} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Detalhes da Entrada"
              name="valorParcela"
              value={formData.valorParcela}
              onChange={handleChange}
              placeholder="Ex: 1x no Pix..."
            />
          </div>
        </div>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-sm text-gray-500 font-medium">
            Saldo Restante / Plano
          </span>
        </div>
      </div>

      {/* =================================================================
          BLOCO 2: O PLANO
      ================================================================= */}
      <div className="bg-slate-50 p-4 rounded-lg border border-blue-100 mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 border-b pb-2 border-slate-200">
          2. Dados do Plano (Saldo)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-900">
              Qual o Plano?
            </label>
            <select
              name="tipoContratoNome"
              value={formData.tipoContratoNome || ""}
              onChange={handleChange}
              className="border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm"
              required
            >
              <option value="" disabled>
                Selecione...
              </option>
              <option value="Ouro">Ouro</option>
              <option value="Prata">Prata</option>
              <option value="Diamante">Diamante</option>
            </select>
          </div>

          <Input
            label="Valor Total do Plano (R$)"
            name="valorTotalPlano"
            type="number"
            value={formData.valorTotalPlano || ""}
            onChange={handleChange}
            required
            placeholder="Selecione na tabela ou digite"
          />
        </div>

        {/* TABELA DE PREÇOS (OURO) */}
        {isPlanoOuro && (
          // 1. Container: Borda cinza suave (gray-200) em vez de amarelo
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            {/* 2. Título: Cinza discreto (gray-500) em vez de amarelo forte */}
            <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Tabela Ouro 2025
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
              {TABELA_OURO_2025.map((item) => {
                const totalOpcao = (item.p * item.v).toFixed(2);
                const isSelected = formData.valorTotalPlano === totalOpcao;
                return (
                  <button
                    key={item.p}
                    type="button"
                    onClick={() => handleSelecionarOpcao(item.p, item.v)}
                    className={`
                      flex justify-between items-center p-2 rounded text-xs transition-all border
                      ${
                        isSelected
                          ? "bg-orange-500 text-white border-orange-600 shadow-md transform scale-[1.02]"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                        // 3. Hover: Agora é cinza um pouco mais escuro, removi o amarelo
                      }
                    `}
                  >
                    <span
                      className={`font-semibold ${
                        isSelected ? "text-orange-100" : "text-gray-500"
                      }`}
                    >
                      {item.p}x
                    </span>
                    <span
                      className={`font-bold ${
                        isSelected ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {formatMoney(item.v)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-900">
              Forma de Pagamento (Plano)
            </label>
            <select
              name="formaDePagamentoNome"
              value={formData.formaDePagamentoNome}
              onChange={handleChange}
              required
              className="border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-black-500 text-gray-900 shadow-sm"
            >
              <option value="">Selecione...</option>
              {/* USANDO A LISTA ESPECÍFICA DE PLANO */}
              {OPCOES_PLANO.map((opcao) => (
                <option key={`plano-${opcao.value}`} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Detalhes das Parcelas"
              name="detalhesParcelamento"
              value={formData.detalhesParcelamento}
              onChange={handleChange}
              placeholder="Ex: 12x de R$ 392,00 (Coloque a data de inicio de pagamento)"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-bold text-gray-700">
          Observações Gerais
        </label>
        <textarea
          name="obsPagamento"
          value={formData.obsPagamento}
          onChange={handleChange}
          rows={3}
          placeholder="Informações adicionais | data de inicio de pagamento do Plano"
          className="border p-3 mt-1 rounded-lg bg-white outline-none focus:ring-2 focus:ring-black-500 w-full text-gray-900"
        ></textarea>
      </div>
    </Card>
  );
}
