import { memo } from "react";
import { Flame } from "lucide-react";

export const HeatmapMock = memo(() => {
  const points = [
    { top: "30%", left: "25%", size: "80px", opacity: 0.4, color: "hsl(var(--severity-critical))" },
    { top: "50%", left: "60%", size: "60px", opacity: 0.3, color: "hsl(var(--severity-high))" },
    { top: "40%", left: "45%", size: "100px", opacity: 0.25, color: "hsl(var(--severity-critical))" },
    { top: "65%", left: "30%", size: "50px", opacity: 0.35, color: "hsl(var(--severity-medium))" },
  ];

  return (
    <div className="lg:col-span-2 glass-card rounded-xl p-5">
      <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
        <Flame className="w-4 h-4 text-severity-critical" /> Mapa de Calor — Áreas Críticas
      </h3>
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-br from-primary/5 via-accent/5 to-muted rounded-lg overflow-hidden">
        {points.map((h, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-xl animate-pulse"
            style={{
              top: h.top,
              left: h.left,
              width: h.size,
              height: h.size,
              backgroundColor: h.color,
              opacity: h.opacity,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    </div>
  );
});

HeatmapMock.displayName = "HeatmapMock";
