import { TrendingUp, AlertCircle, CheckCircle2, Clock, Users, FileText, MapPin } from "lucide-react";
import { Problem } from "@/features/problems/hooks/useProblems";
import { categoryConfig } from "@/features/problems/config/problems";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface DashboardProps {
  problems: Problem[];
}

const Dashboard = ({ problems }: DashboardProps) => {
  const { user, profile, roles, isManager } = useAuth();
  const isAdmin = roles.includes("admin");

  const myProblems = user ? problems.filter((p) => p.userId === user.id) : [];
  const totalReported = problems.length;
  const resolved = problems.filter((p) => p.status === "resolved").length;
  const inProgress = problems.filter((p) => p.status === "in_progress").length;
  const pending = problems.filter((p) => p.status === "pending").length;
  const resolutionRate = totalReported > 0 ? Math.round((resolved / totalReported) * 100) : 0;

  // Dashboard do Cidadão
  if (!isManager && !isAdmin) {
    const myResolved = myProblems.filter((p) => p.status === "resolved").length;
    const myInProgress = myProblems.filter((p) => p.status === "in_progress").length;
    const myPending = myProblems.filter((p) => p.status === "pending").length;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Painel da Comunidade
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe os problemas da sua cidade {profile?.city ? `(${profile.city})` : ""}
          </p>
        </div>

        {/* Estatísticas da cidade */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-lg p-4 animate-slide-up">
            <div className="inline-flex p-2 rounded-lg bg-severity-high/10 mb-2">
              <AlertCircle className="w-4 h-4 text-severity-high" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{pending}</p>
            <p className="text-xs font-semibold text-foreground mt-0.5">Pendentes</p>
          </div>
          <div className="glass-card rounded-lg p-4 animate-slide-up">
            <div className="inline-flex p-2 rounded-lg bg-severity-low/10 mb-2">
              <CheckCircle2 className="w-4 h-4 text-severity-low" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{resolved}</p>
            <p className="text-xs font-semibold text-foreground mt-0.5">Resolvidos</p>
          </div>
          <div className="glass-card rounded-lg p-4 animate-slide-up">
            <div className="inline-flex p-2 rounded-lg bg-severity-medium/10 mb-2">
              <Clock className="w-4 h-4 text-severity-medium" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{inProgress}</p>
            <p className="text-xs font-semibold text-foreground mt-0.5">Em Andamento</p>
          </div>
          <div className="glass-card rounded-lg p-4 animate-slide-up">
            <div className="inline-flex p-2 rounded-lg bg-accent/10 mb-2">
              <Users className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{problems.reduce((s, p) => s + p.upvotes, 0)}</p>
            <p className="text-xs font-semibold text-foreground mt-0.5">Total de Apoios</p>
          </div>
        </div>

        {/* Meus Reportes */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="font-display font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Meus Reportes
          </h3>
          {myProblems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Você ainda não criou nenhum reporte.
            </p>
          ) : (
            <div className="space-y-2">
              {myProblems.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {p.address}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    p.status === "resolved" ? "bg-severity-low/20 text-severity-low" :
                    p.status === "in_progress" ? "bg-severity-medium/20 text-severity-medium" :
                    "bg-severity-high/20 text-severity-high"
                  }`}>
                    {p.status === "resolved" ? "Resolvido" : p.status === "in_progress" ? "Em Andamento" : "Pendente"}
                  </span>
                </div>
              ))}
              {myProblems.length > 5 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  +{myProblems.length - 5} reportes anteriores
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dashboard do Gestor ou Admin
  const stats = [
    { label: "Total Reportados", value: totalReported, icon: AlertCircle, change: `${pending} pendentes`, color: "text-severity-high", bg: "bg-severity-high/10" },
    { label: "Resolvidos", value: resolved, icon: CheckCircle2, change: `${resolutionRate}% taxa de resolução`, color: "text-severity-low", bg: "bg-severity-low/10" },
    { label: "Em Andamento", value: inProgress, icon: Clock, change: totalReported > 0 ? `${Math.round((inProgress / totalReported) * 100)}% do total` : "0%", color: "text-severity-medium", bg: "bg-severity-medium/10" },
    { label: "Total de Apoios", value: problems.reduce((s, p) => s + p.upvotes, 0), icon: Users, change: "votos da comunidade", color: "text-accent", bg: "bg-accent/10" },
  ];

  const categories = Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>;
  const barData = categories.map((cat) => {
    const catProblems = problems.filter((p) => p.category === cat);
    return {
      label: categoryConfig[cat].label,
      pending: catProblems.filter((p) => p.status !== "resolved").length,
      resolved: catProblems.filter((p) => p.status === "resolved").length,
    };
  });
  const maxBar = Math.max(...barData.map((d) => d.pending + d.resolved), 1);

  // Group by address neighborhood
  const neighborhoods: Record<string, number[]> = {};
  problems.forEach((p) => {
    const match = p.address.match(/- ([^,]+)/);
    const name = match ? match[1].trim() : "Outro";
    if (!neighborhoods[name]) neighborhoods[name] = [];
    neighborhoods[name].push(p.status === "resolved" ? 1 : 0);
  });
  const bairros = Object.entries(neighborhoods).map(([name, scores]) => ({
    name,
    score: Math.round((scores.filter(Boolean).length / scores.length) * 100),
  })).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          {isAdmin ? "Painel Global" : `Painel - ${profile?.city || "Município"}`}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isAdmin ? "Visão geral de todas as cidades" : "Acompanhe o progresso da sua cidade"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-lg p-4 animate-slide-up">
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-2`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-foreground mb-4">Problemas por Categoria</h3>
        <div className="space-y-3">
          {barData.map((d) => (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">{d.label}</span>
                <span className="text-[10px] text-muted-foreground">{d.pending + d.resolved} total</span>
              </div>
              <div className="flex h-5 rounded-full overflow-hidden bg-muted">
                <div className="bg-severity-low h-full transition-all duration-700" style={{ width: `${(d.resolved / maxBar) * 100}%` }} />
                <div className="bg-severity-high h-full transition-all duration-700" style={{ width: `${(d.pending / maxBar) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-severity-low" />
            <span className="text-[10px] text-muted-foreground">Resolvido</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-severity-high" />
            <span className="text-[10px] text-muted-foreground">Pendente</span>
          </div>
        </div>
      </div>

      {bairros.length > 0 && (
        <div className="glass-card rounded-lg p-4">
          <h3 className="font-display font-semibold text-sm text-foreground mb-3">Índice de Resolução por Bairro</h3>
          {bairros.map((bairro) => (
            <div key={bairro.name} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
              <span className="text-xs font-medium text-foreground w-28">{bairro.name}</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${bairro.score}%`,
                    backgroundColor: bairro.score > 70 ? "hsl(var(--severity-low))" : bairro.score > 50 ? "hsl(var(--severity-medium))" : "hsl(var(--severity-critical))",
                  }}
                />
              </div>
              <span className="text-xs font-bold text-foreground w-8">{bairro.score}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;