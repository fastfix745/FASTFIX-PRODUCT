import { memo } from "react";
import { AlertTriangle, Clock, CheckCircle2, TrendingUp } from "lucide-react";

interface KpiCardsProps {
  pending: number;
  inProgress: number;
  resolved: number;
  avgUpvotes: number;
}

export const KpiCards = memo(({ pending, inProgress, resolved, avgUpvotes }: KpiCardsProps) => {
  const stats = [
    {
      label: "Reportes Abertos",
      value: pending,
      icon: AlertTriangle,
      color: "text-severity-critical",
      bg: "bg-severity-critical/10",
      accent: "border-severity-critical",
    },
    {
      label: "Em Andamento",
      value: inProgress,
      icon: Clock,
      color: "text-severity-medium",
      bg: "bg-severity-medium/10",
      accent: "border-severity-medium",
    },
    {
      label: "Resolvidos",
      value: resolved,
      icon: CheckCircle2,
      color: "text-severity-low",
      bg: "bg-severity-low/10",
      accent: "border-severity-low",
    },
    {
      label: "Média de Apoios",
      value: avgUpvotes,
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-accent/10",
      accent: "border-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className={`glass-card rounded-xl p-5 border-l-4 ${stat.accent}`}>
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
  );
});

KpiCards.displayName = "KpiCards";
