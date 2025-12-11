export interface VendaFormData {
  // --- Contrato ---
  numeroContrato: string;
  tipoContratoNome: string;
  valorTotalPlano: string;
  tipoVenda: string;

  // --- Titular ---
  nomeTitular: string;
  cpfTitular: string;
  rgTitular: string;
  sexoTitular: string;
  dataNascimentoTitular: string;
  telefoneTitular: string;
  estadoCivilTitular: string;
  profissaoTitular: string;
  emailTitular: string;

  // --- Co-Titular ---
  nomeCoTitular: string;
  cpfCoTitular: string;
  rgCoTitular: string;
  sexoCoTitular: string;
  dataNascimentoCoTitular: string;
  telefoneCoTitular: string;
  emailCoTitular: string;
  profissaoCoTitular: string;

  // --- Endereço ---
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;

  // --- Financeiro ---
  valorEntrada: string;
  formaDePagamentoEntradaNome: string;
  valorParcela: string; // Usado para "Detalhes da Entrada" no seu legacy
  formaDePagamentoNome: string; // Pagamento do Plano
  detalhesParcelamento: string;
  obsPagamento: string;

  // --- Dependentes (Dinâmico) ---
  [key: string]: string | number;
}

export interface StepProps {
  formData: VendaFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<VendaFormData>>; // Obrigatório agora para o CEP e Mascaras
}
