import { memo } from "react";

interface StatProps {
  label: string;
  value: string | number;
}

export const Stat = memo(({ label, value }: StatProps) => (
  <div>
    <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">{label}</p>
  </div>
));

Stat.displayName = "Stat";
