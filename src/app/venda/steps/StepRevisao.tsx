import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { VendaFormData } from "../types";
import { CheckCircle, AlertTriangle } from "lucide-react";

export function StepRevisao({ formData }: { formData: VendaFormData }) {
  const { user } = useAuth();

  const formatCurrency = (value: string | number) => {
    const number = Number(value || 0);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(number);
  };

  const formatDate = (dateString: string | number) => {
    if (!dateString) return "Não informado";
    const [year, month, day] = String(dateString).split("-");
    return `${day}/${month}/${year}`;
  };

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 last:border-0">
      {/* MUDANÇA AQUI: text-gray-900 */}
      <span className="text-sm font-bold text-gray-900">{label}:</span>
      {/* O valor pode ficar um pouco mais suave (gray-800) ou preto também */}
      <span className="text-sm text-gray-800 text-right font-medium">
        {value || "---"}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 flex items-start gap-3">
        <AlertTriangle className="text-yellow-600 h-5 w-5 mt-0.5" />
        <div>
          <h4 className="font-bold text-yellow-800 text-sm">
            Atenção, {user?.nome || "Vendedor"}
          </h4>
          <p className="text-yellow-700 text-xs mt-1">
            Confira todos os dados abaixo antes de finalizar.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* --- CONTRATO --- */}
        <Card>
          <CardHeader title="Dados do Contrato" />
          <div className="px-2">
            <InfoRow label="Agente" value={user?.nome} />
            <InfoRow label="Nº Contrato" value={formData.numeroContrato} />
            <InfoRow label="Plano" value={formData.tipoContratoNome} />
            <InfoRow
              label="Valor Total"
              value={formatCurrency(formData.valorTotalPlano)}
            />
            <InfoRow label="Tipo da Venda" value={formData.tipoVenda} />
          </div>
        </Card>

        {/* --- TITULAR --- */}
        <Card>
          <CardHeader title="Dados do Titular" />
          <div className="px-2">
            <InfoRow label="Nome" value={formData.nomeTitular} />
            <InfoRow label="CPF" value={formData.cpfTitular} />
            <InfoRow label="RG" value={formData.rgTitular} />
            <InfoRow
              label="Nascimento"
              value={formatDate(formData.dataNascimentoTitular)}
            />
            <InfoRow label="Telefone" value={formData.telefoneTitular} />
            <InfoRow label="Email" value={formData.emailTitular} />
            <InfoRow label="Sexo" value={formData.sexoTitular} />
            <InfoRow label="Profissão" value={formData.profissaoTitular} />
            <InfoRow label="Estado Civil" value={formData.estadoCivilTitular} />
          </div>
        </Card>

        {/* --- CO-TITULAR --- */}
        {formData.nomeCoTitular && (
          <Card>
            <CardHeader title="Dados do Co-Titular" />
            <div className="px-2">
              <InfoRow label="Nome" value={formData.nomeCoTitular} />
              <InfoRow label="CPF" value={formData.cpfCoTitular} />
              <InfoRow label="Telefone" value={formData.telefoneCoTitular} />
              <InfoRow label="Sexo" value={formData.sexoCoTitular} />
            </div>
          </Card>
        )}

        {/* --- DEPENDENTES (LOOP CORRIGIDO) --- */}
        {[1, 2, 3, 4].map((i) => {
          const nome = formData[`nomeDependente${i}`];
          if (!nome) return null; // Se não tem nome, não exibe o card

          return (
            <Card key={i} className="border-l-4 border-l-blue-400">
              <CardHeader title={`Dependente ${i}`} />
              <div className="px-2">
                <InfoRow label="Nome" value={nome} />
                <InfoRow label="CPF" value={formData[`cpfDependente${i}`]} />
                <InfoRow
                  label="Parentesco"
                  value={formData[`parentescoDependente${i}`]}
                />
                <InfoRow
                  label="Nascimento"
                  value={formatDate(formData[`dataNascimentoDependente${i}`])}
                />
                <InfoRow
                  label="Telefone"
                  value={formData[`telefoneDependente${i}`]}
                />
              </div>
            </Card>
          );
        })}

        {/* --- ENDEREÇO --- */}
        <Card>
          <CardHeader title="Endereço" />
          <div className="px-2">
            <InfoRow label="CEP" value={formData.cep} />
            <InfoRow label="Rua" value={formData.rua} />
            <InfoRow label="Bairro" value={formData.bairro} />
            <InfoRow
              label="Cidade / UF"
              value={`${formData.cidade} / ${formData.estado}`}
            />
          </div>
        </Card>

        {/* --- FINANCEIRO --- */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader title="Dados Financeiros" />
          <div className="px-2">
            <div className="mb-4">
              <h4 className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">
                Entrada
              </h4>
              <InfoRow
                label="Valor"
                value={formatCurrency(formData.valorEntrada)}
              />
              <InfoRow
                label="Forma Pagamento"
                value={formData.formaDePagamentoEntradaNome}
              />
              <InfoRow label="Detalhes" value={formData.valorParcela} />
            </div>

            <hr className="my-3 border-gray-100" />

            <div>
              <h4 className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">
                Plano
              </h4>
              <InfoRow
                label="Forma Pagamento"
                value={formData.formaDePagamentoNome}
              />
              <InfoRow label="Detalhes" value={formData.detalhesParcelamento} />
            </div>

            {formData.obsPagamento && (
              <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-xs font-bold text-gray-900 mb-1">
                  Observações:
                </span>
                <p className="text-sm text-gray-800 italic">
                  {formData.obsPagamento}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center mt-6">
        <CheckCircle className="mx-auto text-green-600 h-12 w-12 mb-2" />
        <h2 className="text-xl font-bold text-green-800">Tudo pronto!</h2>
        <p className="text-green-700 text-sm">
          Se estiver tudo certo, clique em "Finalizar Venda" abaixo.
        </p>
      </div>
    </div>
  );
}
