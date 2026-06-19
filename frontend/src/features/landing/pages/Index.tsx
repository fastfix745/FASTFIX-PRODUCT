import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Shield,
  Sparkles,
  Users,
  BarChart3,
  Eye,
  Zap,
  Building2,
  CheckCircle2,
  Smartphone,
  Activity,
  Brain,
  TrendingUp,
  Calendar,
  Sun,
  Moon,
  LogIn,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTheme } from "@/features/theme/ThemeProvider";

// Importações dos novos subcomponentes memoizados
import { Stat } from "../components/Stat";
import { MiniKpi } from "../components/MiniKpi";
import { Pillar } from "../components/Pillar";
import { SolutionCard } from "../components/SolutionCard";
import { LiveStat } from "../components/LiveStat";

const Landing = () => {

































































































































































































































































































  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-foreground leading-tight">FastFix</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Smart City Platform</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
            <a href="#plataforma" className="hover:text-foreground transition-colors">Plataforma</a>
            <a href="#solucao" className="hover:text-foreground transition-colors">Solução</a>
            <a href="#transparencia" className="hover:text-foreground transition-colors">Transparência</a>
            <a href="#contato" className="hover:text-foreground transition-colors">Contato</a>
            <Link to="/prefeitura" className="text-accent hover:text-accent/80 transition-colors font-semibold">Prefeitura</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label={theme === "dark" ? "Modo claro" : "Modo escuro"}
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-foreground" /> : <Moon className="w-4 h-4 text-foreground" />}
            </button>
            <Link
              to="/painel"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" /> Painel Público
            </Link>
            <Link
              to="/backoffice"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
            >
              <Shield className="w-3.5 h-3.5" /> Backoffice
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-grid-pattern">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> SaaS B2G · Gestão Pública
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-5 leading-[1.05]">
                Gestão inteligente de{" "}
                <span className="text-gradient-accent">demandas para prefeituras</span>
              </h2>
              <p className="text-base lg:text-lg text-muted-foreground mt-5 max-w-xl leading-relaxed">
                Receba, organize e resolva as demandas dos cidadãos com transparência e eficiência. Tudo em uma plataforma.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-accent text-accent-foreground font-bold shadow-glow hover:opacity-95 h-12 px-6"
                >
                  <Link to="/painel">
                    Ver demonstração <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-semibold h-12 px-6">
                  <Link to="/backoffice">
                    <Eye className="mr-2 w-4 h-4" /> Acessar backoffice
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-border/60">
                <Stat label="Municípios atendidos" value={12} />
                <Stat label="Demandas gerenciadas" value="1.840" />
                <Stat label="Taxa de resolução" value="94%" />
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="relative animate-scale-in">
              <div className="absolute -inset-6 bg-gradient-accent opacity-20 blur-3xl rounded-full" />
              <div className="relative glass-card rounded-3xl p-5 shadow-elegant animate-float">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Activity className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-foreground">Centro de Operações</p>
                      <p className="text-[10px] text-muted-foreground">Ao vivo · Fortaleza, CE</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Online
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <MiniKpi label="Abertos" value={0} color="text-severity-critical" bg="bg-severity-critical/10" />
                  <MiniKpi label="Andamento" value={143} color="text-severity-medium" bg="bg-severity-medium/10" />
                  <MiniKpi label="Resolvidos" value={1697} color="text-success" bg="bg-success/10" />
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-muted h-44 relative overflow-hidden border border-border/40">
                  <div className="absolute inset-0 bg-grid-pattern opacity-40" />
                  {[
                    { top: "25%", left: "30%", color: "hsl(var(--severity-critical))", size: 60 },
                    { top: "55%", left: "55%", color: "hsl(var(--severity-high))", size: 80 },
                    { top: "40%", left: "75%", color: "hsl(var(--severity-medium))", size: 50 },
                  ].map((h, i) => (
                    <div key={i} className="absolute rounded-full blur-2xl opacity-50" style={{ top: h.top, left: h.left, width: h.size, height: h.size, backgroundColor: h.color, transform: "translate(-50%, -50%)" }} />
                  ))}
                  {[
                    { top: "30%", left: "32%", c: "hsl(var(--severity-critical))" },
                    { top: "60%", left: "58%", c: "hsl(var(--severity-high))" },
                    { top: "45%", left: "78%", c: "hsl(var(--severity-medium))" },
                    { top: "70%", left: "25%", c: "hsl(var(--severity-low))" },
                  ].map((p, i) => (
                    <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.top, left: p.left }}>
                      <div className="w-3 h-3 rounded-full border-2 border-card shadow-md animate-pulse-pin" style={{ backgroundColor: p.c }} />
                    </div>
                  ))}
                  <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-widest text-muted-foreground/60 font-semibold">Mapa de Calor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILARES SMART CITY */}
      <section id="plataforma" className="py-20 lg:py-24 bg-gradient-to-b from-background to-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Os 4 Pilares</p>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-3">
              Tudo que sua prefeitura precisa
            </h3>
            <p className="text-muted-foreground mt-4">
              Uma plataforma completa que conecta cidadãos e gestores públicos em um ciclo virtuoso de demandas.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Pillar icon={Building2} title="Backoffice completo" desc="Triagem, atribuição e controle por secretaria." />
            <Pillar icon={BarChart3} title="Painel público" desc="Placar mensal de demandas resolvidas visível para todos." />
            <Pillar icon={ClipboardList} title="Registro simplificado" desc="Cidadão registra em 3 passos e recebe protocolo." />
            <Pillar icon={Shield} title="Controle por secretaria" desc="Cada setor vê apenas suas demandas atribuídas." />
          </div>
        </div>
      </section>

      {/* SOLUÇÃO DUPLA */}
      <section id="solucao" className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Como funciona</p>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-3">
              Um ciclo virtuoso de demandas
            </h3>
          </div>
          <div className="grid lg:grid-cols-4 gap-6">
            <SolutionCard
              eyebrow="Passo 1"
              icon={Smartphone}
              title="Cidadão registra"
              items={[
                "Registra a demanda com foto e localização",
                "Recebe protocolo de acompanhamento",
              ]}
              cta={{ label: "Ver registro", to: "/registrar" }}
              variant="accent"
            />
            <SolutionCard
              eyebrow="Passo 2"
              icon={Building2}
              title="Prefeitura triage"
              items={[
                "Recebe, faz triagem e atribui",
                "Direciona para a secretaria responsável",
              ]}
              cta={{ label: "Ver backoffice", to: "/backoffice" }}
              variant="primary"
            />
            <SolutionCard
              eyebrow="Passo 3"
              icon={Zap}
              title="Secretaria resolve"
              items={[
                "Secretaria resolve e atualiza o status",
                "Registra a solução com evidências",
              ]}
              cta={{ label: "Ver backoffice", to: "/backoffice" }}
              variant="primary"
            />
            <SolutionCard
              eyebrow="Passo 4"
              icon={Eye}
              title="Cidadão acompanha"
              items={[
                "Acompanha pelo protocolo",
                "Cidade vê o placar público",
              ]}
              cta={{ label: "Ver painel", to: "/painel" }}
              variant="accent"
            />
          </div>
        </div>
      </section>

      {/* INDICADORES AO VIVO / TRANSPARÊNCIA */}
      <section id="transparencia" className="py-20 lg:py-24 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Transparência Pública</p>
              <h3 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-3">
                Resultados visíveis para todos
              </h3>
            </div>
            <Link to="/painel" className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1">
              Ver painel completo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <LiveStat icon={BarChart3} label="Demandas recebidas" value="1.840" accent />
            <LiveStat icon={CheckCircle2} label="Taxa de resolução" value="94%" />
            <LiveStat icon={TrendingUp} label="Municípios atendidos" value={12} />
            <LiveStat icon={Calendar} label="Em andamento" value={143} />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="contato" className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 sm:p-14 text-center shadow-elegant">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-glow">Próximo passo</p>
              <h3 className="font-display text-3xl sm:text-5xl font-bold text-primary-foreground mt-3 max-w-2xl mx-auto leading-tight">
                Sua prefeitura pronta para o próximo nível
              </h3>
              <p className="text-primary-foreground/80 mt-4 max-w-xl mx-auto">
                Mostre para os cidadãos que as demandas estão sendo resolvidas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                <Button asChild size="lg" className="bg-accent text-accent-foreground font-bold h-12 px-6 hover:opacity-95">
                  <Link to="/painel">
                    Ver protótipo completo <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-semibold h-12 px-6 bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                  <Link to="/backoffice">Explorar Backoffice</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">FastFix</span>
            <span className="text-xs">· Smart City Platform</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} FastFix · Plataforma de Gestão Urbana Inteligente</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
