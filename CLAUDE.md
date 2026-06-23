# Projeto Vistoria — orientação para o Claude Code

Sistema para uma imobiliária gerenciar o fluxo de **desocupação → vistoria → tratativas →
manutenção → relocação** de imóveis, substituindo planilhas manuais. A usuária (Emily) **não
é técnica** — explicar decisões de forma acessível e responder em **português**.

## Documentos (leia primeiro)
- `CONTEXTO.md` — produto, fluxo, atores, modelo de dados, lacunas.
- `ARQUITETURA.md` — stack e desenho do sistema.
- `PLANO-FASE-1.md` — plano do MVP em marcos.
- `supabase/schema.sql` — banco da Fase 1 (já rodado no Supabase).

## Estado atual (atualizar conforme avança)
- ✅ Protótipo (frontend React) em `./Vistoria/` — exportado do Figma Make.
- ✅ Banco Fase 1 criado no Supabase (schema.sql rodado com sucesso).
- ✅ Repositório: https://github.com/emilymorimoto/vistoria (privado).
- ✅ Conexão com o Supabase montada: `Vistoria/src/app/lib/supabase.ts` + `Vistoria/.env.local`
  (já preenchido com URL e publishable key; o `.env.local` NÃO vai pro git).
- ✅ `@supabase/supabase-js` instalado. Dados de exemplo em `supabase/seed.sql` (opcional).
- ✅ **Marco 3** — Camada de dados real (`src/app/data/api.ts`): todas as telas lendo do Supabase.
- ✅ **Marco 4** — Login com Supabase Auth; rotas protegidas; logout no sidebar.
- ✅ **Marco 5 parcial** — "Mudar etapa" salva no banco + grava na timeline; tela "Criar Processo".
- ✅ **Marco 7** — Publicado na Vercel: https://vistoria-sooty.vercel.app
- ⏭️ **Próximo:** Marco 5 (editar processo/observações) → Marco 6 (prazos e notificações automáticas).

## Runway do Marco 6 (para a próxima sessão)
Marco 5 ainda pendente: editar dados do processo (responsável, observações, prioridade).
Marco 6 — Prazos e notificações automáticas:
1. Função SQL (ou pg_cron) que recalcula `status` de cada processo com base em `data_inicio_etapa`
   + `etapa_sla.prazo_dias` e atualiza o campo `status` na tabela `processo`.
2. Tarefa diária (pg_cron) que gera `notificacao` para o responsável quando prazo está próximo
   (atenção = 5 dias antes) ou vencido.
3. Tela de Notificações já lê do banco — só falta a geração automática pelo backend.

## Stack
Frontend: React 18 + Vite + Tailwind v4 + shadcn/ui + react-router 7 (em `./Vistoria/`).
Backend: **Supabase** (Postgres, Auth, Realtime, pg_cron). Notificações: **só in-app na Fase 1**.

## Como rodar o app
O Node está instalado via **nvm**. Em um terminal novo:
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"   # carrega o node (nvm)
cd Vistoria
npm install        # primeira vez (inclui react@18.3.1 react-dom@18.3.1)
npm run dev        # sobe em http://localhost:5173
```

## Supabase
- Project URL e **Publishable key** (`sb_publishable_...`, segura no frontend) ficam em
  Settings → API / API Keys do projeto.
- A conexão do app deve usar variáveis de ambiente em `Vistoria/.env.local` (NÃO commitar):
  `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. (`.env*` está no `.gitignore`.)
- **Nunca** colocar a `secret key` (`sb_secret_...`) no frontend nem no repositório.

## Convenções
- Commits podem ser feitos quando a Emily pedir. Branch principal: `main`.
- Decisão de modelagem: separar **etapa** (onde está no fluxo) de **status** (saúde do prazo).
- Prazos definidos (SLA): aviso-desocupacao = 30 dias; tratativas = 15 dias. As demais etapas não têm SLA.
