// Tipos para as demandas da prefeitura
export interface Demanda {
  id: string;
  protocolo: string;
  titulo: string;
  descricao: string;
  categoria: "vias" | "iluminacao" | "saneamento" | "limpeza" | "outros";
  status: "pending" | "in_progress" | "resolved";
  prioridade: "alta" | "media" | "baixa";
  secretaria: "obras" | "iluminacao" | "saneamento" | "limpeza" | "geral";
  endereco: string;
  referencia: string;
  nomeCidadao: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// Dados mensais mockados para o painel público
export interface DadosMensais {
  mes: string;
  mesNumero: number;
  ano: number;
  resolvidas: number;
  total: number;
  porCategoria: {
    vias: { resolvidas: number; total: number };
    iluminacao: { resolvidas: number; total: number };
    saneamento: { resolvidas: number; total: number };
    limpeza: { resolvidas: number; total: number };
  };
}

// Gera dados mensais dos últimos 6 meses
export const generateMonthlyData = (): DadosMensais[] => {
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const data: DadosMensais[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mesNumero = d.getMonth() + 1;
    const ano = d.getFullYear();

    // Números realistas para uma cidade média brasileira (~150mil habitantes)
    const baseResolved = 45 + Math.floor(Math.random() * 40);
    const baseTotal = baseResolved + Math.floor(Math.random() * 80);

    data.push({
      mes: meses[mesNumero - 1],
      mesNumero,
      ano,
      resolvidas: baseResolved,
      total: baseTotal,
      porCategoria: {
        vias: {
          resolvidas: Math.floor(baseResolved * 0.35),
          total: Math.floor(baseTotal * 0.32)
        },
        iluminacao: {
          resolvidas: Math.floor(baseResolved * 0.25),
          total: Math.floor(baseTotal * 0.28)
        },
        saneamento: {
          resolvidas: Math.floor(baseResolved * 0.20),
          total: Math.floor(baseTotal * 0.22)
        },
        limpeza: {
          resolvidas: Math.floor(baseResolved * 0.20),
          total: Math.floor(baseTotal * 0.18)
        }
      }
    });
  }

  return data;
};

// Dados das demandas para o backoffice
export const demandasMock: Demanda[] = [
  {
    id: "1",
    protocolo: "PFX-2026-4521",
    titulo: "Buraco grande na Av. Principal",
    descricao: "Buraco de aproximadamente 50cm no meio da pista, próximo ao mercado municipal. Muito perigoso para motociclistas.",
    categoria: "vias",
    status: "pending",
    prioridade: "alta",
    secretaria: "obras",
    endereco: "Av. Principal, 234",
    referencia: "Em frente ao Mercado Municipal",
    nomeCidadao: "José Silva",
    cpf: "123.456.789-00",
    telefone: "(85) 99999-1111",
    email: "jose@email.com",
    createdAt: "2026-06-15T10:30:00Z",
    updatedAt: "2026-06-15T10:30:00Z"
  },
  {
    id: "2",
    protocolo: "PFX-2026-4518",
    titulo: " poste sem luz há 3 dias",
    descricao: "Poste com lâmpada queimada, deixando a rua completamente escura à noite. several assaltos na área.",
    categoria: "iluminacao",
    status: "in_progress",
    prioridade: "alta",
    secretaria: "iluminacao",
    endereco: "Rua das Flores, 45",
    referencia: "Próximo ao ponto de ônibus",
    nomeCidadao: "Maria Santos",
    telefone: "(85) 99999-2222",
    createdAt: "2026-06-14T08:15:00Z",
    updatedAt: "2026-06-16T14:20:00Z"
  },
  {
    id: "3",
    protocolo: "PFX-2026-4505",
    titulo: "Vazamento de esgoto",
    descricao: "Vazamento de esgoto há mais de uma semana, causando mau cheiro e atraindo mosquitos.",
    categoria: "saneamento",
    status: "in_progress",
    prioridade: "media",
    secretaria: "saneamento",
    endereco: "Rua do Sol, 112",
    referencia: "Ao lado da escola",
    nomeCidadao: "Pedro Oliveira",
    cpf: "987.654.321-00",
    createdAt: "2026-06-10T16:45:00Z",
    updatedAt: "2026-06-12T09:30:00Z"
  },
  {
    id: "4",
    protocolo: "PFX-2026-4498",
    titulo: "Lixo acumulado na rua",
    descricao: "Lixo não coletado há 2 semanas, acumulo de sacolas e entulhos.",
    categoria: "limpeza",
    status: "resolved",
    prioridade: "baixa",
    secretaria: "limpeza",
    endereco: "Av. Getúlio Vargas, 890",
    referencia: "Esquina com Rua Nova",
    nomeCidadao: "Ana Costa",
    email: "ana@email.com",
    createdAt: "2026-06-05T11:00:00Z",
    updatedAt: "2026-06-08T15:00:00Z"
  },
  {
    id: "5",
    protocolo: "PFX-2026-4492",
    titulo: "Buraco em rua residencial",
    descricao: "Pequeño buraco na entrada da residencial, já causou danos a um carro.",
    categoria: "vias",
    status: "pending",
    prioridade: "media",
    secretaria: "obras",
    endereco: "Residencial Verde, Rua 3",
    referencia: "Portão 5",
    nomeCidadao: "Carlos Souza",
    telefone: "(85) 99999-3333",
    createdAt: "2026-06-03T09:20:00Z",
    updatedAt: "2026-06-03T09:20:00Z"
  },
  {
    id: "6",
    protocolo: "PFX-2026-4487",
    titulo: "Lâmpada piscando",
    descricao: "Lâmpada de poste fica piscando toda noite, perturbando o sono dos moradores.",
    categoria: "iluminacao",
    status: "resolved",
    prioridade: "baixa",
    secretaria: "iluminacao",
    endereco: "Rua Belo Horizonte, 78",
    referencia: "Em frente à farmácia",
    nomeCidadao: "Fernanda Lima",
    email: "fernanda@email.com",
    createdAt: "2026-06-01T20:30:00Z",
    updatedAt: "2026-06-04T10:00:00Z"
  },
  {
    id: "7",
    protocolo: "PFX-2026-4475",
    titulo: "Bueiro entupido",
    descricao: "Bueiro completamente entupido, causing alagamento em dias de chuva.",
    categoria: "saneamento",
    status: "pending",
    prioridade: "alta",
    secretaria: "saneamento",
    endereco: "Av. Norte, 567",
    referencia: "Próximo ao cinema",
    nomeCidadao: "Roberto Alves",
    createdAt: "2026-05-28T14:10:00Z",
    updatedAt: "2026-05-28T14:10:00Z"
  },
  {
    id: "8",
    protocolo: "PFX-2026-4463",
    titulo: "Calçada quebrada",
    descricao: "Calçada com inúmeras irregularidades, perigo para pedestres.",
    categoria: "vias",
    status: "in_progress",
    prioridade: "media",
    secretaria: "obras",
    endereco: "Rua Central, 201",
    referencia: "Ao lado do banco",
    nomeCidadao: "Juliana Martins",
    telefone: "(85) 99999-4444",
    createdAt: "2026-05-25T08:45:00Z",
    updatedAt: "2026-05-30T11:20:00Z"
  },
  {
    id: "9",
    protocolo: "PFX-2026-4450",
    titulo: "Animais mortos na via",
    descricao: "Animal atropelado há dias sem remoção, cheiro horrível.",
    categoria: "limpeza",
    status: "resolved",
    prioridade: "media",
    secretaria: "limpeza",
    endereco: "Rodovia Velha, km 45",
    referencia: "Posto de gasolina",
    nomeCidadao: "Marcos Paulo",
    createdAt: "2026-05-20T16:00:00Z",
    updatedAt: "2026-05-22T09:00:00Z"
  },
  {
    id: "10",
    protocolo: "PFX-2026-4438",
    titulo: "Falta de iluminação",
    descricao: "Trecho de 200m sem nenhuma iluminação pública.",
    categoria: "iluminacao",
    status: "pending",
    prioridade: "alta",
    secretaria: "iluminacao",
    endereco: "Rua Nova Esperança, 50-150",
    referencia: "Próximo à igreja",
    nomeCidadao: "Luciana Ribeiro",
    telefone: "(85) 99999-5555",
    email: "luciana@email.com",
    createdAt: "2026-05-15T19:30:00Z",
    updatedAt: "2026-05-15T19:30:00Z"
  },
  {
    id: "11",
    protocolo: "PFX-2026-4425",
    titulo: "Esgoto a céu aberto",
    descricao: "Esgoto escorrendo a céu aberto, contaminação do solo.",
    categoria: "saneamento",
    status: "in_progress",
    prioridade: "alta",
    secretaria: "saneamento",
    endereco: "Rua do Barreiro, 33",
    referencia: "Fundos do mercado",
    nomeCidadao: "Paulo Henrique",
    createdAt: "2026-05-10T10:15:00Z",
    updatedAt: "2026-05-18T14:00:00Z"
  },
  {
    id: "12",
    protocolo: "PFX-2026-4410",
    titulo: "Poda de árvore necessária",
    descricao: "Árvore com galhos muito grandes, encostando em fios de luz.",
    categoria: "limpeza",
    status: "resolved",
    prioridade: "baixa",
    secretaria: "limpeza",
    endereco: "Av. Paulista, 445",
    referencia: "Esquina com Rua 15",
    nomeCidadao: "Beatriz Santos",
    email: "beatriz@email.com",
    createdAt: "2026-05-05T07:30:00Z",
    updatedAt: "2026-05-07T16:45:00Z"
  }
];

// Tipos de problema para o registro de demanda
export const tiposProblema = [
  { id: "vias", titulo: "Buraco na via", icone: "🛣️", descricao: "Problemas no asfalto, calçadas e vias públicas" },
  { id: "iluminacao", titulo: "Iluminação", icone: "💡", descricao: "Lâmpadas queimadas, postes sem luz" },
  { id: "saneamento", titulo: "Esgoto", icone: "🚿", descricao: "Vazamentos, bueiros entupidos, esgoto" },
  { id: "limpeza", titulo: "Lixo", icone: "🗑️", descricao: "Coleta, entulhos, limpeza urbana" },
  { id: "outros", titulo: "Outros", icone: "📋", descricao: "Outros problemas públicos" }
] as const;

// Secretarias
export const secretarias = [
  { id: "obras", nome: "Obras", cor: "bg-blue-500" },
  { id: "iluminacao", nome: "Iluminação", cor: "bg-yellow-500" },
  { id: "saneamento", nome: "Saneamento", cor: "bg-cyan-500" },
  { id: "limpeza", nome: "Limpeza Urbana", cor: "bg-green-500" },
  { id: "geral", nome: "Geral", cor: "bg-gray-500" }
] as const;

// Gera protocolo aleatório
export const gerarProtocolo = (): string => {
  const numero = Math.floor(Math.random() * 9000) + 1000;
  return `PFX-${new Date().getFullYear()}-${numero}`;
};