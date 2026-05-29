import { memo } from "react";
import { Problem } from "@/features/problems/hooks/useProblems";
import BeforeAfterSlider from "@/features/problems/components/BeforeAfterSlider";
import SeverityVoting from "@/features/problems/components/SeverityVoting";
import ProblemTimeline from "@/features/problems/components/ProblemTimeline";
import { categoryConfig } from "@/features/problems/config/problems";

interface CitizenProblemDetailModalProps {
  problem: Problem | null;
  onClose: () => void;
}

export const CitizenProblemDetailModal = memo(({ problem, onClose }: CitizenProblemDetailModalProps) => {
  if (!problem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg glass-card rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto shadow-elegant">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-foreground">Detalhes da Ocorrência</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted" aria-label="Fechar modal">
            <span className="text-muted-foreground text-xl font-bold">×</span>
          </button>
        </div>

        {problem.beforeImages.length > 0 && problem.afterImages.length > 0 ? (
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-success mb-2">Antes & Depois</p>
            <BeforeAfterSlider before={problem.beforeImages[0]} after={problem.afterImages[0]} />
          </div>
        ) : (
          problem.imageUrl && (
            <img
              src={problem.imageUrl}
              alt={problem.title}
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />
          )
        )}

        <h4 className="font-display font-bold text-foreground text-base">{problem.title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{problem.description}</p>
        <p className="text-xs text-muted-foreground mt-2">
          📍 {problem.address} · {categoryConfig[problem.category].label}
        </p>

        <SeverityVoting problemId={problem.id} />

        <div className="mt-6 pt-5 border-t border-border">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Linha do tempo</p>
          <ProblemTimeline problem={problem} />
        </div>
      </div>
    </div>
  );
});

CitizenProblemDetailModal.displayName = "CitizenProblemDetailModal";

export default CitizenProblemDetailModal;
