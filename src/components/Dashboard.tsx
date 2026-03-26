import { TrendingUp, AlertCircle, CheckCircle2, Clock, Users } from "lucide-react";
import { mockProblems } from "@/lib/problems";

const stats = [
  {
    label: "Total Reportados",
    value: 156,
    icon: AlertCircle,
    change: "+12 esta semana",
    color: "text-severity-high",
    bg: "bg-severity-high/10",
  },
  {
    label: "Resolvidos",
    value: 89,
    icon: CheckCircle2,
    change: "57% taxa de resolução",
    color: "text-severity-low",
    bg: "bg-severity-low/10",
  },
  {
    label: "Em Andamento",
    value: 34,
    icon: Clock,
    change: "22% do total",
    color: "text-severity-medium",
    bg: "bg-severity-medium/10",
  },
  {
    label: "Cidadãos Ativos",
    value: 1243,
    icon: Users,
    change: "+89 novos",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const barData = [
  { label: "Buracos", pending: 28, resolved: 15 },
  { label: "Iluminação", pending: 18, resolved: 22 },
  { label: "Calçadas", pending: 12, resolved: 19 },
  { label: "Saneamento", pending: 9, resolved: 14 },
  { label: "Áreas Verdes", pending: 6, resolved: 11 },
];

const Dashboard = () => {
  const maxBar = Math.max(...barData.map(d => d.pending + d.resolved));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Painel de Transparência
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe o progresso da sua comunidade em tempo real</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-lg p-4 animate-slide-up">
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-2`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-display font-bold text-foreground animate-count-up">{stat.value}</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
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
                <div
                  className="bg-severity-low h-full transition-all duration-700"
                  style={{ width: `${(d.resolved / maxBar) * 100}%` }}
                />
                <div
                  className="bg-severity-high h-full transition-all duration-700"
                  style={{ width: `${(d.pending / maxBar) * 100}%` }}
                />
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

      {/* Infrastructure Index */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">Índice de Infraestrutura por Bairro</h3>
        {[
          { name: "Centro", score: 72, trend: "+5" },
          { name: "Vila Nova", score: 45, trend: "-2" },
          { name: "Jardim América", score: 61, trend: "+8" },
          { name: "Bela Vista", score: 83, trend: "+12" },
        ].map((bairro) => (
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
            <span className="text-xs font-bold text-foreground w-8">{bairro.score}</span>
            <span className={`text-[10px] font-medium ${bairro.trend.startsWith("+") ? "text-severity-low" : "text-severity-critical"}`}>
              {bairro.trend}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
