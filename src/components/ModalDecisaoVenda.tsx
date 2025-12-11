"use client";

import { useRouter } from "next/navigation"; // <--- Importamos o router
import { X, FileSignature, Save, Loader2 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (gerarContrato: boolean) => void;
  loading: boolean;
}

export function ModalDecisaoVenda({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: ModalProps) {
  const router = useRouter(); // <--- Instanciamos o router

  if (!isOpen) return null;

  // Função que manda o usuário de volta pra casa
  function handleCancelar() {
    // Primeiro fecha o modal visualmente (opcional, mas boa prática)
    onClose();
    // Redireciona para o dashboard
    router.push("/dashboard");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            Metodo de Assinatura
          </h3>
          <button
            onClick={handleCancelar} // <--- Agora volta pro Dashboard
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-6 text-center">
            Como você deseja processar esta venda?
          </p>

          <div className="space-y-3">
            {/* OPÇÃO 1: COM CLICKSIGN (WhatsApp) */}
            <button
              onClick={() => onConfirm(true)}
              disabled={loading}
              className="w-full group relative flex items-center p-4 border-2 border-green-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left"
            >
              <div className="bg-green-100 p-3 rounded-full mr-4 group-hover:bg-green-200 transition-colors">
                <FileSignature className="text-green-600 h-6 w-6" />
              </div>
              <div>
                <span className="block font-bold text-green-900">
                  Gerar Contrato Digital
                </span>
                <span className="text-xs text-green-700">
                  Envia link para WhatsApp (ClickSign)
                </span>
              </div>
              {loading && (
                <div className="absolute right-4">
                  <Loader2 className="animate-spin text-green-600" />
                </div>
              )}
            </button>

            {/* OPÇÃO 2: APENAS SALVAR (Sem contrato) */}
            <button
              onClick={() => onConfirm(false)}
              disabled={loading}
              className="w-full group flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <div className="bg-gray-100 p-3 rounded-full mr-4 group-hover:bg-blue-200 transition-colors">
                <Save className="text-gray-600 h-6 w-6 group-hover:text-blue-600" />
              </div>
              <div>
                <span className="block font-bold text-gray-800">
                  Apenas Registrar
                </span>
                <span className="text-xs text-gray-500">
                  Salva no sistema sem gerar contrato
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center">
          <button
            onClick={handleCancelar} // <--- Agora volta pro Dashboard
            disabled={loading}
            className="text-xs text-gray-400 hover:text-red-500 hover:underline transition-colors"
          >
            Cancelar e voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
