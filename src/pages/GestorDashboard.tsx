import { useState } from "react";
import {
  BarChart3, CheckCircle2, Clock, AlertTriangle, Users, MapPin,
  Search, ArrowUpDown, Eye, MessageSquare,
  TrendingUp, Flame, Shield, Bell
} from "lucide-react";
import { useProblems, useUpdateStatus, Problem } from "@/hooks/useProblems";
import { categoryConfig, severityConfig, statusConfig, Status, formatDateBR, formatDateTimeBR } from "@/lib/problems";
import { Button } from "@/components/ui/button";

const GestorDashboard = () => {
  const { data: problems = [], isLoading } = useProblems();
  const updateStatus = useUpdateStatus();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = problems.filter((p) => {
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (id: string, newStatus: Status) => {
    updateStatus.mutate({ id, status: newStatus });
    if (selectedProblem?.id === id) {
      setSelectedProblem((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const totalProblems = problems.length;
  const pending = problems.filter((p) => p.status === "pending").length;
  const inProgress = problems.filter((p) => p.status === "in_progress").length;
  const resolved = problems.filter((p) => p.status === "resolved").length;
  const avgUpvotes = totalProblems > 0 ? Math.round(problems.reduce((sum, p) => sum + p.upvotes, 0) / totalProblems) : 0;

  const stats = [
    { label: "Reportes Abertos", value: pending, icon: AlertTriangle, color: "text-severity-critical", bg: "bg-severity-critical/10", accent: "border-severity-critical" },
    { label: "Em Andamento", value: inProgress, icon: Clock, color: "text-severity-medium", bg: "bg-severity-medium/10", accent: "border-severity-medium" },
    { label: "Resolvidos", value: resolved, icon: CheckCircle2, color: "text-severity-low", bg: "bg-severity-low/10", accent: "border-severity-low" },
    { label: "Média de Apoios", value: avgUpvotes, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10", accent: "border-accent" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Shield className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold leading-tight">FastFix</h1>
            <p className="text-[10px] opacity-75">Painel do Gestor</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-severity-critical" />
          </button>
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Visão Cidadão
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`glass-card rounded-xl p-5 border-l-4 ${stat.accent} animate-slide-up`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Heatmap + Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card rounded-xl p-5">
            <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-severity-critical" />
              Mapa de Calor — Áreas Críticas
            </h3>
            <div className="relative w-full h-48 sm:h-64 bg-gradient-to-br from-primary/5 via-accent/5 to-muted rounded-lg overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-g" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-g)" />
              </svg>
              {[
                { top: "30%", left: "25%", size: "80px", opacity: 0.4, color: "hsl(var(--severity-critical))" },
                { top: "50%", left: "60%", size: "60px", opacity: 0.3, color: "hsl(var(--severity-high))" },
                { top: "40%", left: "45%", size: "100px", opacity: 0.25, color: "hsl(var(--severity-critical))" },
                { top: "65%", left: "30%", size: "50px", opacity: 0.35, color: "hsl(var(--severity-medium))" },
                { top: "25%", left: "70%", size: "45px", opacity: 0.2, color: "hsl(var(--severity-low))" },
              ].map((h, i) => (
                <div key={i} className="absolute rounded-full blur-xl" style={{ top: h.top, left: h.left, width: h.size, height: h.size, backgroundColor: h.color, opacity: h.opacity, transform: "translate(-50%, -50%)" }} />
              ))}
              <span className="absolute top-[20%] left-[15%] text-[10px] text-muted-foreground/50 uppercase tracking-widest">Meireles</span>
              <span className="absolute top-[60%] left-[65%] text-[10px] text-muted-foreground/50 uppercase tracking-widest">Aldeota</span>
              <span className="absolute top-[75%] left-[20%] text-[10px] text-muted-foreground/50 uppercase tracking-widest">Benfica</span>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-accent" />
              Prioridade por Apoios
            </h3>
            <div className="space-y-3">
              {[...problems]
                .sort((a, b) => b.upvotes - a.upvotes)
                .slice(0, 5)
                .map((p, i) => (
                  <button key={p.id} onClick={() => setSelectedProblem(p)} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left">
                    <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{p.title}</p>
                      <p className="text-[10px] text-muted-foreground">{p.address}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-accent">
                      <TrendingUp className="w-3 h-3" />
                      {p.upvotes}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              Gestão de Reportes
            </h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar reportes..." className="w-full sm:w-56 pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div className="flex gap-1">
                {[
                  { key: "all", label: "Todos" },
                  { key: "pending", label: "Pendentes" },
                  { key: "in_progress", label: "Andamento" },
                  { key: "resolved", label: "Resolvidos" },
                ].map((f) => (
                  <button key={f.key} onClick={() => setSelectedStatus(f.key)} className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition-colors ${selectedStatus === f.key ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 px-3 font-semibold">Problema</th>
                  <th className="text-left py-2 px-3 font-semibold hidden sm:table-cell">Local</th>
                  <th className="text-center py-2 px-3 font-semibold">Severidade</th>
                  <th className="text-center py-2 px-3 font-semibold">Apoios</th>
                  <th className="text-center py-2 px-3 font-semibold">Status</th>
                  <th className="text-center py-2 px-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const cat = categoryConfig[p.category];
                  const CatIcon = cat.icon;
                  return (
                    <tr key={p.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md bg-muted ${cat.color}`}>
                            <CatIcon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{p.title}</p>
                            <p className="text-muted-foreground text-[10px]">{p.reporterName} • {formatDateBR(p.createdAt)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 hidden sm:table-cell">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-[200px]">{p.address}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${severityConfig[p.severity].className}`}>
                          {severityConfig[p.severity].label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-foreground">{p.upvotes}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <select
                          value={p.status}
                          onChange={(e) => handleStatusChange(p.id, e.target.value as Status)}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-accent/50 ${statusConfig[p.status].className}`}
                        >
                          <option value="pending">Pendente</option>
                          <option value="in_progress">Em Andamento</option>
                          <option value="resolved">Resolvido</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => setSelectedProblem(p)} className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSelectedProblem(null)} />
          <div className="relative w-full max-w-lg mx-4 glass-card rounded-2xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground text-lg">Detalhes do Reporte</h3>
              <button onClick={() => setSelectedProblem(null)} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <span className="text-muted-foreground text-lg">×</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severityConfig[selectedProblem.severity].className}`}>
                  {severityConfig[selectedProblem.severity].label}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[selectedProblem.status].className}`}>
                  {statusConfig[selectedProblem.status].label}
                </span>
                <span className="text-xs text-muted-foreground">{selectedProblem.upvotes} apoios</span>
              </div>

              <div>
                <h4 className="font-display font-bold text-foreground">{selectedProblem.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedProblem.description}</p>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {selectedProblem.address}
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                Reportado por {selectedProblem.reporterName} em {formatDateTimeBR(selectedProblem.createdAt)}
              </div>

              <div className="border-t border-border pt-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Atualizar Status</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(["pending", "in_progress", "resolved"] as Status[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedProblem.id, s)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${selectedProblem.status === s ? statusConfig[s].className : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resposta ao Cidadão</label>
                <textarea placeholder="Escreva uma atualização para o cidadão..." rows={3} className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none" />
                <Button className="w-full mt-2 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-xs">
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                  Enviar Resposta
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestorDashboard;
