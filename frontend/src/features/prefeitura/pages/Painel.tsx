import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { usePublicDemands } from "@/features/demands/hooks/useDemands";
import NavBar from "../components/NavBar";
import { Loader2 } from "lucide-react";

const categoryInfo = [
  { key: "vias", label: "Vias/Buracos", icon: "🚧", color: "bg-blue-500", category: "vias" },
  { key: "iluminacao", label: "Iluminação", icon: "💡", color: "bg-yellow-500", category: "iluminacao" },
  { key: "saneamento", label: "Saneamento", icon: "🌊", color: "bg-cyan-500", category: "saneamento" },
  { key: "limpeza", label: "Limpeza Urbana", icon: "🧹", color: "bg-green-500", category: "limpeza" }
];

const Painel = () => {
  const { data: demands = [], isLoading } = usePublicDemands();

  const stats = useMemo(() => {
    const resolved = demands.filter(d => d.status === 'resolved');
    const byCategory = categoryInfo.map(cat => ({
      ...cat,
      resolved: resolved.filter(d => d.category === cat.category).length,
      total: demands.filter(d => d.category === cat.category).length
    }));
    return {
      total: demands.length,
      resolved: resolved.length,
      byCategory
    };
  }, [demands]);

  const percentage = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header com badge Cidadão */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                👤 Cidadão
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Prefeitura de Marília</p>
            <h2 className="font-display text-2xl font-bold text-foreground">FastFix</h2>
          </div>
          <div className="flex gap-2">
            <Link to="/registrar">
              <Button size="sm" className="bg-gradient-accent text-accent-foreground">
                <Plus className="w-4 h-4 mr-1" /> Nova Demanda
              </Button>
            </Link>
          </div>
        </div>

        {/* Card Hero */}
        <div
          className="rounded-2xl p-8 text-white shadow-elegant"
          style={{ backgroundColor: "#1B3A6B" }}
        >
          <p className="text-sm font-medium opacity-80 mb-1">Transparência Pública</p>
          <h3 className="font-display text-2xl font-bold mb-6">
            Painel de Demandas
          </h3>

          {/* Placar principal */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display text-5xl font-bold" style={{ color: "#F5A623" }}>{stats.resolved}</span>
            <span className="text-2xl opacity-70">/ {stats.total}</span>
            <span className="text-lg font-medium ml-2">({percentage}%)</span>
          </div>
          <p className="text-sm opacity-80 mb-6">demandas públicas resolvidas</p>

          {/* Barra de progresso */}
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%`, backgroundColor: "#F5A623" }}
            />
          </div>
        </div>

        {/* Grid 2x2 de progresso por categoria */}
        <div className="grid grid-cols-2 gap-4">
          {stats.byCategory.map((cat) => {
            const pct = cat.total > 0 ? Math.round((cat.resolved / cat.total) * 100) : 0;

            return (
              <div key={cat.key} className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-medium text-foreground">{cat.label}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-display text-2xl font-bold text-foreground">{cat.resolved}</span>
                  <span className="text-sm text-muted-foreground">/ {cat.total}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{pct}% resolvido</p>
              </div>
            );
          })}
        </div>

        {/* Card "Encontrou um problema?" */}
        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
          <h4 className="font-display text-lg font-semibold text-foreground mb-2">
            Encontrou um problema na cidade?
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Sua participação é fundamental para melhorarmos nossa cidade juntos.
          </p>
          <Link to="/registrar">
            <Button className="bg-gradient-accent text-accent-foreground font-bold">
              Registrar demanda agora
            </Button>
          </Link>
        </div>

        {/* Footer info */}
        <p className="text-xs text-muted-foreground text-center">
          FastFix Prefecture — Gestão de Demandas Urbanas
        </p>
      </main>
    </div>
  );
};

export default Painel;