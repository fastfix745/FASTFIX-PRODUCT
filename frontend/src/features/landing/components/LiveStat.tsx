import { memo } from "react";
import { Users } from "lucide-react";

interface LiveStatProps {
  icon: typeof Users;
  label: string;
  value: string | number;
  accent?: boolean;
}

export const LiveStat = memo(({ icon: Icon, label, value, accent }: LiveStatProps) => (
  <div
    className={`rounded-2xl p-6 border animate-fade-in-up ${
      accent ? "bg-gradient-primary text-primary-foreground border-transparent shadow-elegant" : "glass-card border-border"
    }`}
  >
    <Icon className={`w-5 h-5 ${accent ? "text-accent-glow" : "text-accent"}`} />
    <p className={`font-display text-3xl font-bold mt-3 ${accent ? "text-primary-foreground" : "text-foreground"}`}>
      {value}
    </p>
    <p className={`text-xs font-semibold mt-1 ${accent ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
      {label}
    </p>
  </div>
));

LiveStat.displayName = "LiveStat";
