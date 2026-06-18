import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  Map,
  FileText,
  Settings,
  Search,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Shield,
  X
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/shared/components/ui/table";
import { useAuth } from "@/features/auth/hooks/useAuth";
import NavBar from "../components/NavBar";
import { Loader2 } from "lucide-react";

interface Demanda {
  id: string;
  protocolo: string;
  titulo: string;
  categoria: string;
  bairro: string;
  status: "pending" | "in_progress" | "resolved";
  prioridade: "alta" | "media" | "baixa";
  secretaria: string;
  data: string;
}

const demandasMock: Demanda[] = [
  {
    id: "1",
    protocolo: "PFX-2026-0342",
    titulo: "Buraco na Rua das Palmeiras",
    categoria: "Vias",
    bairro: "Centro",
    status: "in_progress",
    prioridade: "alta",
    secretaria: "SEMOP",
    data: "12/06/2026"
  },
  {
    id: "2",
    protocolo: "PFX-2026-0341",
    titulo: "Poste apagado na Av. Brasil",
    categoria: "Iluminação",
    bairro: "Jardim América",
    status: "pending",
    prioridade: "media",
    secretaria: "SEMEL",
    data: "11/06/2026"
  },
  {
    id: "3",
    protocolo: "PFX-2026-0340",
    titulo: "Esgoto a céu aberto na Rua 7",
    categoria: "Saneamento",
    bairro: "Vila Nova",
    status: "resolved",
    prioridade: "alta",
    secretaria: "SAAE",
    data: "08/06/2026"
  },
  {
    id: "4",
    protocolo: "PFX-2026-0339",
    titulo: "Lixo acumulado na praça central",
    categoria: "Limpeza",
    bairro: "Centro",
    status: "resolved",
    prioridade: "baixa",
    secretaria: "SEMLIM",
    data: "05/06/2026"
  },
  {
    id: "5",
    protocolo: "PFX-2026-0338",
    titulo: "Calçada quebrada na escola estadual",
    categoria: "Acessibilidade",
    bairro: "Boa Vista",
    status: "pending",
    prioridade: "alta",
    secretaria: "SEMOP",
    data: "03/06/2026"
  },
  {
    id: "6",
    protocolo: "PFX-2026-0337",
    titulo: "Semáforo com defeito na Av. Central",
    categoria: "Trânsito",
    bairro: "Centro",
    status: "in_progress",
    prioridade: "alta",
    secretaria: "SEMTRAN",
    data: "01/06/2026"
  }
];

const statusConfig = {
  pending: { label: "Pendente", class: "bg-red-500/20 text-red-600", icon: AlertCircle },
  in_progress: { label: "Em andamento", class: "bg-yellow-500/20 text-yellow-600", icon: Clock },
  resolved: { label: "Resolvido", class: "bg-green-500/20 text-green-600", icon: CheckCircle2 }
};

const priorityConfig = {
  alta: { label: "Alta", class: "bg-red-500/20 text-red-600" },
  media: { label: "Média", class: "bg-yellow-500/20 text-yellow-600" },
  baixa: { label: "Baixa", class: "bg-blue-500/20 text-blue-600" }
};

type StatusFilter = "all" | "pending" | "in_progress" | "resolved";
type ActiveTab = "demandas" | "dashboard" | "mapa" | "relatorios" | "configuracoes" | "agenda";

interface AgendaItem {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  tipo: "reuniao" | "vistoria" | "prazo" | "outro";
  concluido: boolean;
}

