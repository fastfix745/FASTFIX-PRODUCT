import { useState } from "react";
import { Map, BarChart3, List, Plus, User, Bell, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { mockProblems, Problem } from "@/lib/problems";
import MapView from "@/components/MapView";
import ProblemCard from "@/components/ProblemCard";
import Dashboard from "@/components/Dashboard";
import ReportModal from "@/components/ReportModal";

type Tab = "map" | "list" | "dashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const handleUpvote = (id: string) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, upvotes: p.hasUpvoted ? p.upvotes - 1 : p.upvotes + 1, hasUpvoted: !p.hasUpvoted }
          : p
      )
    );
  };

  const tabs: { key: Tab; label: string; icon: typeof Map }[] = [
    { key: "map", label: "Mapa", icon: Map },
    { key: "list", label: "Reportes", icon: List },
    { key: "dashboard", label: "Painel", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground safe-area-top">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Map className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold leading-tight">InfraZeladoria</h1>
            <p className="text-[10px] opacity-75">Sua cidade, sua voz</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-severity-critical" />
          </button>
          <Link
            to="/gestor"
            className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            Gestor
          </Link>
          <button className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === "map" && (
          <div className="h-full relative">
            <MapView problems={problems} onSelectProblem={setSelectedProblem} />
            {/* Selected problem overlay */}
            {selectedProblem && (
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="relative">
                  <button
                    onClick={() => setSelectedProblem(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs z-10"
                  >
                    ×
                  </button>
                  <ProblemCard problem={selectedProblem} onUpvote={handleUpvote} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "list" && (
          <div className="h-full overflow-y-auto p-4 space-y-3 pb-24">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-lg font-bold text-foreground">Reportes Recentes</h2>
              <span className="text-xs text-muted-foreground font-medium">{problems.length} problemas</span>
            </div>
            {problems
              .sort((a, b) => b.upvotes - a.upvotes)
              .map((problem) => (
                <ProblemCard key={problem.id} problem={problem} onUpvote={handleUpvote} />
              ))}
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="h-full overflow-y-auto p-4 pb-24">
            <Dashboard />
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setReportOpen(true)}
        className="fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Bottom nav */}
      <nav className="flex items-center justify-around px-4 py-2 bg-card border-t border-border safe-area-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-lg transition-colors
                ${isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
};

export default Index;
