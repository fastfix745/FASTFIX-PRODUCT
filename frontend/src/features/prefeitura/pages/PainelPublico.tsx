import { useState } from "react";
import { Link } from "react-router-dom";
import { MapIcon, CheckCircle2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { generateMonthlyData, DadosMensais } from "../data/mockData";

// Ícones de categorias
const categoryIcons: Record<string, string> = {
  vias: "🛣️",
  iluminacao: "💡",
  saneamento: "🚿",
  limpeza: "🗑️"
};

const categoryLabels: Record<string, string> = {
  vias: "Vias/Buracos",
  iluminacao: "Iluminação",
  saneamento: "Saneamento",
  limpeza: "Limpeza Urbana"
};

const PainelPublico = () => {
  const monthlyData = generateMonthlyData();
  const currentMonth = monthlyData[monthlyData.length - 1];
  const [selectedMonth, setSelectedMonth] = useState<DadosMensais>(currentMonth);
  const [showHistory, setShowHistory] = useState(false);

  const formatNumber = (num: number) => num.toLocaleString("pt-BR");

  const getProgressColor = (resolved: number, total: number) => {
    const percentage = total > 0 ? (resolved / total) * 100 : 0;
    if (percentage >= 70) return "bg-severity-low";
    if (percentage >= 40) return "bg-severity-medium";
    return "bg-severity-high";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header com navegação */}
      <header className="bg-gradient-primary text-primary-foreground shadow-elegant">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                <MapIcon className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-display text-base font-bold leading-tight">FastFix</h1>
                <p className="text-[10px] opacity-75">Prefeitura Municipal</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                to="/prefeitura"
                className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                Painel
              </Link>
              <Link
                to="/prefeitura/registrar"
                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar</span>
              </Link>
              <Link
                to="/prefeitura/backoffice"
                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Título e descrição */}
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Portal do Cidadão
          </h2>
          <p className="text-muted-foreground mt-2">
            Acompanhe as demandas resolvidas pela Prefeitura
          </p>
        </div>

        {/* Placar mensal principal */}
        <div className="glass-card rounded-3xl p-8 text-center shadow-elegant animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckCircle2 className="w-8 h-8 text-severity-low" />
            <span className="text-lg font-semibold text-muted-foreground">Demandas Resolvidas</span>
          </div>

          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span className="font-display text-5xl md:text-6xl font-bold text-severity-low">
              {formatNumber(selectedMonth.resolvidas)}
            </span>
            <span className="text-2xl text-muted-foreground">/</span>
            <span className="font-display text-3xl md:text-4xl font-semibold text-muted-foreground">
              {formatNumber(selectedMonth.total)}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            demandas resolvidas este mês
          </p>

          {/* Seletor de mês */}
          <div className="relative inline-block">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm font-medium text-foreground"
            >
              <span>{selectedMonth.mes} de {selectedMonth.ano}</span>
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Dropdown de histórico */}
            {showHistory && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 glass-card rounded-xl shadow-lg z-10 overflow-hidden animate-fade-in">
                {monthlyData.slice(0, -1).reverse().map((month, idx) => (
                  <button
                    key={`${month.mes}-${month.ano}`}
                    onClick={() => {
                      setSelectedMonth(month);
                      setShowHistory(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between
                      ${idx === monthlyData.length - 2 ? 'border-t border-border' : ''}`}
                  >
                    <span className="text-foreground">{month.mes} {month.ano}</span>
                    <span className="text-severity-low font-medium">{month.resolvidas}/{month.total}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Barras de progresso por categoria */}
        <div className="glass-card rounded-2xl p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold text-foreground mb-6">
            Progresso por Categoria
          </h3>

          <div className="space-y-5">
            {Object.entries(selectedMonth.porCategoria).map(([categoria, dados]) => {
              const percentage = dados.total > 0 ? Math.round((dados.resolvidas / dados.total) * 100) : 0;

              return (
                <div key={categoria} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{categoryIcons[categoria]}</span>
                      <span className="font-medium text-foreground">{categoryLabels[categoria]}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {dados.resolvidas} / {dados.total} ({percentage}%)
                    </span>
                  </div>

                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(dados.resolvidas, dados.total)} transition-all duration-700 ease-out rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botão de registrar demanda */}
        <div className="text-center pt-4">
          <Link to="/prefeitura/registrar">
            <Button size="lg" className="bg-gradient-accent text-accent-foreground font-bold px-8">
              <Plus className="w-5 h-5 mr-2" />
              Registrar Nova Demanda
            </Button>
          </Link>
        </div>

        {/* Informações institucionais */}
        <div className="glass-card rounded-xl p-6 mt-8">
          <h4 className="font-display font-semibold text-foreground mb-3">
            Sobre o Programa
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O FastFix é uma iniciativa da Prefeitura Municipal para melhorar a qualidade de vida
            dos cidadãos através do atendimento rápido e eficiente às demandas urbanas.
            Sua participação é fundamental para construirmos uma cidade melhor.
          </p>
        </div>
      </main>

      {/* Footer simples */}
      <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border mt-8">
        <p>Prefeitura Municipal - FastFix © 2026</p>
      </footer>
    </div>
  );
};

export default PainelPublico;