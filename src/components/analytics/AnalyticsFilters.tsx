import { Filter } from "lucide-react";

// 1. Tipagem das Props: Define o que esse componente espera receber
interface AnalyticsFiltersProps {
  filtros: {
    mes: number;
    ano: number;
    tipo_venda: string;
    id_vendedor: string;
  };
  setFiltros: React.Dispatch<React.SetStateAction<any>>;
  listaVendedores: Array<{
    id_vendedor: string | number;
    nome_completo: string;
  }>;
}

export function AnalyticsFilters({
  filtros,
  setFiltros,
  listaVendedores,
}: AnalyticsFiltersProps) {
  // Helper para atualizar o estado sem repetir código
  // Ele recebe a chave (ex: 'mes') e o valor (ex: 10)
  const handleChange = (field: string, value: any) => {
    setFiltros((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
      {/* Container dos Selects */}
      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        {/* FILTRO: MÊS */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">
            Mês
          </label>
          <select
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={filtros.mes}
            onChange={(e) => handleChange("mes", Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        {/* FILTRO: ANO */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">
            Ano
          </label>
          <select
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={filtros.ano}
            onChange={(e) => handleChange("ano", Number(e.target.value))}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        {/* FILTRO: TIPO DE VENDA */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">
            Canal
          </label>
          <select
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={filtros.tipo_venda}
            onChange={(e) => handleChange("tipo_venda", e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="ONLINE">Online</option>
            <option value="PRESENCIAL">Presencial</option>
          </select>
        </div>

        {/* FILTRO: VENDEDOR (Dinâmico) */}
        <div className="flex flex-col gap-1 min-w-[200px]">
          <label className="text-xs font-bold text-gray-400 uppercase">
            Vendedor
          </label>
          <select
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50"
            value={filtros.id_vendedor}
            onChange={(e) => handleChange("id_vendedor", e.target.value)}
            disabled={!listaVendedores || listaVendedores.length === 0}
          >
            <option value="TODOS">Todos da equipe</option>
            {listaVendedores?.map((v) => (
              <option
                key={`${v.id_vendedor}-${v.nome_completo}`}
                value={v.id_vendedor}
              >
                {v.nome_completo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Indicador Visual (Lado direito) */}
      <div className="text-xs text-gray-400 flex items-center gap-1 hidden md:flex">
        <Filter size={14} /> Filtrando resultados
      </div>
    </div>
  );
}
