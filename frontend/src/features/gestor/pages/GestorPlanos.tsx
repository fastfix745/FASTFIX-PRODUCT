import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Shield } from "lucide-react";
import { plans } from "../config/plans";
import { PlanCard } from "../components/PlanCard";

type Cycle = "monthly" | "annual";

const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const GestorPlanos = () => {
  const [cycle, setCycle] = useState<Cycle>("annual");

  return (
    <div className="min-h-dvh bg-gradient-mesh">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/gestor" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:-translate-x-0.5 transition" />
            <span className="text-sm font-semibold text-foreground">Painel do Gestor</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              FastFix · Planos para Prefeituras
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent/10 text-accent">
            <Sparkles className="w-3 h-3" /> Gestão Inteligente
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground mt-4 leading-tight">
            Escolha o plano ideal para sua cidade
          </h1>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            Transforme dados da comunidade em decisões públicas. Cancele quando quiser, sem multa.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-card border border-border mt-8 shadow-sm">
            <button
              onClick={() => setCycle("monthly")}
              className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition ${
                cycle === "monthly"
                  ? "bg-gradient-accent text-accent-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setCycle("annual")}
              className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition inline-flex items-center gap-2 ${
                cycle === "annual"
                  ? "bg-gradient-accent text-accent-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anual
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  cycle === "annual" ? "bg-accent-foreground/20 text-accent-foreground" : "bg-success/15 text-success"
                }`}
              >
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3 mt-10 sm:mt-14">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} cycle={cycle} fmtBRL={fmtBRL} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Precisa de um plano sob medida para o seu estado ou consórcio de municípios?{" "}
            <a href="mailto:contato@fastfix.gov.br" className="text-accent font-semibold hover:underline">
              Fale com nosso time
            </a>{" "}
            — atendimento exclusivo para o setor público.
          </p>
        </div>
      </main>
    </div>
  );
};

export default GestorPlanos;
