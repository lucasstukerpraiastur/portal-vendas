import { useState, useEffect, useCallback } from "react";
import api from "@/service/api";
import { useAuth } from "@/context/AuthContext";

export function useAnalytics() {
  const { user } = useAuth();

  // Estados de Dados
  const [metricas, setMetricas] = useState<any>(null);
  const [historicoVendas, setHistoricoVendas] = useState<any[]>([]);
  const [listaVendedores, setListaVendedores] = useState<any[]>([]);
  const [supervisores, setSupervisores] = useState<any[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"vendas" | "convites">("vendas");

  // Filtros
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [filtros, setFiltros] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    tipo_venda: "TODOS",
    id_vendedor: "TODOS",
  });

  // --- ACTIONS ---

  const carregarListaVendedores = useCallback(async (supId?: string) => {
    try {
      const params = { params: { supervisor_id: supId } };
      // Ajuste a rota conforme seu backend
      const res = await api.get("/api/dashboard/vendedores-lista", params);
      setListaVendedores(res.data);
    } catch (error) {
      console.error("Erro ao buscar vendedores", error);
    }
  }, []);

  const carregarSupervisores = useCallback(async () => {
    try {
      const res = await api.get("/api/dashboard/supervisores");
      setSupervisores(res.data);
    } catch (error) {
      console.error("Erro supervisores", error);
    }
  }, []);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      // Lógica de privilégio: Se Admin selecionou supervisor, usa ele. Se não, usa o próprio user.
      const supId =
        selectedSupervisor ||
        (user?.role === "SUPERVISOR" ? user.sub : undefined);

      const requestParams = {
        supervisor_id: supId,
        mes: filtros.mes,
        ano: filtros.ano,
        tipo_venda: filtros.tipo_venda,
        id_vendedor_filtro: filtros.id_vendedor,
      };
      console.log("🔍 [FRONT] Enviando params:", requestParams);
      const [resMetricas, resHist] = await Promise.all([
        api.get("/api/dashboard/metricas", { params: requestParams }),
        api.get("/api/dashboard/vendas", { params: requestParams }),
      ]);

      setMetricas(resMetricas.data);
      setHistoricoVendas(resHist.data);
    } catch (error) {
      console.error("Erro dashboard", error);
    } finally {
      setLoading(false);
    }
  }, [filtros, selectedSupervisor, user]);

  // --- EFEITOS ---

  // 1. Inicialização
  useEffect(() => {
    if (user?.role === "ADMIN") {
      carregarSupervisores();
    } else if (user) {
      carregarListaVendedores();
    }
  }, [user, carregarSupervisores, carregarListaVendedores]);

  // 2. Quando Admin troca supervisor
  useEffect(() => {
    if (selectedSupervisor) {
      carregarListaVendedores(selectedSupervisor);
      setFiltros((prev) => ({ ...prev, id_vendedor: "TODOS" }));
    }
  }, [selectedSupervisor, carregarListaVendedores]);

  // 3. Atualização de dados (reage a filtros, user ou supervisor)
  useEffect(() => {
    if (user) carregarDados();
  }, [carregarDados]);

  return {
    user,
    // Dados
    metricas,
    historicoVendas,
    listaVendedores,
    supervisores,
    // UI States
    loading,
    activeTab,
    setActiveTab,
    // Filtros
    filtros,
    setFiltros,
    selectedSupervisor,
    setSelectedSupervisor,
  };
}
