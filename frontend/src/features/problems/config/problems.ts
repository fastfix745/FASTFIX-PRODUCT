import {
  MapPin, AlertTriangle, Lightbulb, Construction, Droplets, TreePine,
  Trash2, Car, ShieldAlert, Signpost,
} from "lucide-react";

export type ProblemCategory =
  | "buraco" | "iluminacao" | "calcada" | "saneamento" | "area_verde"
  | "lixo" | "transito" | "seguranca" | "sinalizacao" | "outro";
export type Severity = "critical" | "high" | "medium" | "low";
export type Status = "pending" | "in_progress" | "resolved";

export const categoryConfig: Record<ProblemCategory, { label: string; icon: typeof MapPin; color: string }> = {
  buraco:      { label: "Buracos",          icon: AlertTriangle, color: "text-severity-critical" },
  iluminacao:  { label: "Iluminação",       icon: Lightbulb,     color: "text-severity-high" },
  calcada:     { label: "Calçadas",         icon: Construction,  color: "text-severity-medium" },
  saneamento:  { label: "Vazamentos",       icon: Droplets,      color: "text-severity-critical" },
  area_verde:  { label: "Praças",           icon: TreePine,      color: "text-severity-low" },
  lixo:        { label: "Lixo",             icon: Trash2,        color: "text-severity-medium" },
  transito:    { label: "Trânsito",         icon: Car,           color: "text-severity-high" },
  seguranca:   { label: "Segurança",        icon: ShieldAlert,   color: "text-severity-critical" },
  sinalizacao: { label: "Sinalização",      icon: Signpost,      color: "text-severity-medium" },
  outro:       { label: "Outro",            icon: MapPin,        color: "text-muted-foreground" },
};

export const severityConfig: Record<Severity, { label: string; className: string }> = {
  critical: { label: "Crítico", className: "bg-severity-critical text-white" },
  high:     { label: "Alto",    className: "bg-severity-high text-white" },
  medium:   { label: "Médio",   className: "bg-severity-medium text-white" },
  low:      { label: "Baixo",   className: "bg-severity-low text-white" },
};

export const statusConfig: Record<Status, { label: string; className: string }> = {
  pending:     { label: "Pendente",     className: "bg-severity-high/15 text-severity-high" },
  in_progress: { label: "Em Andamento", className: "bg-severity-medium/15 text-severity-medium" },
  resolved:    { label: "Resolvido",    className: "bg-severity-low/15 text-severity-low" },
};

/** Format ISO date to Brazilian dd/mm/yyyy */
export function formatDateBR(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Format ISO date to dd/mm/yyyy HH:mm */
export function formatDateTimeBR(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/** Relative time ("há 2 dias") */
export function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return iso;
  const diff = Date.now() - d;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const days = Math.floor(h / 24);
  if (days < 30) return `há ${days}d`;
  const mo = Math.floor(days / 30);
  return `há ${mo} mês${mo > 1 ? "es" : ""}`;
}
