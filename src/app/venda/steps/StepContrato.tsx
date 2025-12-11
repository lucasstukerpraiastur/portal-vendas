import { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StepProps } from "../types";
import api from "@/service/api";
import { ModalDecisaoVenda } from "@/components/ModalDecisaoVenda";

export function StepContrato({
  formData,
  handleChange,
  setFormData,
}: StepProps) {
  const [loadingNumero, setLoadingNumero] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // --- LÓGICA DO MODAL (Manteve igual) ---
  useEffect(() => {
    if (!formData.tipoEnvioContrato) {
      setShowModal(true);
    } else if (
      formData.tipoEnvioContrato === "Digital" &&
      !formData.numeroContrato
    ) {
      buscarProximoNumero();
    }
  }, []);

  const buscarProximoNumero = async () => {
    if (!setFormData) return;
    setLoadingNumero(true);
    try {
      const { data } = await api.get("/api/vendas/proximo-numero");
      setFormData((prev) => ({ ...prev, numeroContrato: data.numero }));
    } catch (error) {
      console.error("Erro ao buscar número", error);
    } finally {
      setLoadingNumero(false);
    }
  };

  const handleDecisaoModal = (gerarDigital: boolean) => {
    if (setFormData) {
      const tipoEnvio = gerarDigital ? "Digital" : "Manual";
      setFormData((prev) => ({
        ...prev,
        tipoEnvioContrato: tipoEnvio,
        numeroContrato: gerarDigital ? prev.numeroContrato : "",
        tipoVenda: gerarDigital ? "Online" : prev.tipoVenda,
      }));
      if (gerarDigital) buscarProximoNumero();
    }
    setShowModal(false);
  };

  const isDigital = formData.tipoEnvioContrato === "Digital";

  return (
    <>
      <ModalDecisaoVenda
        isOpen={showModal}
        loading={loadingNumero}
        onClose={() => {}}
        onConfirm={handleDecisaoModal}
      />

      <Card>
        <CardHeader
          title="Dados Iniciais"
          subtitle="Identificação do documento"
        />

        <div className="px-6 pb-2 flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-blue-600 hover:underline cursor-pointer"
          >
            Alterar modo ({isDigital ? "Gerar Automático" : "Digitar Manual"})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Número do Contrato"
            name="numeroContrato"
            value={formData.numeroContrato || ""}
            onChange={handleChange}
            required
            readOnly={isDigital}
            disabled={loadingNumero}
            className={
              isDigital ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }
            placeholder={loadingNumero ? "Gerando..." : "Digite o número"}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Modalidade da Venda
            </label>
            <select
              name="tipoVenda"
              value={formData.tipoVenda || ""}
              onChange={handleChange}
              disabled={isDigital}
              className={`w-full border p-2.5 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                isDigital ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              }`}
              required
            >
              <option value="" disabled>
                Selecione...
              </option>
              <option value="Online">Online</option>
              <option value="Presencial">Presencial</option>
            </select>
          </div>
        </div>
      </Card>
    </>
  );
}
