# Contexto — Sistema de Gestão de Vistoria / Desocupação de Imóveis

> Documento de contexto do produto. Consolida o fluxograma oficial de locação, o
> rascunho de concepção e a descrição do negócio. Serve de base para o desenho do
> sistema (backend + frontend). Última atualização: 2026-06-21.

---

## 1. Problema

Uma imobiliária controla todo o ciclo de **desocupação → vistoria → tratativas →
manutenção → relocação** de um imóvel **manualmente, em planilhas**.

**Dor principal:**
- Todos os dados ficam em planilhas que **não se conectam** entre si. Atualizar
  "tal imóvel desocupou" / "tal imóvel está em manutenção" exige edição manual e
  troca de planilhas entre pessoas.
- **Notificação de prazos é manual** — alguém precisa ficar "no pé" do time para
  cumprir os prazos (tratativa de 10–15 dias, aviso prévio de 30 dias, etc.).
- O fluxo envolve **várias pessoas de setores diferentes** (vistoria, tratativas,
  jurídico, manutenção, vendas/relocação) e duas lojas físicas. Não há uma fonte
  única de verdade nem visibilidade de status compartilhada.

**Objetivo do sistema:** uma fonte única de verdade que conecta os dados do fluxo,
controla status de cada imóvel e **notifica automaticamente os colaboradores** sobre
prazos e próximas ações.

---

## 2. Atores

