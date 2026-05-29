import { memo } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { type Plan } from "../config/plans";

interface PlanCardProps {
  plan: Plan;
  cycle: "monthly" | "annual";
  fmtBRL: (v: number) => string;
}

export const PlanCard = memo(({ plan, cycle, fmtBRL }: PlanCardProps) => {
  const Icon = plan.icon;
  const price = cycle === "monthly" ? plan.monthly : Math.round(plan.annual / 12);
  const billed = cycle === "monthly" ? "Cobrado mensalmente" : `Cobrado ${fmtBRL(plan.annual)} por ano`;

  return (
    <article
      className={`relative rounded-3xl p-6 sm:p-7 border transition-all ${
        plan.highlight
          ? "bg-card border-accent/40 shadow-elegant md:scale-[1.03]"
          : "glass-card border-border hover:border-accent/30"
      }`}
    >
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-accent text-accent-foreground shadow-glow">
            <Sparkles className="w-3 h-3" /> Mais escolhido
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
            plan.highlight ? "bg-gradient-accent text-accent-foreground" : "bg-accent/10 text-accent"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">{plan.name}</h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-3 leading-relaxed min-h-[40px]">
        {plan.tagline}
      </p>

      <div className="mt-5">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-4xl font-bold text-foreground">{fmtBRL(price)}</span>
          <span className="text-sm text-muted-foreground">/mês</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">{billed}</p>
      </div>

      <Button
        className={`w-full mt-5 h-11 font-bold ${
          plan.highlight
            ? "bg-gradient-accent text-accent-foreground shadow-glow"
            : "bg-foreground text-background hover:opacity-90"
        }`}
      >
        Assinar {plan.name}
      </Button>

      <ul className="mt-6 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-foreground">
            <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </article>
  );
});

PlanCard.displayName = "PlanCard";
