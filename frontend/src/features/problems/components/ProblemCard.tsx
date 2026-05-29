import { memo } from "react";
import { MapPin, ThumbsUp, Clock } from "lucide-react";
import { categoryConfig, severityConfig, statusConfig, timeAgo } from "@/features/problems/config/problems";
import { Problem } from "@/features/problems/hooks/useProblems";

interface ProblemCardProps {
  problem: Problem;
  onUpvote: (id: string) => void;
  onClick?: (problem: Problem) => void;
  compact?: boolean;
}

const ProblemCard = memo(({ problem, onUpvote, onClick, compact = false }: ProblemCardProps) => {
  const category = categoryConfig[problem.category];
  const severity = severityConfig[problem.severity];
  const status = statusConfig[problem.status];
  const Icon = category.icon;

  return (
    <div
      onClick={() => onClick?.(problem)}
      className={`glass-card glass-card-hover rounded-xl p-4 animate-fade-in-up ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl bg-muted/60 ${category.color} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severity.className}`}>
              {severity.label}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
              {status.label}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">{category.label}</span>
          </div>
          <h3 className="font-display font-semibold text-foreground text-sm leading-tight line-clamp-1">
            {problem.title}
          </h3>
          {!compact && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {problem.description}
            </p>
          )}
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{problem.address}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{timeAgo(problem.createdAt)}</span>
          <span className="ml-1 truncate">• {problem.reporterName}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onUpvote(problem.id); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all
            ${problem.hasUpvoted
              ? "bg-accent text-accent-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent/15 hover:text-accent"
            }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{problem.upvotes}</span>
        </button>
      </div>
    </div>
  );
});

export default ProblemCard;
