-- ============================================================================
-- Vistoria — Banco de dados (Fase 1)
-- Como usar: Supabase → menu "SQL Editor" → New query → cole TUDO isto → Run.
-- Pode rodar de novo sem medo (é idempotente: usa "if not exists" / "on conflict").
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) TIPOS (listas de valores fixos) — espelham o protótipo (types.ts)
-- ----------------------------------------------------------------------------
do $$ begin
  create type etapa_processo as enum (
    'aviso-desocupacao','orientacao-inquilino','agendamento-vistoria','tratativas',
    'encaminhamento','juridico-cobranca','execucao','manutencao','conferencia',
    'relocacao','envio-chaves','anuncio','finalizado'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type status_prazo as enum ('no-prazo','atencao','vencido','concluido');
exception when duplicate_object then null; end $$;

do $$ begin
  create type prioridade as enum ('alta','media','baixa');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_notificacao as enum ('alerta','acao-necessaria','info');
exception when duplicate_object then null; end $$;

do $$ begin
  create type setor_colaborador as enum ('vistoria','tratativas','juridico','manutencao','vendas','admin');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2) TABELAS
-- ----------------------------------------------------------------------------

-- Colaboradores (ligados ao login do Supabase: auth.users)
create table if not exists colaborador (
  id         uuid primary key references auth.users(id) on delete cascade,
  nome       text not null,
  email      text unique not null,
  setor      setor_colaborador not null default 'admin',
  papel      text not null default 'colaborador',
  criado_em  timestamptz not null default now()
);

-- Imóveis
create table if not exists imovel (
  id         uuid primary key default gen_random_uuid(),
  codigo     text unique,
  endereco   text not null,
  tipo       text,                       -- apartamento / casa / comercial
  criado_em  timestamptz not null default now()
);

-- Inquilinos
create table if not exists inquilino (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  contato    text,
  criado_em  timestamptz not null default now()
);

-- Sequência para o código amigável do processo (DES-2026-001, 002, ...)
create sequence if not exists processo_codigo_seq;

-- Processos de desocupação (coração do sistema)
create table if not exists processo (
  id                       uuid primary key default gen_random_uuid(),
  codigo                   text unique not null
                            default ('DES-' || to_char(now(),'YYYY') || '-' ||
                                     lpad(nextval('processo_codigo_seq')::text, 3, '0')),
  imovel_id                uuid not null references imovel(id) on delete restrict,
  inquilino_id             uuid references inquilino(id) on delete set null,
  responsavel_id           uuid references colaborador(id) on delete set null,
  etapa_atual              etapa_processo not null default 'aviso-desocupacao',
  status                   status_prazo not null default 'no-prazo',
  prioridade               prioridade not null default 'media',
  data_aviso_desocupacao   date,         -- início da contagem dos 30 dias
  data_inicio_etapa        date not null default current_date, -- quando entrou na etapa atual
  observacoes              text,
  criado_em                timestamptz not null default now(),
  atualizado_em            timestamptz not null default now()
);

-- Prazos por etapa (SLA). Só etapas com prazo definido entram aqui.
create table if not exists etapa_sla (
  etapa       etapa_processo primary key,
  prazo_dias  int not null
);

-- Histórico / linha do tempo do processo
create table if not exists timeline (
  id             uuid primary key default gen_random_uuid(),
  processo_id    uuid not null references processo(id) on delete cascade,
  etapa          etapa_processo not null,
  data           timestamptz not null default now(),
  responsavel_id uuid references colaborador(id) on delete set null,
  acao           text not null,
  observacoes    text
);

-- Notificações (in-app) destinadas ao colaborador
create table if not exists notificacao (
  id              uuid primary key default gen_random_uuid(),
  processo_id     uuid references processo(id) on delete cascade,
  destinatario_id uuid references colaborador(id) on delete cascade,
  tipo            tipo_notificacao not null default 'alerta',
  titulo          text not null,
  mensagem        text not null,
  data            timestamptz not null default now(),
  lida            boolean not null default false
);

-- Índices úteis para as telas
create index if not exists idx_processo_etapa        on processo(etapa_atual);
create index if not exists idx_processo_status       on processo(status);
create index if not exists idx_processo_responsavel  on processo(responsavel_id);
create index if not exists idx_timeline_processo     on timeline(processo_id);
create index if not exists idx_notif_destinatario    on notificacao(destinatario_id, lida);

-- ----------------------------------------------------------------------------
-- 3) DADOS INICIAIS — prazos confirmados (só estes dois têm SLA por enquanto)
-- ----------------------------------------------------------------------------
insert into etapa_sla (etapa, prazo_dias) values
  ('aviso-desocupacao', 30),
  ('tratativas', 15)
on conflict (etapa) do update set prazo_dias = excluded.prazo_dias;

-- ----------------------------------------------------------------------------
-- 4) Quando alguém se cadastra (login), cria automaticamente o colaborador
-- ----------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into colaborador (id, nome, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.email), new.email)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ----------------------------------------------------------------------------
-- 5) SEGURANÇA (RLS) — só quem está logado acessa. Simples para a Fase 1
--    (uma imobiliária, todos os colaboradores enxergam tudo).
-- ----------------------------------------------------------------------------
alter table colaborador enable row level security;
alter table imovel      enable row level security;
alter table inquilino   enable row level security;
alter table processo    enable row level security;
alter table etapa_sla   enable row level security;
alter table timeline    enable row level security;
alter table notificacao enable row level security;

do $$
declare t text;
begin
  foreach t in array array['colaborador','imovel','inquilino','processo','etapa_sla','timeline','notificacao']
  loop
    execute format('drop policy if exists logados_tudo on %I;', t);
    execute format(
      'create policy logados_tudo on %I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ============================================================================
-- FIM da Fase 1 (tabelas). A automação de prazos/notificações (Marco 6) vem
-- depois, em arquivo separado — não precisa rodar agora.
-- ============================================================================
