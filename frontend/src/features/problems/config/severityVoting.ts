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
    classes: "border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10",
    activeClasses: "bg-yellow-500/15 border-yellow-500 text-yellow-500 ring-2 ring-yellow-500/40",
    dot: "bg-yellow-500",
  },
  high: {
    label: "Alta",
    classes: "border-orange-500/30 text-orange-500 hover:bg-orange-500/10",
    activeClasses: "bg-orange-500/15 border-orange-500 text-orange-500 ring-2 ring-orange-500/40",
    dot: "bg-orange-500",
  },
  critical: {
    label: "Urgente",
    classes: "border-destructive/30 text-destructive hover:bg-destructive/10",
    activeClasses: "bg-destructive/15 border-destructive text-destructive ring-2 ring-destructive/40",
    dot: "bg-destructive",
  },
};