- **Inquilino** — quem está desocupando o imóvel.
- **Proprietário** — dono do imóvel.
- **Colaborador da imobiliária** — responsável por conduzir o fluxo (o "responsável
  pelo imóvel"). É o **usuário principal do sistema**.
- **Prestador de serviço** — executa a manutenção. Pode ser:
  - **Prestador da imobiliária** (sugestão da imobiliária, terceirizado — sem
    controle direto), ou
  - **Prestador contratado pelo inquilino**.
- **Jurídico** — entra quando há cobrança/inadimplência (garantia, fiador, despejo).

> **Importante:** o sistema **NÃO** precisa se comunicar diretamente com inquilino
> nem com proprietário. Ele precisa **avisar o colaborador da imobiliária** quando
> for hora de o colaborador contatar inquilino/proprietário.

---

## 3. Duas lojas (logística das chaves)

- **Zona 5** — endereço/sede; onde acontecem **tratativas, vistoria e manutenção**.
- **Zona 7** — outro bairro; onde acontece **vendas/relocação** (levar cliente ao
  imóvel, fechar contrato).

Fluxo da chave: durante o processo a chave fica na Zona 5; ao final, é **encaminhada
para a Zona 7** para relocação. É preciso registrar o **destino/observações da
chave** (foi para a outra loja? está com o proprietário?).

---

## 4. Fluxo (fluxograma oficial da vistoria)

| # | Etapa | Comunicação | Observações |
|---|-------|-------------|-------------|
| 1 | **Aviso de desocupação** | Imobiliária ↔ Proprietário | Inquilino avisa; **aviso prévio obrigatório de 30 dias** |
| 2 | **Orientação ao inquilino / Pré-vistoria** | Imobiliária ↔ Inquilino | Orientações sobre o processo |
| 3 | **Agendar / trazer chaves para pré-vistoria** | Imobiliária ↔ Inquilino | Agendar dia para prestador + pessoa da imobiliária fazerem a pré-vistoria |
| 4 | **Tratativas** | Proprietário ↔ Inquilino | Quais problemas, quem resolve, o que precisa ser feito. **Prazo-alvo: 10–15 dias máx.** |
| 4.1 | **Jurídico / Cobrança** | — | Aciona garantia / fiador. **Pode estourar o prazo** |
| 5 | **Execução / Previsão de serviço** | Proprietário ciente | Prestador executa |
| 5.1 | **Manutenção** | — | → quando finaliza vira "Pronto" |
| — | **Conferência** | — | Confere se está tudo certo após manutenção |
| 6 | **Relocação** | — | Imóvel volta a ficar disponível |
| 7 | **Envio das chaves Z7** | — | Encaminhar chaves Zona 5 → Zona 7 |
| 8 | **Anúncio na FLIP** | — | FLIP = plataforma digital para divulgar o imóvel para locação |
| — | **Cobrança / Pagamento da rescisão** | Inquilino e Proprietário | Cobrança (inquilino) e pagamento (inquilino + proprietário) |

### Ramificação das Tratativas
- **Fazer serviço** → registrar **Prestador (meu/da imobiliária)** ou
  **Prestador (do inquilino)** → **Registro**.
- **Não fazer serviço** → **Aciona garantia** / **Aciona fiador** → **Jurídico**.

### Variáveis do contrato (saídas alternativas)
Dependendo do contrato, o fluxo pode virar: **despejo do imóvel** ou **abandono do
imóvel** → reemissão da posse. (Possíveis outras variáveis.)

---

## 5. Gargalos identificados

1. **Agendamento da pré-vistoria (etapa 3)** — é **síncrono entre pessoas**
   (imobiliária + prestador + inquilino). Desencontros geram perda de tempo se o
   inquilino não estiver presente.
2. **Tratativas → Jurídico (4 → 4.1)** — a tratativa deveria durar 10–15 dias, mas
   quando "cai no jurídico" (cobrança/inadimplência) o prazo estoura.
3. **Prestador terceirizado** — a imobiliária não controla diretamente o prestador
   (seja o dela ou o do inquilino), o que dificulta acompanhar prazos de execução.

---

## 6. Status do imóvel (máquina de estados)

Estados observados no rascunho: **Vistoria → Tratativas → Jurídico → Manutenção →
Pronto**.

Sugestão de status para o sistema (a validar):
`Aviso de desocupação` → `Orientação` → `Pré-vistoria agendada` → `Vistoria` →
`Tratativas` → (`Jurídico`) → `Execução/Manutenção` → `Conferência` → `Pronto` →
`Relocação` → `Anunciado (FLIP)`.

---

## 7. Registro (campos de dados)

Ao executar a manutenção, registrar:
- **Prestador** — nome; e se é prestador **da imobiliária** ou **do inquilino**.
- **Data** — quando a manutenção foi feita.
- **Responsável pelo imóvel** — o colaborador da imobiliária que conduz o fluxo.
- **Observações da chave** — destino: foi para a outra loja (Z7)? está com o
  proprietário?

---

## 8. Notificações (o que o sistema precisa avisar)

Lembretes automáticos **para o colaborador da imobiliária**:
- **Aviso prévio de 30 dias** — acompanhar se o inquilino já saiu / se mantém a saída.
- **Prazo de tratativa de 10–15 dias** — alertar quando estiver perto de estourar.
- Lembrar o colaborador de quando contatar inquilino ou proprietário em cada etapa.

---

## 9. Visão de sistema

- **Não é só single-user:** o fluxo envolve várias pessoas e setores → precisa de
  **backend estruturado** (fonte única de verdade, estados, prazos, notificações) e
  **frontend** colaborativo (vários usuários/setores acessando).
- Substituir o emaranhado de planilhas por um modelo de dados conectado.

### Integrações mencionadas (a investigar)
- **Superlógica** — possível plataforma imobiliária a integrar (rascunho cita "já tem
  API d'loca"). **Também é citada como concorrente** — verificar se é integração,
  benchmark, ou ambos.
- **FLIP** — plataforma digital de divulgação de imóveis para locação (etapa 8).

---

## 10. Concorrente / benchmark

- **Superlógica** — solução focada no mercado imobiliário. Vale estudar o fluxo e a
  forma de funcionamento dela como referência.

---

## 11. Protótipo (Figma Make) — código exportado em `./Vistoria/`

Link original: https://www.figma.com/make/ueDbs7KXHr0PLFRh9604rB/Vistoria
App **React 18 + Vite + Tailwind v4 + shadcn/ui + react-router 7** (TypeScript). É um
protótipo **só de frontend, com dados mockados** (sem backend; "Mudar Etapa" só faz
`console.log`).

### Telas (`Vistoria/src/app/pages/`)
- **Dashboard** — KPIs (total, no prazo, atenção, vencidos), gráfico de barras
  (processos por etapa), pizza (distribuição por status) e lista de "Processos Críticos".
- **ProcessList** — tabela com busca (código/imóvel/inquilino) e filtros por status e etapa.
- **KanbanView** — quadro com duas faixas: *Fluxo Principal (até 30 dias)* (aviso →
  orientação → agendamento → tratativas → encaminhamento) e *Ramificações e
  Complementares* (jurídico, execução, manutenção, conferência, relocação, envio-chaves,
  anúncio, finalizado).
- **ProcessDetail** — dados do processo + **timeline/histórico** + painel lateral com
  "Mudar Etapa" (modal), "Ações Rápidas" (relatório, comentário, lembrete) e alerta de prazo.
- **Notifications** — abas Não Lidas / Lidas / Todas; tipos: `alerta`, `acao-necessaria`,
  `info`; marcar como lida / remover.

### Modelo de dados validado (`types.ts`)
- **`Process`**: `id, codigo, imovel, endereco, inquilino, etapaAtual, responsavel,`
  `dataInicio, prazoFinal, diasRestantes, status, prioridade, observacoes?`.
- **`ProcessStage`** (13 etapas): `aviso-desocupacao, orientacao-inquilino,`
  `agendamento-vistoria, tratativas, encaminhamento, juridico-cobranca, execucao,`
  `manutencao, conferencia, relocacao, envio-chaves, anuncio, finalizado`.
- **`ProcessStatus`** (saúde do prazo): `no-prazo, atencao, vencido, concluido`.
- **`TimelineEvent`**: `etapa, data, responsavel, acao, observacoes?`.
- **`Notification`**: `tipo, titulo, mensagem, processoId, data, lida`.

> **Decisão de modelagem importante (manter):** o protótipo separa **etapa**
> (`etapaAtual` = onde está no fluxo) de **status** (`status` = saúde do prazo). Isso é
> melhor que tratar tudo como um só campo — adotar essa separação no sistema final.
> _(Atualiza/expande a seção 6.)_

## 12. Lacunas do protótipo vs. operação real (a fechar no sistema)

O protótipo cobre bem o **núcleo** (processos, etapas, kanban, prazos, notificações), mas
**não modela** vários pontos que você descreveu:

- [ ] **Proprietário** — não existe no modelo (`Process` só tem `inquilino`). O fluxo
  envolve o proprietário em várias etapas (seção 4).
- [ ] **Registro de manutenção** (seção 7) — falta **prestador** (nome + tipo:
  *da imobiliária* ou *do inquilino*) e **data da manutenção**.
- [ ] **Chave** — falta o **destino/observações da chave** (foi p/ outra loja? está com
  o proprietário?).
- [ ] **Duas lojas (Zona 5 / Zona 7)** — não modeladas; o "envio-chaves" não distingue origem/destino.
- [ ] **Prazos por etapa (SLA)** — hoje há um único `prazoFinal` por processo. As regras
  reais são por etapa: **aviso prévio 30 dias**, **tratativa 10–15 dias**.
- [ ] **Notificações automáticas** — hoje são mock estático; precisam ser **geradas por
  regra de prazo** e direcionadas ao **colaborador** responsável.
- [ ] **Backend / persistência** — tudo é mock; nada é salvo. Precisa de API + banco.
- [ ] **Multiusuário / setores** — sem login nem papéis, apesar de o fluxo envolver
  vários setores (vistoria, tratativas, jurídico, manutenção, vendas).
- [ ] **Integrações** — FLIP (anúncio) e Superlógica não existem no protótipo.

## 13. Pontos em aberto (a confirmar com a Emily)

- [ ] Superlógica é **concorrente**, **integração** (via API) ou os dois?
- [ ] Confirmar a lista e a ordem oficial dos **status**.
- [ ] Stack técnica desejada (backend/frontend/banco/hospedagem).
- [ ] Canal de notificação ao colaborador (e-mail, push, WhatsApp, in-app?).
- [ ] Receber o **Figma Make** para alinhar a visão visual da interface.
- [ ] Escopo do MVP vs. versão completa.
