import { MapPin, ThumbsUp, Clock } from "lucide-react";
import { categoryConfig, severityConfig, statusConfig } from "@/lib/problems";
import { Problem } from "@/hooks/useProblems";
import { Badge } from "@/components/ui/badge";

interface ProblemCardProps {
  problem: Problem;
  onUpvote: (id: string) => void;
  compact?: boolean;
}

const ProblemCard = ({ problem, onUpvote, compact = false }: ProblemCardProps) => {
  const category = categoryConfig[problem.category];
  const severity = severityConfig[problem.severity];
  const status = statusConfig[problem.status];
  const Icon = category.icon;

  return (
    <div className="glass-card rounded-lg p-4 animate-slide-up hover:shadow-xl transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-muted ${category.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severity.className}`}>
              {severity.label}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}>
              {status.label}
            </span>
          </div>
          <h3 className="font-display font-semibold text-foreground text-sm leading-tight truncate">
            {problem.title}
          </h3>
          {!compact && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {problem.description}
            </p>
          )}
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{problem.address}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{problem.createdAt}</span>
          <span className="ml-1">• {problem.reporterName}</span>
        </div>
        <button
          onClick={() => onUpvote(problem.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
            ${problem.hasUpvoted
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent/20 hover:text-accent"
            }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{problem.upvotes}</span>
        </button>
      </div>
    </div>
  );
};

export default ProblemCard;
