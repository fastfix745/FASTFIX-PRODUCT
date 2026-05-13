# Evolução FastFix → Plataforma GovTech Smart City

Vou evoluir o FastFix mantendo toda a estrutura atual (rotas, banco, hooks `useProblems`, componentes existentes) e aplicar melhorias em camadas. Para não ficar gigante e ingerenciável, proponho dividir em **3 entregas sequenciais**. Você aprova esta primeira e seguimos.

## Entrega 1 — Identidade Visual + Landing + UX Cidadão (esta etapa)

### 1. Refinamento do Design System (`index.css`, `tailwind.config.ts`)
- Paleta institucional GovTech: azul profundo + azul elétrico de destaque, cinzas neutros modernos, verde para status positivos, laranja/vermelho para urgência.
- Tokens novos: `--gradient-hero`, `--gradient-card`, `--shadow-elegant`, `--shadow-glow`, `--surface-elevated`.
- Animações novas no Tailwind: `fade-in-up`, `scale-in`, `pulse-glow`, `shimmer`, `slide-in-right`.
- Tipografia premium mantendo Space Grotesk + Inter, com escalas refinadas.

### 2. Landing Page institucional (`src/pages/Index.tsx`)
Reestruturar mantendo navegação existente:
- **Hero** premium com slogan "Plataforma Inteligente de Gestão Urbana e Participação Cidadã", mockup ilustrativo de dashboard, CTAs "Agendar Demonstração" + "Ver como Cidadão".
- **Seção Smart City** com 4 pilares (Participação, Inteligência, Transparência, Eficiência).
- **Para Prefeituras / Para Cidadãos** (duas colunas de benefícios).
- **Indicadores ao vivo** (chamados resolvidos, bairros ativos, SLA médio) usando dados reais do `useProblems`.
- **Mapa público + lista** (já existem) reorganizados como "Transparência Pública".
- **Seção CTA final** para demo + footer institucional.

### 3. UX do Cidadão — `ReportModal` simplificado
Fluxo em 4 passos visuais (foto → localização automática → categoria → enviar) com:
- Stepper visual no topo.
- Captura de geolocalização do navegador (com fallback manual).
- Upload de múltiplas fotos (preview).
- Categorias expandidas: iluminação, buracos, lixo, trânsito, segurança, vazamentos, limpeza, praças, calçadas, sinalização.
- Conexão real com o banco (insert na tabela `problems`).
- Feedback de sucesso animado.

### 4. ProblemCard + Timeline
- Card mais limpo com hierarquia melhor.
- Componente `ProblemTimeline` mostrando status (Reportado → Em análise → Em andamento → Resolvido) com data de cada etapa.
- Botão de detalhe abre modal com timeline + fotos + endereço.

### 5. Formatação de datas BR (`dd/mm/aaaa HH:mm`) em todos os lugares.

## Entrega 2 (próxima) — Painel da Prefeitura como Centro de Operações
- Dashboard executivo com KPIs avançados, SLA por categoria, gráficos (recharts), heatmap real, ranking de bairros críticos, gestão por secretaria, filtros avançados, exportação.

## Entrega 3 (próxima) — IA + Transparência Pública
- Edge function com Lovable AI: classificação automática de categoria/severidade ao criar chamado, resumo de ocorrência, detecção de urgência, insights de recorrência.
- Página pública `/transparencia` com indicadores da cidade, antes/depois, tempo médio de resolução por bairro.

## Detalhes técnicos
- Mantém: Supabase schema atual, `useProblems`, `GestorDashboard` (refinado depois), rotas `/` e `/gestor`.
- Sem novas tabelas nesta entrega 1.
- Geolocalização via `navigator.geolocation`, sem dependência externa.
- Imagens das ocorrências: usar `image_url` atual (texto único) — upload real para storage entra na entrega 2 junto com bucket.
- Nenhuma quebra de funcionalidade existente.

Aprovando, eu começo pela **Entrega 1** completa.