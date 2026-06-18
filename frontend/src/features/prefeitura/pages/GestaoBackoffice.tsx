import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
  CheckCircle2
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
import NavBar from "../components/NavBar";

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

const GestaoBackoffice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

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

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false },
    { icon: List, label: "Demandas", active: true },
    { icon: Map, label: "Mapa", active: false },
    { icon: FileText, label: "Relatórios", active: false },
    { icon: Settings, label: "Configurações", active: false }
  ];

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
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active
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
                  🏛️ Prefeitura
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Gestão de Demandas</h2>
              <p className="text-sm text-muted-foreground">Prefeitura de Marília — Junho 2026</p>
            </div>
            <Link to="/registrar">
              <Button className="bg-gradient-accent text-accent-foreground font-bold">
                <Plus className="w-4 h-4 mr-2" /> Nova demanda
              </Button>
            </Link>
          </div>

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
        </main>
      </div>
    </div>
  );
};

export default GestaoBackoffice;