import { memo } from "react";
import { Users } from "lucide-react";

interface PillarProps {
  icon: typeof Users;
  title: string;
  desc: string;
}

export const Pillar = memo(({ icon: Icon, title, desc }: PillarProps) => (
  <div className="glass-card glass-card-hover rounded-2xl p-6 animate-fade-in-up">
    <div className="w-11 h-11 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow mb-4">
      <Icon className="w-5 h-5 text-accent-foreground" />
    </div>
    <h4 className="font-display font-bold text-foreground text-lg">{title}</h4>
    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
  </div>
));

Pillar.displayName = "Pillar";
