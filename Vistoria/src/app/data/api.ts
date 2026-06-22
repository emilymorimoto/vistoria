import { supabase } from '../lib/supabase';
import { Process, ProcessStage, ProcessStatus, TimelineEvent, Notification } from '../types';

// Prazos por etapa (SLA): aviso=30 dias, tratativas=15 dias.
const SLA: Partial<Record<ProcessStage, number>> = {
  'aviso-desocupacao': 30,
  'tratativas': 15,
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function calcDiasRestantes(prazoFinal: Date): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diff = prazoFinal.getTime() - hoje.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function buildImovelLabel(im: { tipo: string | null; codigo: string | null }): string {
  const tipo = im.tipo
    ? im.tipo.charAt(0).toUpperCase() + im.tipo.slice(1)
    : 'Imóvel';
  return im.codigo ? `${tipo} - ${im.codigo}` : tipo;
}

// Mapeia uma linha do banco para o tipo Process do frontend
function mapProcesso(row: Record<string, unknown>): Process {
  const etapa = row.etapa_atual as ProcessStage;
  const sla = SLA[etapa] ?? null;

  const imovelRow = row.imovel as { codigo: string | null; endereco: string; tipo: string | null } | null;
  const inquilinoRow = row.inquilino as { nome: string } | null;
  const responsavelRow = row.responsavel as { nome: string } | null;

  // Calcula prazoFinal:
  // aviso-desocupacao → data_aviso_desocupacao + 30 (ou data_inicio_etapa + 30)
  // tratativas → data_inicio_etapa + 15
  let prazoFinal: Date | null = null;
  let diasRestantes: number | null = null;

  if (sla !== null) {
    const baseDate =
      etapa === 'aviso-desocupacao' && row.data_aviso_desocupacao
        ? new Date(row.data_aviso_desocupacao as string)
        : new Date(row.data_inicio_etapa as string);
    prazoFinal = addDays(baseDate, sla);
    diasRestantes = calcDiasRestantes(prazoFinal);
  }

  return {
    id: row.id as string,
    codigo: row.codigo as string,
    imovel: imovelRow ? buildImovelLabel(imovelRow) : 'Imóvel',
    endereco: imovelRow?.endereco ?? '',
    inquilino: inquilinoRow?.nome ?? 'Sem inquilino',
    etapaAtual: etapa,
    responsavel: responsavelRow?.nome ?? 'Não atribuído',
    dataInicio: new Date(row.data_inicio_etapa as string),
    prazoFinal,
    diasRestantes,
    status: row.status as ProcessStatus,
    prioridade: row.prioridade as 'alta' | 'media' | 'baixa',
    observacoes: row.observacoes as string | undefined,
  };
}

// ─── Processos ─────────────────────────────────────────────────────────────

export async function getProcessos(): Promise<Process[]> {
  const { data, error } = await supabase
    .from('processo')
    .select(`
      *,
      imovel(codigo, endereco, tipo),
      inquilino(nome),
      responsavel:colaborador(nome)
    `)
    .order('criado_em', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProcesso);
}

export async function getProcesso(id: string): Promise<Process | null> {
  const { data, error } = await supabase
    .from('processo')
    .select(`
      *,
      imovel(codigo, endereco, tipo),
      inquilino(nome),
      responsavel:colaborador(nome)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(error.message);
  }
  return mapProcesso(data);
}

// Muda a etapa de um processo e grava na timeline
export async function mudarEtapa(
  processoId: string,
  novaEtapa: ProcessStage,
  observacoes: string,
  responsavelId: string
): Promise<void> {
  const hoje = new Date().toISOString().split('T')[0];

  // 1. Atualiza o processo
  const { error: errProcesso } = await supabase
    .from('processo')
    .update({
      etapa_atual: novaEtapa,
      data_inicio_etapa: hoje,
      status: 'no-prazo',
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', processoId);

  if (errProcesso) throw new Error(errProcesso.message);

  // 2. Insere na timeline
  const { error: errTimeline } = await supabase
    .from('timeline')
    .insert({
      processo_id: processoId,
      etapa: novaEtapa,
      responsavel_id: responsavelId,
      acao: `Etapa alterada para: ${novaEtapa}`,
      observacoes: observacoes || null,
    });

  if (errTimeline) throw new Error(errTimeline.message);
}

// Cria um novo processo (com imóvel e inquilino novos)
export async function criarProcesso(dados: {
  imovelEndereco: string;
  imovelTipo: string;
  imovelCodigo?: string;
  inquilinoNome: string;
  inquilinoContato?: string;
  responsavelId: string;
  prioridade: 'alta' | 'media' | 'baixa';
  dataAvisoDesocupacao?: string;
  observacoes?: string;
}): Promise<string> {
  // Insere imóvel
  const { data: imovel, error: errImovel } = await supabase
    .from('imovel')
    .insert({
      endereco: dados.imovelEndereco,
      tipo: dados.imovelTipo,
      codigo: dados.imovelCodigo || null,
    })
    .select('id')
    .single();

  if (errImovel) throw new Error(errImovel.message);

  // Insere inquilino
  const { data: inquilino, error: errInquilino } = await supabase
    .from('inquilino')
    .insert({
      nome: dados.inquilinoNome,
      contato: dados.inquilinoContato || null,
    })
    .select('id')
    .single();

  if (errInquilino) throw new Error(errInquilino.message);

  // Insere processo
  const { data: processo, error: errProcesso } = await supabase
    .from('processo')
    .insert({
      imovel_id: imovel.id,
      inquilino_id: inquilino.id,
      responsavel_id: dados.responsavelId,
      prioridade: dados.prioridade,
      data_aviso_desocupacao: dados.dataAvisoDesocupacao || null,
      data_inicio_etapa: dados.dataAvisoDesocupacao || new Date().toISOString().split('T')[0],
      observacoes: dados.observacoes || null,
    })
    .select('id')
    .single();

  if (errProcesso) throw new Error(errProcesso.message);
  return processo.id;
}

// ─── Timeline ──────────────────────────────────────────────────────────────

export async function getTimeline(processoId: string): Promise<TimelineEvent[]> {
  const { data, error } = await supabase
    .from('timeline')
    .select(`
      *,
      responsavel:colaborador(nome)
    `)
    .eq('processo_id', processoId)
    .order('data', { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const resp = row.responsavel as { nome: string } | null;
    return {
      id: row.id as string,
      etapa: row.etapa as ProcessStage,
      data: new Date(row.data as string),
      responsavel: resp?.nome ?? 'Sistema',
      acao: row.acao as string,
      observacoes: row.observacoes as string | undefined,
    };
  });
}

// ─── Notificações ──────────────────────────────────────────────────────────

export async function getNotificacoes(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notificacao')
    .select('*, processo(codigo)')
    .eq('destinatario_id', userId)
    .order('data', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const proc = row.processo as { codigo: string } | null;
    return {
      id: row.id as string,
      tipo: row.tipo as Notification['tipo'],
      titulo: row.titulo as string,
      mensagem: row.mensagem as string,
      processoId: row.processo_id as string,
      processocodigo: proc?.codigo ?? '',
      data: new Date(row.data as string),
      lida: row.lida as boolean,
    };
  });
}

export async function marcarNotificacaoLida(id: string): Promise<void> {
  const { error } = await supabase
    .from('notificacao')
    .update({ lida: true })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deletarNotificacao(id: string): Promise<void> {
  const { error } = await supabase.from('notificacao').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ─── Colaboradores (para selects de responsável) ───────────────────────────

export async function getColaboradores(): Promise<{ id: string; nome: string }[]> {
  const { data, error } = await supabase
    .from('colaborador')
    .select('id, nome')
    .order('nome');

  if (error) throw new Error(error.message);
  return data ?? [];
}
