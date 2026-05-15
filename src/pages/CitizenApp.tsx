import { useState } from "react";
import { Map as MapIcon, BarChart3, List, Plus, Shield, ArrowLeft, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useProblems, useToggleUpvote, Problem } from "@/hooks/useProblems";
import MapView from "@/components/MapView";
import ProblemCard from "@/components/ProblemCard";
import Dashboard from "@/components/Dashboard";
import ReportModal from "@/components/ReportModal";
import ProblemTimeline from "@/components/ProblemTimeline";
import NotificationBell from "@/components/NotificationBell";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { categoryConfig } from "@/lib/problems";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type Tab = "map" | "list" | "dashboard";

const CitizenApp = () => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [detailProblem, setDetailProblem] = useState<Problem | null>(null);

  const { data: problems = [], isLoading } = useProblems();
  const toggleUpvote = useToggleUpvote();

  const handleUpvote = (id: string) => {
    const problem = problems.find((p) => p.id === id);
    if (!problem) return;
    toggleUpvote.mutate(
      { problemId: id, hasUpvoted: problem.hasUpvoted },
      { onError: (e) => toast.error("Faça login para apoiar", { description: (e as Error).message }) }
    );
  };

  const tabs: { key: Tab; label: string; icon: typeof MapIcon }[] = [
    { key: "map", label: "Mapa", icon: MapIcon },
    { key: "list", label: "Reportes", icon: List },
    { key: "dashboard", label: "Painel", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between px-4 py-3 bg-gradient-primary text-primary-foreground shadow-elegant">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <MapIcon className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold leading-tight">FastFix</h1>
            <p className="text-[10px] opacity-75">Sua cidade, sua voz</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Início
          </Link>
          <NotificationBell />
          {user ? (
            <>
              <span className="hidden sm:inline text-[11px] opacity-90 px-2">{profile?.city}</span>
              <button onClick={() => signOut()} className="p-2 rounded-lg hover:bg-primary-foreground/10" aria-label="Sair">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
              <LogIn className="w-3.5 h-3.5" /> Entrar
            </Link>
          )}
          <Link
            to="/gestor"
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" /> Gestor
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
              <p className="text-muted-foreground text-sm mt-3">Carregando ocorrências...</p>
            </div>
          </div>
        )}

        {!isLoading && activeTab === "map" && (
          <div className="h-full relative">
            <MapView problems={problems} onSelectProblem={setSelectedProblem} />
            {selectedProblem && (
              <div className="absolute bottom-4 left-4 right-4 z-20 animate-fade-in-up">
                <div className="relative">
                  <button
                    onClick={() => setSelectedProblem(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs z-10"
                    aria-label="Fechar"
                  >×</button>
                  <ProblemCard problem={selectedProblem} onUpvote={handleUpvote} onClick={setDetailProblem} compact />
                </div>
              </div>
            )}
          </div>
        )}

        {!isLoading && activeTab === "list" && (
          <div className="h-full overflow-y-auto p-4 space-y-3 pb-24 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Reportes Recentes</h2>
                <p className="text-xs text-muted-foreground">Ordenados por apoio da comunidade</p>
              </div>
              <span className="text-xs text-muted-foreground font-semibold px-2.5 py-1 rounded-full bg-muted">
                {problems.length} {problems.length === 1 ? "problema" : "problemas"}
              </span>
            </div>
            {problems.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-3">
                  <List className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-foreground font-semibold">Nenhum reporte ainda</p>
                <p className="text-xs text-muted-foreground mt-1">Seja o primeiro a reportar uma ocorrência!</p>
              </div>
            ) : (
              [...problems]
                .sort((a, b) => b.upvotes - a.upvotes)
                .map((problem) => (
                  <ProblemCard key={problem.id} problem={problem} onUpvote={handleUpvote} onClick={setDetailProblem} />
                ))
            )}
          </div>
        )}

        {!isLoading && activeTab === "dashboard" && (
          <div className="h-full overflow-y-auto p-4 pb-24 max-w-3xl mx-auto">
            <Dashboard problems={problems} />
          </div>
        )}
      </main>

      <button
        onClick={() => setReportOpen(true)}
        className="fixed bottom-20 right-4 z-30 w-16 h-16 rounded-2xl bg-gradient-accent text-accent-foreground shadow-glow flex items-center justify-center hover:scale-105 active:scale-95 transition-transform animate-pulse-glow"
        aria-label="Reportar ocorrência"
      >
        <Plus className="w-7 h-7" />
      </button>

      <nav className="flex items-center justify-around px-4 py-2 bg-card/95 backdrop-blur-xl border-t border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-5 rounded-xl transition-all
                ${isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Detail modal */}
      {detailProblem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setDetailProblem(null)} />
          <div className="relative w-full sm:max-w-lg glass-card rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto shadow-elegant">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">Detalhes da Ocorrência</h3>
              <button onClick={() => setDetailProblem(null)} className="p-1.5 rounded-full hover:bg-muted">
                <span className="text-muted-foreground">×</span>
              </button>
            </div>
            {detailProblem.imageUrl && (
              <img src={detailProblem.imageUrl} alt={detailProblem.title} className="w-full h-48 object-cover rounded-2xl mb-4" />
            )}
            <h4 className="font-display font-bold text-foreground text-base">{detailProblem.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{detailProblem.description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              📍 {detailProblem.address} · {categoryConfig[detailProblem.category].label}
            </p>
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Linha do tempo</p>
              <ProblemTimeline problem={detailProblem} />
            </div>
          </div>
        </div>
      )}

      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
};

export default CitizenApp;
