import { memo } from "react";
import { ArrowUpDown, TrendingUp } from "lucide-react";
import { Problem } from "@/features/problems/hooks/useProblems";

interface PriorityListProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
}

export const PriorityList = memo(({ problems, onSelectProblem }: PriorityListProps) => {
  const sortedProblems = [...problems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-accent" /> Prioridade por Apoios
      </h3>
      <div className="space-y-3">
        {sortedProblems.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectProblem(p)}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 text-left transition-colors"
          >
            <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{p.title}</p>
              <p className="text-[10px] text-muted-foreground">{p.address}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-accent shrink-0">
              <TrendingUp className="w-3 h-3" />
              {p.upvotes}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

PriorityList.displayName = "PriorityList";
