"use client";
import Cookies from "js-cookie";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/service/api";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
// Importando o Modal
import { ModalDecisaoVenda } from "@/components/ModalDecisaoVenda";

import { StepContrato } from "./steps/StepContrato";
import { StepTitular } from "./steps/StepTitular";
import { StepCoTitular } from "./steps/StepCoTitular";
import { StepDependentes } from "./steps/StepDependentes";
import { StepEndereco } from "./steps/StepEndereco";
import { StepPagamento } from "./steps/StepPagamento";
import { StepRevisao } from "./steps/StepRevisao";
import { VendaFormData } from "./types";

const STEPS_LABELS = [
  "Contrato",
  "Titular",
  "Co-Titular",
  "Dependentes",
  "Endereço",
  "Pagamento",
  "Revisão",
];

export default function VendaPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controle do Modal

  const [formData, setFormData] = useState<VendaFormData>({
    tipoVenda: "Presencial",
    tipoContratoNome: "Ouro",
    numeroContrato: "",
    valorTotalPlano: "",
    nomeTitular: "",
    cpfTitular: "",
    rgTitular: "",
    telefoneTitular: "",
    emailTitular: "",
    dataNascimentoTitular: "",
    estadoCivilTitular: "",
    profissaoTitular: "",
    sexoTitular: "Masculino",
    nomeCoTitular: "",
    cpfCoTitular: "",
    rgCoTitular: "",
    telefoneCoTitular: "",
    emailCoTitular: "",
    dataNascimentoCoTitular: "",
    profissaoCoTitular: "",
    sexoCoTitular: "Feminino",
    // Dependentes
    nomeDependente1: "",
    cpfDependente1: "",
    parentescoDependente1: "",
    telefoneDependente1: "",
    dataNascimentoDependente1: "",
    nomeDependente2: "",
    cpfDependente2: "",
    parentescoDependente2: "",
    telefoneDependente2: "",
    dataNascimentoDependente2: "",
    nomeDependente3: "",
    cpfDependente3: "",
    parentescoDependente3: "",
    telefoneDependente3: "",
    dataNascimentoDependente3: "",
    nomeDependente4: "",
    cpfDependente4: "",
    parentescoDependente4: "",
    telefoneDependente4: "",
    dataNascimentoDependente4: "",
    // Endereço e Pagamento
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    estado: "",
    formaDePagamentoNome: "Cartão de Crédito",
    valorEntrada: "",
    formaDePagamentoEntradaNome: "Pix",
    valorParcela: "",
    detalhesParcelamento: "",
    obsPagamento: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const { telefoneTitular, emailTitular, nomeTitular, cpfTitular } =
        formData;

      if (!telefoneTitular || !emailTitular || !nomeTitular || !cpfTitular) {
        alert(
          "Por favor, preencha os campos obrigatórios do Titular (Nome, CPF, Telefone e Email) antes de continuar."
        );
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS_LABELS.length - 1));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  // --- NOVA FUNÇÃO DE ENVIO ---
  const processarEnvio = async (gerarContrato: boolean) => {
    setLoading(true);

    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Sessão expirada! Faça login novamente.");
        router.push("/login");
        return;
      }

      // Prepara o payload com a decisão do contrato
      const payload = {
        ...formData,
        gerarContrato: gerarContrato,
      };

      const { data } = await api.post("/api/vendas/criar-analise", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Feedback baseado na escolha
      if (gerarContrato) {
        if (data.clickSignSucesso === false) {
          // CAIU AQUI: Venda salva, mas contrato deu erro
          toast.warning("Venda salva, mas o contrato falhou!", {
            description: `Motivo: ${data.clickSignErro || "Erro na Clicksign"}`,
            duration: 6000, // Fica mais tempo na tela
          });
        } else {
          // Sucesso total
          toast.success("Venda salva!", {
            description: "O contrato foi enviado para o WhatsApp do cliente.",
            duration: 4000,
          });
        }
      } else {
        toast.success("Venda registrada!", {
          description: "Salvo com sucesso (Contrato manual).",
          duration: 4000,
        });
      }

      // Redireciona
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro ao processar venda.";

      toast.error("Erro ao finalizar", {
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };
  const renderStep = () => {
    const props = { formData, handleChange, setFormData };
    switch (currentStep) {
      case 0:
        return <StepContrato {...props} />;
      case 1:
        return <StepTitular {...props} />;
      case 2:
        return <StepCoTitular {...props} />;
      case 3:
        return <StepDependentes {...props} />;
      case 4:
        return <StepEndereco {...props} />;
      case 5:
        return <StepPagamento {...props} />;
      case 6:
        return <StepRevisao formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Header Fixo */}
      <div className="bg-white shadow-sm sticky top-0 z-10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Nova Venda</h1>
          <div className="text-sm text-gray-500 font-medium">
            Passo {currentStep + 1} de {STEPS_LABELS.length}:{" "}
            <span className="text-blue-600">{STEPS_LABELS[currentStep]}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-1.5 mt-4">
          <div
            className="bg-blue-600 h-1.5 transition-all duration-300 ease-in-out"
            style={{
              width: `${((currentStep + 1) / STEPS_LABELS.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">{renderStep()}</main>

      {/* Footer de Navegação FIXO */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {/* Botão Voltar (Escondido no primeiro passo) */}
          <div className="w-32">
            {currentStep > 0 && (
              <Button
                onClick={handlePrev}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
            )}
          </div>

          {/* Botão Próximo ou Finalizar */}
          <div className="w-auto md:w-auto">
            {currentStep === STEPS_LABELS.length - 1 ? (
              <Button
                onClick={() => {
                  const deveGerar = formData.tipoEnvioContrato === "Digital";
                  processarEnvio(deveGerar);
                }}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 w-full md:w-48"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Finalizar Venda <CheckCircle size={18} />
                  </span>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} className="w-32">
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
