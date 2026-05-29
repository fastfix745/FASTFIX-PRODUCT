import { memo } from "react";

interface MiniKpiProps {
  label: string;
  value: number;
  color: string;
  bg: string;
}

export const MiniKpi = memo(({ label, value, color, bg }: MiniKpiProps) => (
  <div className={`rounded-xl ${bg} p-2.5`}>
    <p className={`text-lg font-display font-bold ${color}`}>{value}</p>
    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
  </div>
));

MiniKpi.displayName = "MiniKpi";
