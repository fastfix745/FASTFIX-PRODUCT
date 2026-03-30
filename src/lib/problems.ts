import { useState } from "react";
import { MapPin, AlertTriangle, Lightbulb, Construction, Droplets, TreePine } from "lucide-react";

export type ProblemCategory = "buraco" | "iluminacao" | "calcada" | "saneamento" | "area_verde" | "outro";
export type Severity = "critical" | "high" | "medium" | "low";
export type Status = "pending" | "in_progress" | "resolved";

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: ProblemCategory;
  severity: Severity;
  status: Status;
  upvotes: number;
  hasUpvoted: boolean;
  lat: number;
  lng: number;
  address: string;
  createdAt: string;
  imageUrl?: string;
  reporterName: string;
}

export const categoryConfig: Record<ProblemCategory, { label: string; icon: typeof MapPin; color: string }> = {
  buraco: { label: "Buraco na Via", icon: AlertTriangle, color: "text-severity-critical" },
  iluminacao: { label: "Iluminação", icon: Lightbulb, color: "text-severity-high" },
  calcada: { label: "Calçada Danificada", icon: Construction, color: "text-severity-medium" },
  saneamento: { label: "Saneamento", icon: Droplets, color: "text-severity-critical" },
  area_verde: { label: "Área Verde", icon: TreePine, color: "text-severity-low" },
  outro: { label: "Outro", icon: MapPin, color: "text-muted-foreground" },
};

export const severityConfig: Record<Severity, { label: string; className: string }> = {
  critical: { label: "Crítico", className: "bg-severity-critical text-white" },
  high: { label: "Alto", className: "bg-severity-high text-white" },
  medium: { label: "Médio", className: "bg-severity-medium text-white" },
  low: { label: "Baixo", className: "bg-severity-low text-white" },
};

export const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-severity-high/15 text-severity-high" },
  in_progress: { label: "Em Andamento", className: "bg-severity-medium/15 text-severity-medium" },
  resolved: { label: "Resolvido", className: "bg-severity-low/15 text-severity-low" },
};

export const mockProblems: Problem[] = [
  {
    id: "1", title: "Buraco enorme na Av. Beira Mar", description: "Buraco de quase 1 metro na pista principal, causando acidentes.", category: "buraco", severity: "critical", status: "pending", upvotes: 47, hasUpvoted: false, lat: -3.7227, lng: -38.5270, address: "Av. Beira Mar, 120 - Meireles, Fortaleza", createdAt: "2026-03-20", reporterName: "Ricardo S.",
  },
  {
    id: "2", title: "Poste sem iluminação na Rua 24 de Maio", description: "Trecho de 200m completamente escuro à noite, gerando insegurança.", category: "iluminacao", severity: "high", status: "in_progress", upvotes: 32, hasUpvoted: true, lat: -3.7172, lng: -38.5433, address: "Rua 24 de Maio, 500 - Centro, Fortaleza", createdAt: "2026-03-18", reporterName: "Beatriz M.",
  },
  {
    id: "3", title: "Calçada quebrada na Praça do Ferreira", description: "Calçada com diversos buracos, idosos já caíram no local.", category: "calcada", severity: "medium", status: "pending", upvotes: 21, hasUpvoted: false, lat: -7.2131, lng: -39.3266, address: "Praça do Ferreira - Centro, Juazeiro do Norte", createdAt: "2026-03-22", reporterName: "Jorge A.",
  },
  {
    id: "4", title: "Esgoto a céu aberto no Bairro Aldeota", description: "Vazamento de esgoto na esquina, mau cheiro e risco de doenças.", category: "saneamento", severity: "critical", status: "pending", upvotes: 56, hasUpvoted: false, lat: -3.7340, lng: -38.5090, address: "Rua Torres Câmara, 45 - Aldeota, Fortaleza", createdAt: "2026-03-15", reporterName: "Maria L.",
  },
  {
    id: "5", title: "Praça degradada sem manutenção", description: "Brinquedos quebrados, mato alto e bancos destruídos.", category: "area_verde", severity: "low", status: "resolved", upvotes: 15, hasUpvoted: true, lat: -3.6910, lng: -40.3500, address: "Praça da Sé - Centro, Sobral", createdAt: "2026-03-10", reporterName: "Ana C.",
  },
];
