# Arquitetura do Sistema — Vistoria

> Plano técnico do sistema, escrito pra ser entendido por quem não é da área. Baseado no
> [CONTEXTO.md](CONTEXTO.md) e no protótipo em `./Vistoria/`. Última atualização: 2026-06-21.

---

## 1. Visão em uma frase

Transformar o protótipo (telas bonitas, mas com dados de mentira) num sistema de verdade:
um **banco de dados central** que todos os setores enxergam ao mesmo tempo, com **login**,
**prazos automáticos** e **notificações** — acabando com a troca manual de planilhas.

---

## 2. Stack recomendada (e por quê)

Penso no sistema em 3 camadas:

| Camada | O que faz | Recomendação | Por que essa |
|--------|-----------|--------------|--------------|
| **Frontend** (as telas) | O que o colaborador vê e clica | **Reaproveitar o protótipo** (React + Vite + Tailwind + shadcn) | Já está pronto; só trocamos os "dados de mentira" pelos dados reais |
| **Backend + Banco** | Guarda os dados, regras, login | **Supabase** (banco PostgreSQL gerenciado) | Já vem com banco, login, atualização em tempo real e tarefas agendadas — tudo numa coisa só, com pouca manutenção |
| **Hospedagem** | Deixa o site no ar | **Vercel** (frontend) + Supabase (backend, na nuvem deles) | Simples, tem plano gratuito generoso pra começar |

### Por que Supabase (em vez de montar tudo do zero)
- **Banco relacional (PostgreSQL):** dados *conectados* de verdade — o oposto de planilhas
  soltas. "Imóvel X desocupou" atualiza em todo lugar automaticamente. **Resolve a dor principal.**
- **Login e papéis (setores)** já vêm prontos — atende o "vários setores acessando".
- **Tempo real:** quando alguém muda uma etapa, a tela dos outros atualiza sozinha.
- **Tarefas agendadas (cron):** roda todo dia de madrugada, recalcula os prazos e **cria as
  notificações automáticas** (aviso de 30 dias, tratativa de 10–15 dias).
- **Pouca manutenção:** você não administra servidor; bom pra um time sem equipe de TI.

> Alternativa (não recomendada agora): backend próprio em Node.js. Dá mais controle, mas é
> mais trabalho e exige cuidar de servidor. Só vale se houver uma necessidade que o Supabase
> não atenda — e até agora não há.

---

## 3. Modelo de dados (as "tabelas" do banco)

Hoje o protótipo tem só **um** tipo de registro (`Process`) com tudo dentro. O sistema real
precisa separar em tabelas conectadas. Proposta:

- **`imovel`** — `codigo, endereco, tipo (apto/casa/comercial), proprietario_id, loja_atual (Z5/Z7), status_locacao`
- **`proprietario`** — `nome, contato` *(novo — não existe no protótipo)*
- **`inquilino`** — `nome, contato`
- **`colaborador`** *(usuários do sistema)* — `nome, email, setor (vistoria/tratativas/juridico/manutencao/vendas), papel`
- **`prestador`** — `nome, contato, tipo (da-imobiliaria | do-inquilino)` *(novo)*
- **`processo`** *(o processo de desocupação — coração do sistema)*:
  `imovel_id, inquilino_id, responsavel_id (colaborador), etapa_atual, status (prazo),`
  `prioridade, data_aviso_desocupacao, data_saida, observacoes`
- **`etapa_sla`** *(configuração de prazos por etapa)* — `etapa, prazo_dias`
  (ex.: aviso = 30, tratativas = 15) *(novo — hoje o prazo é um número fixo por processo)*
- **`timeline`** *(histórico)* — `processo_id, etapa, data, responsavel_id, acao, observacoes`
- **`manutencao`** *(o "Registro" da seção 7 do contexto)* —
  `processo_id, prestador_id, data, descricao` *(novo)*
- **`chave`** — `processo_id, destino (zona5 | zona7 | proprietario), data, responsavel_id` *(novo)*
- **`notificacao`** — `processo_id, destinatario_id (colaborador), tipo, titulo, mensagem, data, lida`

Como se conectam (resumo): um **imóvel** tem um **proprietário** e gera um **processo**; o
**processo** tem um **inquilino**, um **colaborador responsável**, vários eventos de
**timeline**, registros de **manutenção** (com **prestador**), o destino da **chave** e
**notificações**.

---

## 4. Etapas × Status (manter do protótipo)

- **Etapa** = onde o imóvel está no fluxo (13 etapas: aviso → ... → finalizado).
- **Status** = saúde do prazo (no-prazo / atenção / vencido / concluído).

A novidade vs. o protótipo: o **status é calculado automaticamente** comparando "quantos dias
a etapa atual já consumiu" com o prazo configurado em `etapa_sla`. Ex.: entrou em *Tratativas*,
o relógio de 15 dias começa; faltando 3 dias vira "atenção", estourou vira "vencido".

---

## 5. Notificações automáticas (a dor de "ficar no pé do pessoal")

1. Uma **tarefa agendada** roda 1×/dia.
2. Para cada processo, recalcula os dias da etapa atual contra o `etapa_sla`.
3. Se está perto/estourou o prazo, **cria uma notificação** para o **colaborador responsável**
   (e atualiza o status do processo).
4. O colaborador vê na tela de Notificações (em tempo real).

Canais, em ordem de implementação: **(1) dentro do sistema** (já existe no protótipo) →
**(2) e-mail** → **(3) WhatsApp** (depois, se quiser). O sistema **não** fala com inquilino/
proprietário — só avisa o colaborador, como você definiu.

---

## 6. Plano de MVP (em fases)

**Fase 1 — MVP (fazer o protótipo virar real):**
- Login de colaboradores.
- Banco no Supabase com as tabelas essenciais (`processo`, `imovel`, `inquilino`, `colaborador`, `timeline`, `notificacao`).
- Telas do protótipo conectadas ao banco (trocar mock por dados reais): Dashboard, Lista, Kanban, Detalhe.
- "Mudar etapa" passa a **salvar de verdade** e registrar na timeline.
- Notificações automáticas de prazo (in-app).
- _Resultado: fim das planilhas pro fluxo principal._

**Fase 2 — Completar a operação:**
- Proprietário, prestador, **registro de manutenção**, **chave/lojas (Z5/Z7)**.
- Prazos por etapa configuráveis (`etapa_sla`).
- Dashboard com dados reais.

**Fase 3 — Avançado:**
- Notificações por e-mail / WhatsApp.
- Integrações: **FLIP** (anúncio) e **Superlógica**.
- Relatórios e exportações.

---

## 7. Decisões em aberto (não bloqueiam começar a Fase 1)

- [ ] Confirmar a stack (Supabase) — ou preferência por outra.
- [ ] Canal de notificação além do in-app (e-mail? WhatsApp?).
- [ ] Superlógica: integrar (puxar/enviar dados) ou só inspiração?
- [ ] Quem serão os primeiros usuários/setores a usar (pra priorizar permissões).
