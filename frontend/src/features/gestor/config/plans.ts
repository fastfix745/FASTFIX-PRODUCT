import { Building2, Sparkles, Crown } from "lucide-react";

export type Plan = {
  id: string;
  name: string;
  icon: typeof Building2;
  tagline: string;
  monthly: number;
  annual: number;
  highlight: boolean;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "essencial",
    name: "Essencial",
    icon: Building2,
    tagline: "Para pequenos municípios começarem a ouvir o cidadão.",
    monthly: 499,
    annual: 4990, // 2 meses grátis
    highlight: false,
    features: [
      "Até 5.000 denúncias/mês",
      "Painel de KPIs em tempo real",
      "Mapa de calor por categoria",
      "1 gestor + 3 operadores",
      "Suporte por e-mail (48h)",
    ],
  },
  {
    id: "profissional",
    name: "Profissional",
    icon: Sparkles,
    tagline: "Para prefeituras que querem transformar dados em ação.",
    monthly: 1299,
    annual: 12990,
    highlight: true,
    features: [
      "Denúncias ilimitadas",
      "Heatmaps + Índice de Infraestrutura",
      "Showcase Antes/Depois público",
      "Até 15 gestores e equipes",
      "Notificações em tempo real",
      "Integração com SLA municipal",
      "Suporte prioritário (12h)",
    ],
  },
  {
    id: "metropolitano",
    name: "Metropolitano",
    icon: Crown,
    tagline: "Para capitais e regiões metropolitanas com alto volume.",
    monthly: 3490,
    annual: 34900,
    highlight: false,
    features: [
      "Tudo do Profissional",
      "Multi-secretarias e sub-regiões",
      "API e exportação BI dedicada",
      "Onboarding e treinamento presencial",
      "SLA garantido em contrato",
      "Gerente de sucesso dedicado",
    ],
  },
];
