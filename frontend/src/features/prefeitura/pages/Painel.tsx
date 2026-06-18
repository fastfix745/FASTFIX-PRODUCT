import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import NavBar from "../components/NavBar";

interface DadosMensais {
  mes: string;
  ano: number;
  resolvidas: number;
  total: number;
  porCategoria: {
    vias: { resolvidas: number; total: number };
    iluminacao: { resolvidas: number; total: number };
    saneamento: { resolvidas: number; total: number };
    limpeza: { resolvidas: number; total: number };
  };
}

const dadosMeses: DadosMensais[] = [
  {
    mes: "Junho",
    ano: 2026,
    resolvidas: 0,
    total: 0,
    porCategoria: {
      vias: { resolvidas: 0, total: 0 },
      iluminacao: { resolvidas: 0, total: 0 },
      saneamento: { resolvidas: 0, total: 0 },
      limpeza: { resolvidas: 0, total: 0 }
    }
  }
];

const categoryInfo = [
  { key: "vias", label: "Vias/Buracos", icon: "🚧", color: "bg-blue-500" },
  { key: "iluminacao", label: "Iluminação", icon: "💡", color: "bg-yellow-500" },
  { key: "saneamento", label: "Saneamento", icon: "🌊", color: "bg-cyan-500" },
  { key: "limpeza", label: "Limpeza Urbana", icon: "🧹", color: "bg-green-500" }
];

const Painel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentData = dadosMeses[selectedIndex];
  const percentage = Math.round((currentData.resolvidas / currentData.total) * 100);

  const handlePrevMonth = () => {
    if (selectedIndex < dadosMeses.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

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
            Painel de Demandas — {currentData.mes}/{currentData.ano}
          </h3>

          {/* Placar principal */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display text-5xl font-bold" style={{ color: "#F5A623" }}>{currentData.resolvidas}</span>
            <span className="text-2xl opacity-70">/ {currentData.total}</span>
            <span className="text-lg font-medium ml-2">({percentage}%)</span>
          </div>
          <p className="text-sm opacity-80 mb-6">demandas resolvidas este mês</p>

          {/* Barra de progresso */}
          <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-8">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%`, backgroundColor: "#F5A623" }}
            />
          </div>

          {/* Seletor de meses */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              disabled={selectedIndex >= dadosMeses.length - 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Mês anterior</span>
            </button>

            <div className="flex gap-2">
              {dadosMeses.map((mes, idx) => (
                <button
                  key={`${mes.mes}-${mes.ano}`}
                  onClick={() => setSelectedIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    idx === selectedIndex
                      ? "bg-white text-[#1B3A6B]"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {mes.mes.substring(0, 3)}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextMonth}
              disabled={selectedIndex <= 0}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="text-sm">Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid 2x2 de progresso por categoria */}
        <div className="grid grid-cols-2 gap-4">
          {categoryInfo.map((cat) => {
            const data = currentData.porCategoria[cat.key as keyof typeof currentData.porCategoria];
            const pct = Math.round((data.resolvidas / data.total) * 100);

            return (
              <div key={cat.key} className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-medium text-foreground">{cat.label}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-display text-2xl font-bold text-foreground">{data.resolvidas}</span>
                  <span className="text-sm text-muted-foreground">/ {data.total}</span>
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