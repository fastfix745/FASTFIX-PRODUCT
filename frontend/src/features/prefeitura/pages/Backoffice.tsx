import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapIcon,
  Shield,
  Search,
  Filter,
  ArrowLeft,
  LogIn,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2,
  Lightbulb,
  Droplets,
  Trash2
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/shared/components/ui/table";
import { demandasMock, Demanda, secretarias } from "../data/mockData";

// Mapeamento de status para cores e labels
const statusConfig = {
  pending: { label: "Pendente", class: "bg-severity-high/20 text-severity-high", icon: AlertCircle },
  in_progress: { label: "Em Andamento", class: "bg-severity-medium/20 text-severity-medium", icon: Clock },
  resolved: { label: "Resolvido", class: "bg-severity-low/20 text-severity-low", icon: CheckCircle2 }
};

// Mapeamento de prioridade
const priorityConfig = {
  alta: { label: "Alta", class: "bg-severity-high/20 text-severity-high" },
  media: { label: "Média", class: "bg-severity-medium/20 text-severity-medium" },
  baixa: { label: "Baixa", class: "bg-severity-low/20 text-severity-low" }
};

// Mapeamento de categorias
const categoryLabels: Record<string, string> = {
  vias: "Vias/Buracos",
  iluminacao: "Iluminação",
  saneamento: "Saneamento",
  limpeza: "Limpeza Urbana",
  outros: "Outros"
};

type Secretaria = "obras" | "iluminacao" | "saneamento" | "limpeza" | "geral" | "todas";
type StatusFilter = "all" | "pending" | "in_progress" | "resolved";

const Backoffice = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Filtros
  const [selectedSecretaria, setSelectedSecretaria] = useState<Secretaria>("todas");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchProtocol, setSearchProtocol] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Login mockado simples
    if (username === "admin" && password === "1234") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Usuário ou senha incorretos");
    }
  };

  // Filtrar demandas
  const filteredDemandas = useMemo(() => {
    return demandasMock.filter((demanda) => {
      // Filtro por secretaria
      if (selectedSecretaria !== "todas" && demanda.secretaria !== selectedSecretaria) {
        return false;
      }
      // Filtro por status
      if (statusFilter !== "all" && demanda.status !== statusFilter) {
        return false;
      }
      // Filtro por protocolo
      if (searchProtocol && !demanda.protocolo.toLowerCase().includes(searchProtocol.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [selectedSecretaria, statusFilter, searchProtocol]);

  // Calcular totais
  const totals = useMemo(() => {
    return {
      pending: demandasMock.filter((d) => d.status === "pending").length,
      inProgress: demandasMock.filter((d) => d.status === "in_progress").length,
      resolved: demandasMock.filter((d) => d.status === "resolved").length
    };
  }, []);

  const getSecretariaBadge = (secretaria: string) => {
    const sec = secretarias.find((s) => s.id === secretaria);
    return sec ? (
      <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${sec.cor}`}>
        {sec.nome}
      </span>
    ) : null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  };

  // Tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-sm w-full shadow-elegant">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-3">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Acesso Restrito</h2>
            <p className="text-sm text-muted-foreground mt-2">Painel da Prefeitura</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Usuário</label>
              <Input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Senha</label>
              <Input
                type="password"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
              />
            </div>

            {loginError && (
              <p className="text-xs text-destructive text-center">{loginError}</p>
            )}

            <Button type="submit" className="w-full bg-gradient-accent text-accent-foreground font-bold">
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </Button>
          </form>

          <Link
            to="/prefeitura"
            className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Painel
          </Link>
        </div>
      </div>
    );
  }

  // Tela principal do backoffice
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground hidden md:flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/prefeitura" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center">
              <MapIcon className="w-4 h-4 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold">FastFix</h1>
              <p className="text-[10px] opacity-75">Backoffice</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setSelectedSecretaria("todas")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${selectedSecretaria === "todas" ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            <Building2 className="w-4 h-4" />
            Todas
          </button>
          <button
            onClick={() => setSelectedSecretaria("obras")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${selectedSecretaria === "obras" ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            <Building2 className="w-4 h-4" />
            Obras
          </button>
          <button
            onClick={() => setSelectedSecretaria("iluminacao")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${selectedSecretaria === "iluminacao" ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            <Lightbulb className="w-4 h-4" />
            Iluminação
          </button>
          <button
            onClick={() => setSelectedSecretaria("saneamento")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${selectedSecretaria === "saneamento" ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            <Droplets className="w-4 h-4" />
            Saneamento
          </button>
          <button
            onClick={() => setSelectedSecretaria("limpeza")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${selectedSecretaria === "limpeza" ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            <Trash2 className="w-4 h-4" />
            Limpeza
          </button>
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Link
            to="/prefeitura"
            className="flex items-center gap-2 text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Painel de Demandas</h2>
            <p className="text-sm text-muted-foreground">Gerencie as demandas da cidade</p>
          </div>
          <Link to="/prefeitura/registrar">
            <Button className="bg-gradient-accent text-accent-foreground font-bold">
              Nova Demanda
            </Button>
          </Link>
        </div>

        {/* Cards de totais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass-card rounded-xl p-4 border-l-4 border-severity-high">
            <p className="text-xs text-muted-foreground mb-1">Pendente</p>
            <p className="font-display text-2xl font-bold text-foreground">{totals.pending}</p>
          </div>
          <div className="glass-card rounded-xl p-4 border-l-4 border-severity-medium">
            <p className="text-xs text-muted-foreground mb-1">Em Andamento</p>
            <p className="font-display text-2xl font-bold text-foreground">{totals.inProgress}</p>
          </div>
          <div className="glass-card rounded-xl p-4 border-l-4 border-severity-low">
            <p className="text-xs text-muted-foreground mb-1">Resolvido</p>
            <p className="font-display text-2xl font-bold text-foreground">{totals.resolved}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="glass-card rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por protocolo..."
                value={searchProtocol}
                onChange={(e) => setSearchProtocol(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
                className={statusFilter === "pending" ? "bg-severity-high text-white" : ""}
              >
                Pendente
              </Button>
              <Button
                variant={statusFilter === "in_progress" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("in_progress")}
                className={statusFilter === "in_progress" ? "bg-severity-medium text-white" : ""}
              >
                Andamento
              </Button>
              <Button
                variant={statusFilter === "resolved" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("resolved")}
                className={statusFilter === "resolved" ? "bg-severity-low text-white" : ""}
              >
                Resolvido
              </Button>
            </div>
          </div>
        </div>

        {/* Tabela de demandas */}
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-bold text-muted-foreground">Protocolo</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground">Descrição</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground">Categoria</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground">Prioridade</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground">Secretaria</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDemandas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma demanda encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredDemandas.map((demanda) => {
                  const StatusIcon = statusConfig[demanda.status].icon;
                  return (
                    <TableRow key={demanda.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs font-medium">
                        {demanda.protocolo}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-foreground truncate">{demanda.titulo}</p>
                        <p className="text-xs text-muted-foreground truncate">{demanda.endereco}</p>
                      </TableCell>
                      <TableCell className="text-xs">
                        {categoryLabels[demanda.categoria]}
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
                      <TableCell>
                        {getSecretariaBadge(demanda.secretaria)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(demanda.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer info */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Total: {filteredDemandas.length} demanda(s) • Dados mockados para demonstração
        </p>
      </main>
    </div>
  );
};

export default Backoffice;