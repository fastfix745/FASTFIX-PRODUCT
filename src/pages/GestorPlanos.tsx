import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, Building2, Crown, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

type Cycle = "monthly" | "annual";

const plans = [
  {
    id: "essencial",
    name: "Essencial",
    icon: Building2,
    tagline: "Para pequenos municípios começarem a ouvir o cidadão.",
    monthly: 499,
    annual: 4990, // 2 meses grátis
    highlight: false,
    features: [
      "Até 5.000 denúncias/mês",
      "Painel de KPIs em tempo real",
      "Mapa de calor por categoria",
      "1 gestor + 3 operadores",
      "Suporte por e-mail (48h)",
    ],
  },
  {
    id: "profissional",
    name: "Profissional",
    icon: Sparkles,
    tagline: "Para prefeituras que querem transformar dados em ação.",
    monthly: 1299,
    annual: 12990,
    highlight: true,
    features: [
      "Denúncias ilimitadas",
      "Heatmaps + Índice de Infraestrutura",
      "Showcase Antes/Depois público",
      "Até 15 gestores e equipes",
      "Notificações em tempo real",
      "Integração com SLA municipal",
      "Suporte prioritário (12h)",
    ],
  },
  {
    id: "metropolitano",
    name: "Metropolitano",
    icon: Crown,
    tagline: "Para capitais e regiões metropolitanas com alto volume.",
    monthly: 3490,
    annual: 34900,
    highlight: false,
    features: [
      "Tudo do Profissional",
      "Multi-secretarias e sub-regiões",
      "API e exportação BI dedicada",
      "Onboarding e treinamento presencial",
      "SLA garantido em contrato",
      "Gerente de sucesso dedicado",
    ],
  },
];

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
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                cycle === "annual" ? "bg-accent-foreground/20 text-accent-foreground" : "bg-success/15 text-success"
              }`}>-17%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3 mt-10 sm:mt-14">
          {plans.map((p) => {
            const Icon = p.icon;
            const price = cycle === "monthly" ? p.monthly : Math.round(p.annual / 12);
            const billed = cycle === "monthly"
              ? "Cobrado mensalmente"
              : `Cobrado ${fmtBRL(p.annual)} por ano`;
            return (
              <article
                key={p.id}
                className={`relative rounded-3xl p-6 sm:p-7 border transition-all ${
                  p.highlight
                    ? "bg-card border-accent/40 shadow-elegant md:scale-[1.03]"
                    : "glass-card border-border hover:border-accent/30"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-accent text-accent-foreground shadow-glow">
                      <Sparkles className="w-3 h-3" /> Mais escolhido
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    p.highlight ? "bg-gradient-accent text-accent-foreground" : "bg-accent/10 text-accent"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">{p.name}</h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-3 leading-relaxed min-h-[40px]">
                  {p.tagline}
                </p>

                <div className="mt-5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-4xl font-bold text-foreground">{fmtBRL(price)}</span>
                    <span className="text-sm text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{billed}</p>
                </div>

                <Button
                  className={`w-full mt-5 h-11 font-bold ${
                    p.highlight
                      ? "bg-gradient-accent text-accent-foreground shadow-glow"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  Assinar {p.name}
                </Button>

                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
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
