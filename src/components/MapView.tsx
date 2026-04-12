import { severityConfig } from "@/lib/problems";
import { Problem } from "@/hooks/useProblems";

interface MapViewProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
}

const severityPinColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

const MapView = ({ problems, onSelectProblem }: MapViewProps) => {
  // Simulated map — positions are relative within the container
  const positions = [
    { top: "25%", left: "35%" },
    { top: "40%", left: "60%" },
    { top: "55%", left: "25%" },
    { top: "30%", left: "72%" },
    { top: "65%", left: "50%" },
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-primary/5 via-accent/5 to-muted rounded-lg overflow-hidden">
      {/* Simulated map grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Simulated roads */}
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
        <line x1="40%" y1="0" x2="40%" y2="100%" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
        <line x1="70%" y1="0" x2="70%" y2="100%" stroke="currentColor" strokeWidth="1.5" className="text-primary/15" />
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="currentColor" strokeWidth="1.5" className="text-primary/15" />
        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="currentColor" strokeWidth="1" className="text-primary/10" />
      </svg>

      {/* Map labels */}
      <span className="absolute top-[15%] left-[10%] text-[10px] font-body text-muted-foreground/40 uppercase tracking-widest">Meireles</span>
      <span className="absolute top-[60%] left-[70%] text-[10px] font-body text-muted-foreground/40 uppercase tracking-widest">Aldeota</span>
      <span className="absolute top-[80%] left-[15%] text-[10px] font-body text-muted-foreground/40 uppercase tracking-widest">Benfica</span>

      {/* Problem pins */}
      {problems.slice(0, 5).map((problem, index) => {
        const pos = positions[index] || { top: "50%", left: "50%" };
        const color = severityPinColors[problem.severity] || "#94a3b8";
        const isResolved = problem.status === "resolved";

        return (
          <button
            key={problem.id}
            onClick={() => onSelectProblem(problem)}
            className="absolute transform -translate-x-1/2 -translate-y-full group z-10"
            style={{ top: pos.top, left: pos.left }}
          >
            {/* Pulse ring */}
            {!isResolved && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full animate-pulse-pin opacity-30"
                style={{ backgroundColor: color }}
              />
            )}
            {/* Pin */}
            <div className="relative flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-card transition-transform group-hover:scale-110"
                style={{ backgroundColor: color }}
              >
                <span className="text-[10px] font-bold text-white">{problem.upvotes}</span>
              </div>
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent -mt-[2px]" style={{ borderTopColor: color }} />
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="glass-card rounded-md px-3 py-2 whitespace-nowrap text-xs font-medium text-foreground shadow-xl">
                {problem.title}
              </div>
            </div>
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-card rounded-lg p-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Severidade</p>
        <div className="flex gap-3">
          {Object.entries(severityPinColors).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-muted-foreground capitalize">{severityConfig[key as keyof typeof severityConfig]?.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
