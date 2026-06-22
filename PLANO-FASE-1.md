# Plano da Fase 1 (MVP) — Vistoria

> Objetivo: transformar o protótipo (`./Vistoria/`) num sistema real para o **fluxo
> principal**, usando **Supabase**. Notificações **só dentro do sistema** (in-app) nesta fase.
> Base: [ARQUITETURA.md](ARQUITETURA.md) e [CONTEXTO.md](CONTEXTO.md). Atualizado: 2026-06-21.

## Decisões já fechadas
- **Stack:** reaproveitar o frontend do protótipo + **Supabase** (banco, login, tempo real, tarefa agendada).
- **Notificações:** apenas in-app na Fase 1 (e-mail/WhatsApp ficam para depois).

## O que a Fase 1 entrega
- Login por colaborador.
- Cadastro de processos salvando de verdade (hoje o protótipo não tem tela de "criar processo").
- Telas Dashboard, Lista, Kanban e Detalhe lendo dados reais do banco.
- "Mudar etapa" persistido + registro automático na timeline.
- Status de prazo calculado automaticamente e **notificações in-app** geradas por uma tarefa diária.
- Publicado na web para o time usar.

## Escopo de dados da Fase 1 (tabelas)
Mínimo necessário (o resto — proprietário, prestador, manutenção, chave/lojas — entra na Fase 2):
- **`colaborador`** — nome, email, setor, papel (ligado ao login do Supabase).
- **`imovel`** — codigo, endereco, tipo.
- **`inquilino`** — nome, contato.
- **`processo`** — imovel_id, inquilino_id, responsavel_id, etapa_atual, status, prioridade,
  data_aviso_desocupacao, data_inicio_etapa, observacoes.
- **`etapa_sla`** — etapa, prazo_dias (ex.: aviso=30, tratativas=15).
- **`timeline`** — processo_id, etapa, data, responsavel_id, acao, observacoes.
- **`notificacao`** — processo_id, destinatario_id, tipo, titulo, mensagem, data, lida.

## Passo a passo (ordenado)

### Pré-requisitos (você cria as contas — eu não consigo criar por você)
- [ ] Conta no **Supabase** (supabase.com) e um projeto novo.
- [ ] Conta na **Vercel** (vercel.com) para publicar — pode ser depois.
- [ ] Instalar **Node.js** nesta máquina (preciso dele pra rodar e construir o app).

### Marco 1 — Ambiente rodando
- [ ] Instalar Node e rodar o protótipo localmente (`npm install && npm run dev`).
- [ ] Tirar print das telas pra confirmar que está tudo ok antes de mexer.

### Marco 2 — Banco no Supabase
- [ ] Criar as tabelas da Fase 1 (eu escrevo o SQL).
- [ ] Preencher `etapa_sla` com os prazos reais.
- [ ] Cadastrar dados de exemplo pra testar.

### Marco 3 — Conectar o app ao banco (leitura)
- [ ] Instalar o cliente do Supabase no app e configurar as chaves.
- [ ] Trocar os "dados de mentira" por dados reais em: Lista → Kanban → Dashboard → Detalhe.

### Marco 4 — Login
- [ ] Tela de login e proteção das páginas (só entra quem está logado).
- [ ] Cada colaborador vê e assume seus processos.

### Marco 5 — Escrita (o sistema passa a guardar tudo)
- [ ] **Criar processo** (formulário novo).
- [ ] "Mudar etapa" salva no banco + grava na timeline.
- [ ] Editar dados do processo e observações.

### Marco 6 — Prazos e notificações automáticas
- [ ] Função que calcula o status do prazo (no-prazo/atenção/vencido) usando `etapa_sla`.
- [ ] Tarefa diária (pg_cron) que recalcula e **cria notificações** para o responsável.
- [ ] Tela de Notificações lendo do banco + "marcar como lida" de verdade.

### Marco 7 — Publicar e testar
- [ ] Publicar o app (Vercel) e cadastrar os colaboradores.
- [ ] Piloto com alguns processos reais e ajustes.

## Prazos por etapa (confirmado)
Apenas **duas** etapas têm prazo definido (as demais não têm SLA por enquanto):
- **aviso-desocupacao** = 30 dias.
- **tratativas** = 10–15 dias (usar 15 como limite; "atenção" alguns dias antes).

## Pontos a confirmar antes de construir
- [ ] Setores/papéis iniciais e quem serão os primeiros usuários.
- [ ] Quais campos são obrigatórios no "criar processo".
