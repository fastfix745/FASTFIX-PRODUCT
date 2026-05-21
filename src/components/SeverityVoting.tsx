import { useSeverityVotes, useCastSeverityVote, severityLevels, severityConfig, type SeverityLevel } from "@/hooks/useSeverityVotes";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Users } from "lucide-react";

interface Props {
  problemId: string;
}

const SeverityVoting = ({ problemId }: Props) => {
  const { user } = useAuth();
  const { data, isLoading } = useSeverityVotes(problemId);
  const cast = useCastSeverityVote(problemId);

  const counts = data?.counts ?? { low: 0, medium: 0, high: 0, urgent: 0 };
  const total = data?.total ?? 0;
  const top = data?.topSeverity ?? null;
  const userVote = data?.userVote ?? null;

  const handleVote = (level: SeverityLevel) => {
    if (!user) {
      toast.error("Entre para votar na criticidade desta ocorrência");
      return;
    }
    cast.mutate(level, {
      onSuccess: () =>
        toast.success(
          userVote === level
            ? `Voto mantido como ${severityConfig[level].label}`
            : `Você votou em ${severityConfig[level].label}`,
        ),
      onError: (e) => toast.error("Não foi possível registrar seu voto", { description: (e as Error).message }),
    });
  };

  return (
    <section className="mt-6 pt-5 border-t border-border" aria-labelledby="severity-vote-heading">
      <div className="flex items-center justify-between mb-1">
        <p id="severity-vote-heading" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Criticidade pela comunidade
        </p>
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <Users className="w-3 h-3" />
          {total} {total === 1 ? "voto" : "votos"}
        </span>
      </div>

      {top && total > 0 ? (
        <p className="text-xs text-foreground mb-3">
          Definida como{" "}
          <span className={`font-bold ${severityConfig[top].activeClasses.includes("text-destructive") ? "text-destructive" : severityConfig[top].activeClasses.includes("text-accent") ? "text-accent" : severityConfig[top].activeClasses.includes("text-warning") ? "text-warning" : "text-success"}`}>
            {severityConfig[top].label}
          </span>{" "}
          <span className="text-muted-foreground">[{counts[top]} {counts[top] === 1 ? "voto" : "votos"}]</span>
        </p>
      ) : (
        <p className="text-xs text-muted-foreground mb-3">Seja o primeiro a indicar a gravidade.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {severityLevels.map((level) => {
          const cfg = severityConfig[level];
          const isActive = userVote === level;
          const count = counts[level];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <button
              key={level}
              type="button"
              onClick={() => handleVote(level)}
              disabled={cast.isPending || isLoading}
              aria-pressed={isActive}
              aria-label={`Votar como ${cfg.label}. ${count} ${count === 1 ? "voto" : "votos"}.`}
              className={`relative overflow-hidden rounded-xl border px-3 py-2 text-left transition-all disabled:opacity-60 disabled:cursor-not-allowed
                ${isActive ? cfg.activeClasses : `bg-card ${cfg.classes}`}`}
            >
              <div
                aria-hidden
                className={`absolute inset-y-0 left-0 ${cfg.dot} opacity-10 transition-all`}
                style={{ width: `${pct}%` }}
              />
              <div className="relative flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} aria-hidden />
                  {cfg.label}
                </span>
                <span className="text-[11px] font-semibold tabular-nums">{count}</span>
              </div>
            </button>
          );
        })}
      </div>

      {userVote && (
        <p className="text-[10px] text-muted-foreground mt-2">
          Seu voto: <span className="font-semibold text-foreground">{severityConfig[userVote].label}</span> · Você pode alterar a qualquer momento.
        </p>
      )}
    </section>
  );
};

export default SeverityVoting;
