"use client";

import React, { useMemo } from "react";
import { Filter, CalendarDays } from "lucide-react";

// 1. ATUALIZAÇÃO DA INTERFACE: Adicionamos as datas opcionais
interface AnalyticsFiltersProps {
  filtros: {
    mes: number;
    ano: number;
    tipo_venda: string;
    id_vendedor: string;
    data_inicial?: string; // Novo
    data_final?: string; // Novo
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
  const handleChange = (field: string, value: any) => {
    setFiltros((prev: any) => ({ ...prev, [field]: value }));
  };

  // ✅ ANOS DINÂMICOS: de 2024 até ano atual + 1 (ex.: já inclui 2026)
  const anos = useMemo(() => {
    const base = 2024;
    const anoAtual = new Date().getFullYear();
    const max = anoAtual + 1; // inclui próximo ano
    const arr: number[] = [];
    for (let a = max; a >= base; a--) arr.push(a); // desc
    return arr;
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col gap-4">
      {/* LINHA 1: FILTROS PRINCIPAIS (Mês/Ano/Vendedor) */}
      <div className="flex flex-col md:flex-row gap-3 w-full justify-between items-end">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* MÊS */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Mês
            </label>
            <select
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 outline-none focus:border-blue-500 disabled:opacity-50"
              value={filtros.mes}
              // Se tiver data específica selecionada, desabilitamos o mês pra não confundir
              disabled={!!filtros.data_inicial || !!filtros.data_final}
              onChange={(e) => handleChange("mes", Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          {/* ANO ✅ (DINÂMICO) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Ano
            </label>
            <select
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 outline-none focus:border-blue-500 disabled:opacity-50"
              value={filtros.ano}
              disabled={!!filtros.data_inicial || !!filtros.data_final}
              onChange={(e) => handleChange("ano", Number(e.target.value))}
            >
              {anos.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* CANAL */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Canal
            </label>
            <select
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 outline-none focus:border-blue-500"
              value={filtros.tipo_venda}
              onChange={(e) => handleChange("tipo_venda", e.target.value)}
            >
              <option value="TODOS">Todos</option>
              <option value="ONLINE">Online</option>
              <option value="PRESENCIAL">Presencial</option>
            </select>
          </div>

          {/* VENDEDOR */}
          <div className="flex flex-col gap-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Vendedor
            </label>
            <select
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 outline-none focus:border-blue-500 disabled:opacity-50"
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

        {/* LABEL DE STATUS (Direita) */}
        <div className="text-xs text-gray-400  items-center gap-1  md:flex mb-2">
          <Filter size={14} />
          {filtros.data_inicial
            ? "Filtrando por período exato"
            : "Filtrando por mês de competência"}
        </div>
      </div>

      {/* LINHA 2: FILTROS DE DATA ESPECÍFICA (Opcional) */}
      <div className="pt-3 border-t border-gray-100 flex flex-col md:flex-row gap-3 items-center">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
          <CalendarDays size={14} />
          <span>Filtro por Data (Opcional):</span>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="date"
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={filtros.data_inicial || ""}
            onChange={(e) => handleChange("data_inicial", e.target.value)}
          />
          <span className="self-center text-gray-400">-</span>
          <input
            type="date"
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={filtros.data_final || ""}
            onChange={(e) => handleChange("data_final", e.target.value)}
          />

          {/* Botão para limpar datas se estiverem selecionadas */}
          {(filtros.data_inicial || filtros.data_final) && (
            <button
              onClick={() => {
                handleChange("data_inicial", "");
                handleChange("data_final", "");
              }}
              className="text-xs text-red-500 hover:text-red-700 font-medium px-2"
            >
              Limpar datas
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
