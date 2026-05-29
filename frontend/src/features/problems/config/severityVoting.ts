import type { SeverityLevel } from "@/types/severity";

export const severityConfig: Record<SeverityLevel, { label: string; classes: string; activeClasses: string; dot: string }> = {
  low: {
    label: "Baixa",
    classes: "border-success/30 text-success hover:bg-success/10",
    activeClasses: "bg-success/15 border-success text-success ring-2 ring-success/40",
    dot: "bg-success",
  },
  medium: {
    label: "Média",
    classes: "border-warning/30 text-warning hover:bg-warning/10",
    activeClasses: "bg-warning/15 border-warning text-warning ring-2 ring-warning/40",
    dot: "bg-warning",
  },
  high: {
    label: "Alta",
    classes: "border-accent/30 text-accent hover:bg-accent/10",
    activeClasses: "bg-accent/15 border-accent text-accent ring-2 ring-accent/40",
    dot: "bg-accent",
  },
  critical: {
    label: "Urgente",
    classes: "border-destructive/30 text-destructive hover:bg-destructive/10",
    activeClasses: "bg-destructive/15 border-destructive text-destructive ring-2 ring-destructive/40",
    dot: "bg-destructive",
  },
};
