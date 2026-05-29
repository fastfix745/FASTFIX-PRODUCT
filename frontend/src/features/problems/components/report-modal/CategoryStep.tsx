import { ProblemCategory, Severity, categoryConfig, severityConfig } from "@/features/problems/config/problems";

interface CategoryStepProps {
  category: ProblemCategory | null;
  setCategory: (category: ProblemCategory) => void;
  severity: Severity;
  setSeverity: (severity: Severity) => void;
}

export const CategoryStep = ({
  category,
  setCategory,
  severity,
  setSeverity,
}: CategoryStepProps) => {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(categoryConfig) as [ProblemCategory, typeof categoryConfig[ProblemCategory]][]).map(([key, config]) => {
          const Icon = config.icon;
          const active = category === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-semibold
                ${active ? "border-accent bg-accent/10 text-accent shadow-sm" : "border-border bg-card text-muted-foreground hover:border-accent/40"}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-center leading-tight">{config.label}</span>
            </button>
          );
        })}
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severidade</label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {(Object.entries(severityConfig) as [Severity, typeof severityConfig[Severity]][]).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSeverity(key)}
              className={`px-2 py-2 rounded-lg text-xs font-bold transition-all
                ${severity === key ? config.className : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
