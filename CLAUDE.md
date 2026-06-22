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
- ✅ Protótipo (frontend React) em `./Vistoria/` — exportado do Figma Make, **dados mockados**.
- ✅ Banco Fase 1 criado no Supabase (schema.sql rodado com sucesso).
- ✅ Repositório: https://github.com/emilymorimoto/vistoria (privado).
- ⏭️ **Próximo:** Marco 3 — conectar o app ao Supabase e trocar mock por dados reais.

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
