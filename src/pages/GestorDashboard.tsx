import { useState } from "react";
import {
  BarChart3, CheckCircle2, Clock, AlertTriangle, Users, MapPin,
  Search, ArrowUpDown, Eye, MessageSquare,
  TrendingUp, Flame, Shield, Upload, Globe, LogOut, Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  useProblems, useUpdateStatus, useTogglePublic, useUpdateMedia,
  uploadProblemMedia, Problem,
} from "@/hooks/useProblems";
import { categoryConfig, severityConfig, statusConfig, Status, formatDateBR, formatDateTimeBR } from "@/lib/problems";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "@/components/NotificationBell";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { toast } from "sonner";

const GestorDashboard = () => {
  const { user, isManager, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: problems = [], isLoading } = useProblems();
  const updateStatus = useUpdateStatus();
  const togglePublic = useTogglePublic();
  const updateMedia = useUpdateMedia();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
        <div className="glass-card rounded-3xl p-8 max-w-sm text-center shadow-elegant">
          <Shield className="w-10 h-10 mx-auto text-accent mb-3" />
          <h2 className="font-display font-bold text-xl text-foreground">Acesso restrito</h2>
          <p className="text-sm text-muted-foreground mt-2">Faça login para acessar o painel do gestor.</p>
          <Button onClick={() => navigate("/auth")} className="mt-5 w-full bg-gradient-accent text-accent-foreground font-bold">Entrar</Button>
        </div>
      </div>
    );
  }

  if (!isManager) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md text-center shadow-elegant">
          <Shield className="w-10 h-10 mx-auto text-severity-high mb-3" />
          <h2 className="font-display font-bold text-xl text-foreground">Permissão necessária</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Esta área é exclusiva para gestores municipais. Solicite acesso ao administrador da plataforma.
          </p>
          <Button onClick={() => navigate("/app")} variant="outline" className="mt-5">Voltar ao app</Button>
        </div>
      </div>
    );
  }

  const filtered = problems.filter((p) => {
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (id: string, newStatus: Status) => {
    updateStatus.mutate({ id, status: newStatus });
    if (selectedProblem?.id === id) setSelectedProblem((prev) => prev ? { ...prev, status: newStatus } : null);
  };

  const handleTogglePublic = (id: string, isPublic: boolean) => {
    togglePublic.mutate({ id, isPublic }, {
      onSuccess: () => toast.success(isPublic ? "Denúncia pública" : "Denúncia privada"),
    });
    if (selectedProblem?.id === id) setSelectedProblem((prev) => prev ? { ...prev, isPublic } : null);
  };

  const handleUpload = async (kind: "before" | "after", files: FileList | null) => {
    if (!files || !selectedProblem) return;
    const setter = kind === "before" ? setUploadingBefore : setUploadingAfter;
    setter(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files).slice(0, 4)) {
        urls.push(await uploadProblemMedia(f, `${selectedProblem.id}/${kind}`));
      }
      const current = kind === "before" ? selectedProblem.beforeImages : selectedProblem.afterImages;
      const next = [...current, ...urls];
      await updateMedia.mutateAsync({
        id: selectedProblem.id,
        ...(kind === "before" ? { before: next } : { after: next }),
      });
      setSelectedProblem((prev) => prev ? {
        ...prev,
        ...(kind === "before" ? { beforeImages: next } : { afterImages: next }),
      } : null);
      toast.success(`Foto(s) "${kind === "before" ? "Antes" : "Depois"}" enviadas`);
    } catch (e) {
      toast.error("Erro no upload", { description: (e as Error).message });
    } finally {
      setter(false);
    }
  };

  const totalProblems = problems.length;
  const pending = problems.filter((p) => p.status === "pending").length;
  const inProgress = problems.filter((p) => p.status === "in_progress").length;
  const resolved = problems.filter((p) => p.status === "resolved").length;
  const avgUpvotes = totalProblems > 0 ? Math.round(problems.reduce((s, p) => s + p.upvotes, 0) / totalProblems) : 0;

  const stats = [
    { label: "Reportes Abertos", value: pending, icon: AlertTriangle, color: "text-severity-critical", bg: "bg-severity-critical/10", accent: "border-severity-critical" },
    { label: "Em Andamento", value: inProgress, icon: Clock, color: "text-severity-medium", bg: "bg-severity-medium/10", accent: "border-severity-medium" },
    { label: "Resolvidos", value: resolved, icon: CheckCircle2, color: "text-severity-low", bg: "bg-severity-low/10", accent: "border-severity-low" },
    { label: "Média de Apoios", value: avgUpvotes, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10", accent: "border-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
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
          <NotificationBell />
          <Link to="/app" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
            <Eye className="w-3.5 h-3.5" /> Visão Cidadão
          </Link>
          <button onClick={() => signOut()} className="p-2 rounded-lg hover:bg-primary-foreground/10" aria-label="Sair">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
      ) : (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`glass-card rounded-xl p-5 border-l-4 ${stat.accent}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}><Icon className={`w-5 h-5 ${stat.color}`} /></div>
                </div>
                <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card rounded-xl p-5">
            <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-severity-critical" /> Mapa de Calor — Áreas Críticas
            </h3>
            <div className="relative w-full h-48 sm:h-64 bg-gradient-to-br from-primary/5 via-accent/5 to-muted rounded-lg overflow-hidden">
              {[
                { top: "30%", left: "25%", size: "80px", opacity: 0.4, color: "hsl(var(--severity-critical))" },
                { top: "50%", left: "60%", size: "60px", opacity: 0.3, color: "hsl(var(--severity-high))" },
                { top: "40%", left: "45%", size: "100px", opacity: 0.25, color: "hsl(var(--severity-critical))" },
                { top: "65%", left: "30%", size: "50px", opacity: 0.35, color: "hsl(var(--severity-medium))" },
              ].map((h, i) => (
                <div key={i} className="absolute rounded-full blur-xl" style={{ top: h.top, left: h.left, width: h.size, height: h.size, backgroundColor: h.color, opacity: h.opacity, transform: "translate(-50%, -50%)" }} />
              ))}
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-accent" /> Prioridade por Apoios
            </h3>
            <div className="space-y-3">
              {[...problems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5).map((p, i) => (
                <button key={p.id} onClick={() => setSelectedProblem(p)} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 text-left">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{p.title}</p>
                    <p className="text-[10px] text-muted-foreground">{p.address}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-accent">
                    <TrendingUp className="w-3 h-3" />{p.upvotes}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" /> Gestão de Reportes
            </h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar..." className="w-full sm:w-56 pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-foreground text-xs" />
              </div>
              <div className="flex gap-1">
                {[
                  { key: "all", label: "Todos" },
                  { key: "pending", label: "Pendentes" },
                  { key: "in_progress", label: "Andamento" },
                  { key: "resolved", label: "Resolvidos" },
                ].map((f) => (
                  <button key={f.key} onClick={() => setSelectedStatus(f.key)} className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg ${selectedStatus === f.key ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
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
                  <th className="text-left py-2 px-3 font-semibold hidden lg:table-cell">Cidade</th>
                  <th className="text-center py-2 px-3 font-semibold">Severidade</th>
                  <th className="text-center py-2 px-3 font-semibold">Apoios</th>
                  <th className="text-center py-2 px-3 font-semibold">Status</th>
                  <th className="text-center py-2 px-3 font-semibold">
                    <span className="flex items-center justify-center gap-1"><Globe className="w-3 h-3" /> Público</span>
                  </th>
                  <th className="text-center py-2 px-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const cat = categoryConfig[p.category];
                  const CatIcon = cat.icon;
                  return (
                    <tr key={p.id} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md bg-muted ${cat.color}`}><CatIcon className="w-3.5 h-3.5" /></div>
                          <div>
                            <p className="font-semibold text-foreground">{p.title}</p>
                            <p className="text-muted-foreground text-[10px]">{p.reporterName} • {formatDateBR(p.createdAt)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 hidden lg:table-cell text-muted-foreground">{p.city}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${severityConfig[p.severity].className}`}>{severityConfig[p.severity].label}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-foreground">{p.upvotes}</td>
                      <td className="py-3 px-3 text-center">
                        <select value={p.status} onChange={(e) => handleStatusChange(p.id, e.target.value as Status)}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer ${statusConfig[p.status].className}`}>
                          <option value="pending">Pendente</option>
                          <option value="in_progress">Em Andamento</option>
                          <option value="resolved">Resolvido</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex justify-center">
                          <Switch checked={p.isPublic} onCheckedChange={(v) => handleTogglePublic(p.id, v)} />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => setSelectedProblem(p)} className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent">
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
      )}

      {selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSelectedProblem(null)} />
          <div className="relative w-full max-w-2xl mx-4 glass-card rounded-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground text-lg">Detalhes do Reporte</h3>
              <button onClick={() => setSelectedProblem(null)} className="p-1.5 rounded-full hover:bg-muted">
                <span className="text-muted-foreground text-lg">×</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severityConfig[selectedProblem.severity].className}`}>{severityConfig[selectedProblem.severity].label}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[selectedProblem.status].className}`}>{statusConfig[selectedProblem.status].label}</span>
                <span className="text-xs text-muted-foreground">{selectedProblem.upvotes} apoios · {selectedProblem.city}</span>
              </div>

              <div>
                <h4 className="font-display font-bold text-foreground">{selectedProblem.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedProblem.description}</p>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />{selectedProblem.address}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />Reportado por {selectedProblem.reporterName} em {formatDateTimeBR(selectedProblem.createdAt)}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/20">
                <div>
                  <p className="text-sm font-bold text-foreground flex items-center gap-1.5"><Globe className="w-4 h-4 text-accent" /> Tornar Público</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Visível para qualquer cidade no mural de transparência</p>
                </div>
                <Switch checked={selectedProblem.isPublic} onCheckedChange={(v) => handleTogglePublic(selectedProblem.id, v)} />
              </div>

              <div className="border-t border-border pt-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Atualizar Status</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(["pending", "in_progress", "resolved"] as Status[]).map((s) => (
                    <button key={s} onClick={() => handleStatusChange(selectedProblem.id, s)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold ${selectedProblem.status === s ? statusConfig[s].className : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedProblem.isPublic && selectedProblem.status === "resolved" && (
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-success flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Showcase Antes & Depois
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground mb-1">Antes ({selectedProblem.beforeImages.length})</p>
                      <label className="block w-full h-24 rounded-lg border-2 border-dashed border-border hover:border-accent cursor-pointer flex items-center justify-center bg-muted/30">
                        {uploadingBefore ? <Loader2 className="w-5 h-5 animate-spin text-accent" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload("before", e.target.files)} />
                      </label>
                      {selectedProblem.beforeImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-1 mt-2">
                          {selectedProblem.beforeImages.slice(0, 3).map((u, i) => (
                            <img key={i} src={u} className="aspect-square object-cover rounded" alt="" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground mb-1">Depois ({selectedProblem.afterImages.length})</p>
                      <label className="block w-full h-24 rounded-lg border-2 border-dashed border-success/50 hover:border-success cursor-pointer flex items-center justify-center bg-success/5">
                        {uploadingAfter ? <Loader2 className="w-5 h-5 animate-spin text-success" /> : <Upload className="w-5 h-5 text-success" />}
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload("after", e.target.files)} />
                      </label>
                      {selectedProblem.afterImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-1 mt-2">
                          {selectedProblem.afterImages.slice(0, 3).map((u, i) => (
                            <img key={i} src={u} className="aspect-square object-cover rounded" alt="" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedProblem.beforeImages.length > 0 && selectedProblem.afterImages.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground mb-2">Pré-visualização</p>
                      <BeforeAfterSlider before={selectedProblem.beforeImages[0]} after={selectedProblem.afterImages[0]} />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resposta ao Cidadão</label>
                <textarea placeholder="Escreva uma atualização..." rows={3} className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm resize-none" />
                <Button className="w-full mt-2 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-xs">
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Enviar Resposta
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
