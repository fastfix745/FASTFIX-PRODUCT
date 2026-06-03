cat > ~/Documentos/FastFix-Product/README.md << 'EOF'
# FastFix — Plataforma Inteligente de Gestão Urbana

Plataforma que conecta cidadãos e prefeituras para reportar e resolver problemas urbanos em tempo real.

## Tecnologias

- React + TypeScript + Vite
- Supabase (Auth, Banco de dados, Storage)
- Tailwind CSS + shadcn/ui
- React Query
- React Router

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/fastfix745/FASTFIX-PRODUCT.git
cd FASTFIX-PRODUCT
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

Copie o arquivo de exemplo e preencha com as credenciais do Supabase:

```bash
cp frontend/.env.example frontend/.env
```

As credenciais estão disponíveis no painel do Supabase em **Project Settings > API**.

### 4. Rode o projeto

```bash
npm run dev
```

Acesse: http://localhost:8080

## Acesso de Gestor

Para dar acesso de gestor a um usuário, rode no SQL Editor do Supabase:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('id-do-usuario', 'manager');
```

O `user_id` pode ser encontrado em **Authentication > Users** no painel do Supabase.

## Estrutura do projeto