## Plano de evolução do FastFix — 5 entregas conectadas ao banco

### 1. Mapa interativo real (Leaflet)
- Instalar `leaflet` + `react-leaflet` + `@types/leaflet`.
- Substituir o `MapView.tsx` simulado por um mapa Leaflet com OpenStreetMap (gratuito, sem API key).
- Suporte nativo a pan/zoom no desktop (mouse) e mobile (touch/pinch).
- Marcadores customizados coloridos por severidade, com popup mostrando título, categoria, upvotes e botão "Ver detalhes".
- Auto-centro na cidade do usuário (ou Fortaleza por padrão).

### 2. Autenticação + perfil com cidade (geofencing)
- Criar página `/auth` (login + cadastro com email/senha + Google).
- Tabela `profiles` com `user_id`, `display_name`, `city`, `role` (via trigger no signup).
- Tabela `user_roles` separada com enum `app_role` (`citizen`, `manager`, `admin`) — função `has_role()` SECURITY DEFINER.
- Adicionar coluna `city` em `problems` (preenchida no insert pela cidade do reporter).
- Adicionar coluna `is_public` (boolean, default false) em `problems`.
- Atualizar RLS de `problems`:
  - SELECT: público se `is_public = true` OU usuário autenticado da mesma cidade OU manager/admin.
  - UPDATE: apenas managers/admins.
- Cidadão comum só vê problemas da sua cidade no client (filtro RLS no servidor garante privacidade).

### 3. Visibilidade controlada pelo gestor
- No `GestorDashboard`, adicionar `Switch` "Tornar Público" em cada linha da tabela.
- Toggle atualiza `is_public` na tabela `problems`.
- Página pública `/transparencia` (já planejada) lista apenas `is_public = true` — mural de transparência cross-city.

### 4. Sistema de notificações em tempo real
- Tabela `notifications` (`user_id`, `title`, `body`, `link`, `read`, `created_at`).
- Trigger no `problems`: ao mudar status, criar notificação para o `user_id` do reporter.
- Trigger no `problem_upvotes`: ao receber upvote, notificar o autor.
- Habilitar Realtime na tabela `notifications` (`ALTER PUBLICATION`).
- Componente `NotificationBell` no header (CitizenApp/GestorDashboard) com badge de não-lidas, dropdown da lista, marca como lida ao clicar.
- Toast (sonner) automático quando chega nova notificação via subscription Realtime.

### 5. Showcase Antes/Depois
- Bucket de Storage `problem-media` (público).
- Adicionar colunas `before_images` (text[]), `after_images` (text[]) em `problems`.
- No `GestorDashboard`, ao abrir uma denúncia `is_public = true` E `status = resolved`, formulário de upload de fotos "Antes" e "Depois".
- Componente `BeforeAfterSlider` (slider interativo arrastável comparando as duas imagens) — usado na página pública e no card detalhado.

### Detalhes técnicos
- Stack: React, Tailwind, Supabase (Lovable Cloud), react-leaflet, sonner.
- Auth: email/senha + Google (configure_social_auth).
- RLS: nunca em recursão — usar `has_role()` SECURITY DEFINER e função auxiliar `get_user_city(uuid)`.
- Realtime: `supabase.channel().on('postgres_changes')` para notifications.
- Migrations: tudo numa migration única para coerência.
- Reporter de problemas anônimos continua funcionando (city = capturada por geolocation reverse lookup ou input manual).

### Ordem de execução
1. Migration (profiles, user_roles, city, is_public, before/after, notifications, triggers, storage bucket, RLS).
2. Configurar auth (Google + email).
3. Página `/auth` + hook `useAuth` + `useProfile`.
4. Substituir `MapView` por Leaflet.
5. Atualizar `useProblems` para já filtrar por cidade no client (defesa em profundidade).
6. `NotificationBell` + Realtime.
7. Switch "Tornar Público" no GestorDashboard.
8. Upload Antes/Depois + `BeforeAfterSlider`.
9. Atualizar `formatDateBR` e timeline.

Confirma para eu começar?