const GestaoBackoffice = () => {
  const navigate = useNavigate();
  const { user, isManager, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [activeTab, setActiveTab] = useState<ActiveTab>("demandas");
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    { id: "1", titulo: "Vistoria Rua das Palmeiras", data: "20/06/2026", hora: "09:00", tipo: "vistoria", concluido: false },
    { id: "2", titulo: "Reunião SEMOP — prioridades do mês", data: "21/06/2026", hora: "14:00", tipo: "reuniao", concluido: false },
    { id: "3", titulo: "Prazo: resposta demanda PFX-0338", data: "22/06/2026", hora: "17:00", tipo: "prazo", concluido: false },
    { id: "4", titulo: "Revisão calçadas Boa Vista", data: "25/06/2026", hora: "10:00", tipo: "vistoria", concluido: true },
  ]);
  const [novoItem, setNovoItem] = useState({ titulo: "", data: "", hora: "", tipo: "outro" as const });
  const [showForm, setShowForm] = useState(false);

  // Proteção de rota
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
      <div className="glass-card rounded-3xl p-8 max-w-sm text-center shadow-elegant">
        <Shield className="w-10 h-10 mx-auto text-accent mb-3" />
        <h2 className="font-display font-bold text-xl text-foreground">Acesso restrito</h2>
        <p className="text-sm text-muted-foreground mt-2">Faça login para acessar o backoffice da prefeitura.</p>
        <Button onClick={() => navigate("/auth")} className="mt-5 w-full bg-gradient-accent text-accent-foreground font-bold">
          Entrar
        </Button>
      </div>
    </div>
  );

  if (!isManager) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
      <div className="glass-card rounded-3xl p-8 max-w-md text-center shadow-elegant">
        <Shield className="w-10 h-10 mx-auto text-red-500 mb-3" />
        <h2 className="font-display font-bold text-xl text-foreground">Área exclusiva para gestores</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Esta área é exclusiva para gestores municipais. Solicite acesso ao administrador.
        </p>
        <Button onClick={() => navigate("/painel")} variant="outline" className="mt-5">
          Ver painel público
        </Button>
      </div>
    </div>
  );

  const filteredDemandas = useMemo(() => {
    return demandasMock.filter((demanda) => {
      if (statusFilter !== "all" && demanda.status !== statusFilter) {
        return false;
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          demanda.titulo.toLowerCase().includes(term) ||
          demanda.protocolo.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [searchTerm, statusFilter]);

  const totals = {
    total: demandasMock.length,
    pendentes: demandasMock.filter((d) => d.status === "pending").length,
    andamento: demandasMock.filter((d) => d.status === "in_progress").length,
    resolvidas: demandasMock.filter((d) => d.status === "resolved").length
  };

  const menuItems: { icon: typeof LayoutDashboard; label: string; tab: ActiveTab }[] = [
    { icon: LayoutDashboard, label: "Dashboard", tab: "dashboard" },
    { icon: List, label: "Demandas", tab: "demandas" },
    { icon: Map, label: "Mapa", tab: "mapa" },
    { icon: FileText, label: "Relatórios", tab: "relatorios" },
    { icon: Calendar, label: "Agenda", tab: "agenda" },
    { icon: Settings, label: "Configurações", tab: "configuracoes" }
  ];

  const tipoBadgeConfig = {
    reuniao: { label: "Reunião", class: "bg-blue-500/20 text-blue-600" },
    vistoria: { label: "Vistoria", class: "bg-yellow-500/20 text-yellow-600" },
    prazo: { label: "Prazo", class: "bg-red-500/20 text-red-600" },
    outro: { label: "Outro", class: "bg-gray-500/20 text-gray-600" }
  };

  const toggleConcluido = (id: string) => {
    setAgendaItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, concluido: !item.concluido } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setAgendaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addAgendaItem = () => {
    if (novoItem.titulo && novoItem.data && novoItem.hora) {
      const newItem: AgendaItem = {
        id: Date.now().toString(),
        titulo: novoItem.titulo,
        data: novoItem.data,
        hora: novoItem.hora,
        tipo: novoItem.tipo,
        concluido: false
      };
      setAgendaItems((prev) => [...prev, newItem].sort((a, b) => a.data.localeCompare(b.data)));
      setNovoItem({ titulo: "", data: "", hora: "", tipo: "outro" });
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className="w-[220px] min-h-screen hidden md:block"
          style={{ backgroundColor: "#1B3A6B" }}
        >
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <List className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-display text-sm font-bold text-white">FastFix</h1>
                <p className="text-[10px] text-white/70">Gestão de Demandas</p>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 w-[220px] p-4 border-t border-white/10">
            <div className="text-xs text-white/70">
              <p className="font-medium text-white">Logado como:</p>
              <p>João Oliveira — SEMOP</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Header com badge Prefeitura */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#1B3A6B] text-white">
                  🏛️ Prefecture
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {activeTab === "demandas" && "Gestão de Demandas"}
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "mapa" && "Mapa de Demandas"}
                {activeTab === "relatorios" && "Relatórios"}
                {activeTab === "agenda" && "Agenda"}
                {activeTab === "configuracoes" && "Configurações"}
              </h2>
              <p className="text-sm text-muted-foreground">Prefeitura de Marília — Junho 2026</p>
            </div>
            {activeTab === "demandas" && (
              <Link to="/registrar">
                <Button className="bg-gradient-accent text-accent-foreground font-bold">
                  <Plus className="w-4 h-4 mr-2" /> Nova demanda
                </Button>
              </Link>
            )}
          </div>

          {/* Conteúdo baseado na aba ativa */}
          {activeTab === "demandas" && (
            <>
              {/* Cards de resumo */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <List className="w-4 h-4 text-accent" />
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">{totals.total}</p>
                </div>
                <div className="glass-card rounded-xl p-4 border-l-4 border-red-500">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">{totals.pendentes}</p>
                </div>
                <div className="glass-card rounded-xl p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <p className="text-xs text-muted-foreground">Em andamento</p>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">{totals.andamento}</p>
                </div>
                <div className="glass-card rounded-xl p-4 border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-xs text-muted-foreground">Resolvidas</p>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">{totals.resolvidas}</p>
                </div>
              </div>

              {/* Filtros */}
              <div className="glass-card rounded-xl p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por título ou protocolo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={statusFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("all")}
                    >
                      Todas
                    </Button>
                    <Button
                      variant={statusFilter === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("pending")}
                      className={statusFilter === "pending" ? "bg-red-500 text-white" : ""}
                    >
                      Pendente
                    </Button>
                    <Button
                      variant={statusFilter === "in_progress" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("in_progress")}
                      className={statusFilter === "in_progress" ? "bg-yellow-500 text-white" : ""}
                    >
                      Em andamento
                    </Button>
                    <Button
                      variant={statusFilter === "resolved" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("resolved")}
                      className={statusFilter === "resolved" ? "bg-green-500 text-white" : ""}
                    >
                      Resolvido
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabela */}
              <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-bold text-muted-foreground">Protocolo</TableHead>
                      <TableHead className="text-xs font-bold text-muted-foreground">Título</TableHead>
                      <TableHead className="text-xs font-bold text-muted-foreground">Categoria</TableHead>
                      <TableHead className="text-xs font-bold text-muted-foreground">Bairro</TableHead>
                      <TableHead className="text-xs font-bold text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-bold text-muted-foreground">Prioridade</TableHead>
                      <TableHead className="text-xs font-bold text-muted-foreground">Secretaria</TableHead>
                      <TableHead className="text-xs font-bold text-muted-foreground">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDemandas.map((demanda) => {
                      const StatusIcon = statusConfig[demanda.status].icon;
                      return (
                        <TableRow key={demanda.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs font-medium">
                            {demanda.protocolo}
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {demanda.titulo}
                          </TableCell>
                          <TableCell className="text-xs">
                            {demanda.categoria}
                          </TableCell>
                          <TableCell className="text-xs">
                            {demanda.bairro}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${statusConfig[demanda.status].class}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[demanda.status].label}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${priorityConfig[demanda.prioridade].class}`}>
                              {demanda.prioridade.charAt(0).toUpperCase() + demanda.prioridade.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs">
                            {demanda.secretaria}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {demanda.data}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Total: {filteredDemandas.length} demanda(s)
              </p>
            </>
          )}

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Gráfico de barras verticais - Demandas por mês */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">Demandas por mês</h3>
                <div className="flex items-end justify-around h-48 gap-4">
                  {[
                    { month: "Abr", value: 155 },
                    { month: "Mai", value: 142 },
                    { month: "Jun", value: 179 }
                  ].map((item) => (
                    <div key={item.month} className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 bg-[#1B3A6B] rounded-t-lg transition-all"
                        style={{ height: `${(item.value / 180) * 100}%` }}
                      />
                      <span className="text-sm text-muted-foreground">{item.month}</span>
                      <span className="text-xs font-bold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Taxa de resolução por categoria */}
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-display text-lg font-bold text-foreground mb-4">Taxa de resolução por categoria</h3>
                  <div className="space-y-4">
                    {[
                      { category: "Vias", value: 52 },
                      { category: "Iluminação", value: 43 },
                      { category: "Saneamento", value: 20 },
                      { category: "Limpeza", value: 21 }
                    ].map((item) => (
                      <div key={item.category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.category}</span>
                          <span className="font-bold text-foreground">{item.value}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1B3A6B] rounded-full"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totais */}
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-display text-lg font-bold text-foreground mb-4">Totais</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-3xl font-bold text-foreground">{totals.total}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-lg">
                      <p className="text-3xl font-bold text-red-600">{totals.pendentes}</p>
                      <p className="text-xs text-muted-foreground">Pendentes</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                      <p className="text-3xl font-bold text-yellow-600">{totals.andamento}</p>
                      <p className="text-xs text-muted-foreground">Em andamento</p>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">{totals.resolvidas}</p>
                      <p className="text-xs text-muted-foreground">Resolvidas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tempo médio de resolução */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-center gap-3">
                  <Clock className="w-8 h-8 text-[#1B3A6B]" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">4,2 dias</p>
                    <p className="text-sm text-muted-foreground">Tempo médio de resolução</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mapa" && (
            <div className="space-y-6">
              {/* Card de visualização de mapa */}
              <div
                className="rounded-xl p-12 flex flex-col items-center justify-center gap-4"
                style={{ backgroundColor: "#1B3A6B" }}
              >
                <Map className="w-16 h-16 text-white" />
                <p className="text-white text-lg font-medium">Visualização de mapa em breve</p>
              </div>

              {/* Lista de demandas */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {demandasMock.map((demanda) => (
                  <div key={demanda.id} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-muted-foreground">{demanda.protocolo}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${statusConfig[demanda.status].class}`}>
                        {statusConfig[demanda.status].label}
                      </span>
                    </div>
                    <p className="font-medium text-foreground mb-1">{demanda.titulo}</p>
                    <p className="text-sm text-muted-foreground">{demanda.bairro}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "relatorios" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Relatório Mensal */}
                <div className="glass-card rounded-xl p-6">
                  <FileText className="w-10 h-10 text-[#1B3A6B] mb-4" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">Relatório Mensal</h3>
                  <p className="text-sm text-muted-foreground mb-4">Junho 2026</p>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>• 179 demandas registradas</p>
                    <p>• 47 resolvidas (26%)</p>
                    <p>• Tempo médio: 4,2 dias</p>
                  </div>
                  <Button className="w-full bg-[#1B3A6B] text-white">
                    Baixar PDF
                  </Button>
                </div>

                {/* Relatório por Secretaria */}
                <div className="glass-card rounded-xl p-6">
                  <FileText className="w-10 h-10 text-[#1B3A6B] mb-4" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">Relatório por Secretaria</h3>
                  <p className="text-sm text-muted-foreground mb-4">Por departamento</p>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>• SEMOP: 42 demandas</p>
                    <p>• SEMEL: 38 demandas</p>
                    <p>• SAAE: 31 demandas</p>
                  </div>
                  <Button className="w-full bg-[#1B3A6B] text-white">
                    Baixar PDF
                  </Button>
                </div>

                {/* Relatório de Desempenho */}
                <div className="glass-card rounded-xl p-6">
                  <FileText className="w-10 h-10 text-[#1B3A6B] mb-4" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">Relatório de Desempenho</h3>
                  <p className="text-sm text-muted-foreground mb-4">Métricas gerais</p>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>• Taxa resolução: 32%</p>
                    <p>• Satisfação: 4.1/5</p>
                    <p>• Ranking: #3 regional</p>
                  </div>
                  <Button className="w-full bg-[#1B3A6B] text-white">
                    Baixar PDF
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "configuracoes" && (
            <div className="max-w-xl">
              <div className="glass-card rounded-xl p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Nome do gestor</label>
                    <Input defaultValue="João Oliveira" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Secretaria</label>
                    <Input defaultValue="SEMOP" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">E-mail</label>
                    <Input defaultValue="joao.oliveira@prefeitura.gov.br" type="email" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Notificações</p>
                      <p className="text-sm text-muted-foreground">Receber alertas por e-mail</p>
                    </div>
                    <button
                      onClick={() => setNotificacoesAtivas(!notificacoesAtivas)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        notificacoesAtivas ? "bg-[#1B3A6B]" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                          notificacoesAtivas ? "right-1" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                  <Button className="w-full bg-[#1B3A6B] text-white">
                    Salvar alterações
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "agenda" && (
            <div className="space-y-6">
              {/* Header da agenda com botão */}
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-foreground">Próximos compromissos</h3>
                <Button onClick={() => setShowForm(true)} className="bg-[#1B3A6B] text-white">
                  <Plus className="w-4 h-4 mr-2" /> Novo item
                </Button>
              </div>

              {/* Formulário para adicionar novo item */}
              {showForm && (
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-foreground">Novo compromisso</h4>
                    <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Título</label>
                      <Input
                        value={novoItem.titulo}
                        onChange={(e) => setNovoItem({ ...novoItem, titulo: e.target.value })}
                        placeholder="Título do compromisso"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
                      <select
                        value={novoItem.tipo}
                        onChange={(e) => setNovoItem({ ...novoItem, tipo: e.target.value as AgendaItem["tipo"] })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="reuniao">Reunião</option>
                        <option value="vistoria">Vistoria</option>
                        <option value="prazo">Prazo</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Data</label>
                      <Input
                        type="text"
                        value={novoItem.data}
                        onChange={(e) => setNovoItem({ ...novoItem, data: e.target.value })}
                        placeholder="DD/MM/AAAA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Hora</label>
                      <Input
                        type="text"
                        value={novoItem.hora}
                        onChange={(e) => setNovoItem({ ...novoItem, hora: e.target.value })}
                        placeholder="HH:MM"
                      />
                    </div>
                  </div>
                  <Button onClick={addAgendaItem} className="w-full bg-[#1B3A6B] text-white">
                    Adicionar
                  </Button>
                </div>
              )}

              {/* Lista de itens da agenda */}
              <div className="space-y-3">
                {agendaItems.map((item) => {
                  const TipoBadge = tipoBadgeConfig[item.tipo];
                  return (
                    <div
                      key={item.id}
                      className={`glass-card rounded-xl p-4 flex items-center gap-4 ${
                        item.concluido ? "opacity-60" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.concluido}
                        onChange={() => toggleConcluido(item.id)}
                        className="w-5 h-5 rounded border-2 border-[#1B3A6B] accent-[#1B3A6B]"
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${item.concluido ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {item.titulo}
                        </p>
                        <p className="text-sm text-muted-foreground">{item.data} às {item.hora}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${TipoBadge.class}`}>
                        {TipoBadge.label}
                      </span>
                      <span className="text-sm text-muted-foreground font-mono">{item.hora}</span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GestaoBackoffice;