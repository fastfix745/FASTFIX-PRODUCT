import { memo } from "react";
import { Link } from "react-router-dom";
import { Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface SolutionCardProps {
  eyebrow: string;
  icon: typeof Users;
  title: string;
  items: string[];
  cta: { label: string; to: string };
  variant: "primary" | "accent";
}

export const SolutionCard = memo(({
  eyebrow,
  icon: Icon,
  title,
  items,
  cta,
  variant,
}: SolutionCardProps) => (
  <div
    className={`relative rounded-3xl p-8 overflow-hidden border ${
      variant === "primary"
        ? "bg-gradient-primary text-primary-foreground border-transparent shadow-elegant"
        : "glass-card border-border"
    }`}
  >
    <div className="absolute inset-0 bg-grid-pattern opacity-5" />
    <div className="relative">
      <p className={`text-xs font-bold uppercase tracking-widest ${variant === "primary" ? "text-accent-glow" : "text-accent"}`}>
        {eyebrow}
      </p>
      <div className="flex items-center gap-3 mt-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            variant === "primary" ? "bg-primary-foreground/15" : "bg-gradient-accent shadow-glow"
          }`}
        >
          <Icon className={`w-6 h-6 ${variant === "primary" ? "text-primary-foreground" : "text-accent-foreground"}`} />
        </div>
        <h4 className={`font-display text-2xl font-bold ${variant === "primary" ? "text-primary-foreground" : "text-foreground"}`}>
          {title}
        </h4>
      </div>
      <ul className="mt-6 space-y-2.5">
        {items.map((it) => (
          <li
            key={it}
            className={`flex items-start gap-2.5 text-sm ${
              variant === "primary" ? "text-primary-foreground/85" : "text-muted-foreground"
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${variant === "primary" ? "text-accent-glow" : "text-success"}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        className={`mt-7 font-bold ${
          variant === "primary"
            ? "bg-accent text-accent-foreground hover:opacity-95"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        <Link to={cta.to}>
          {cta.label} <ArrowRight className="ml-1.5 w-4 h-4" />
        </Link>
      </Button>
    </div>
  </div>
));

SolutionCard.displayName = "SolutionCard";
