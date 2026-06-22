export type ProcessStatus = 'no-prazo' | 'atencao' | 'vencido' | 'concluido';

export type ProcessStage = 
  | 'aviso-desocupacao'
  | 'orientacao-inquilino'
  | 'agendamento-vistoria'
  | 'tratativas'
  | 'encaminhamento'
  | 'juridico-cobranca'
  | 'execucao'
  | 'manutencao'
  | 'conferencia'
  | 'relocacao'
  | 'envio-chaves'
  | 'anuncio'
  | 'finalizado';

export interface Process {
  id: string;
  codigo: string;
  imovel: string;
  endereco: string;
  inquilino: string;
  etapaAtual: ProcessStage;
  responsavel: string;
  dataInicio: Date;
  prazoFinal: Date;
  diasRestantes: number;
  status: ProcessStatus;
  prioridade: 'alta' | 'media' | 'baixa';
  observacoes?: string;
}

export interface TimelineEvent {
  id: string;
  etapa: ProcessStage;
  data: Date;
  responsavel: string;
  acao: string;
  observacoes?: string;
}

export interface Notification {
  id: string;
  tipo: 'alerta' | 'info' | 'acao-necessaria';
  titulo: string;
  mensagem: string;
  processoId: string;
  processocodigo: string;
  data: Date;
  lida: boolean;
}

export const STAGE_LABELS: Record<ProcessStage, string> = {
  'aviso-desocupacao': 'Aviso de Desocupação',
  'orientacao-inquilino': 'Orientação ao Inquilino',
  'agendamento-vistoria': 'Agendamento da Vistoria',
  'tratativas': 'Tratativas',
  'encaminhamento': 'Encaminhamento',
  'juridico-cobranca': 'Jurídico / Cobrança',
  'execucao': 'Execução',
  'manutencao': 'Manutenção',
  'conferencia': 'Conferência',
  'relocacao': 'Relocação',
  'envio-chaves': 'Envio de Chaves',
  'anuncio': 'Anúncio',
  'finalizado': 'Finalizado'
};

export const STATUS_LABELS: Record<ProcessStatus, string> = {
  'no-prazo': 'No Prazo',
  'atencao': 'Atenção',
  'vencido': 'Vencido',
  'concluido': 'Concluído'
};
