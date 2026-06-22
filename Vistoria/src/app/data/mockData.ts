import { Process, TimelineEvent, Notification } from '../types';

// Função auxiliar para calcular dias restantes
const getDiasRestantes = (prazoFinal: Date): number => {
  const hoje = new Date();
  const diff = prazoFinal.getTime() - hoje.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Dados mockados de processos
export const mockProcesses: Process[] = [
  {
    id: '1',
    codigo: 'DES-2026-001',
    imovel: 'Apartamento 302 - Ed. Primavera',
    endereco: 'Rua das Flores, 123 - Centro',
    inquilino: 'João Silva',
    etapaAtual: 'aviso-desocupacao',
    responsavel: 'Maria Santos',
    dataInicio: new Date('2026-03-01'),
    prazoFinal: new Date('2026-03-31'),
    diasRestantes: 3,
    status: 'atencao',
    prioridade: 'alta'
  },
  {
    id: '2',
    codigo: 'DES-2026-002',
    imovel: 'Casa Térrea - Jardim América',
    endereco: 'Av. Principal, 456',
    inquilino: 'Ana Costa',
    etapaAtual: 'agendamento-vistoria',
    responsavel: 'Pedro Oliveira',
    dataInicio: new Date('2026-03-05'),
    prazoFinal: new Date('2026-04-04'),
    diasRestantes: 7,
    status: 'no-prazo',
    prioridade: 'media'
  },
  {
    id: '3',
    codigo: 'DES-2026-003',
    imovel: 'Sala Comercial 501',
    endereco: 'R. Comercial, 789 - Centro',
    inquilino: 'Empresa XYZ Ltda',
    etapaAtual: 'tratativas',
    responsavel: 'Carlos Mendes',
    dataInicio: new Date('2026-02-15'),
    prazoFinal: new Date('2026-03-17'),
    diasRestantes: -11,
    status: 'vencido',
    prioridade: 'alta',
    observacoes: 'Pendência de pagamento'
  },
  {
    id: '4',
    codigo: 'DES-2026-004',
    imovel: 'Apartamento 104 - Ed. Horizonte',
    endereco: 'Rua do Sol, 321',
    inquilino: 'Roberto Alves',
    etapaAtual: 'orientacao-inquilino',
    responsavel: 'Maria Santos',
    dataInicio: new Date('2026-03-10'),
    prazoFinal: new Date('2026-04-09'),
    diasRestantes: 12,
    status: 'no-prazo',
    prioridade: 'media'
  },
  {
    id: '5',
    codigo: 'DES-2026-005',
    imovel: 'Loja 02 - Shopping Center',
    endereco: 'Av. Shopping, 100',
    inquilino: 'Loja ABC',
    etapaAtual: 'juridico-cobranca',
    responsavel: 'Dr. Fernando Lima',
    dataInicio: new Date('2026-02-01'),
    prazoFinal: new Date('2026-03-03'),
    diasRestantes: -25,
    status: 'vencido',
    prioridade: 'alta',
    observacoes: 'Inadimplência de 3 meses'
  },
  {
    id: '6',
    codigo: 'DES-2026-006',
    imovel: 'Apartamento 205 - Ed. Vista Mar',
    endereco: 'Av. Beira Mar, 555',
    inquilino: 'Claudia Ferreira',
    etapaAtual: 'execucao',
    responsavel: 'Pedro Oliveira',
    dataInicio: new Date('2026-03-15'),
    prazoFinal: new Date('2026-04-14'),
    diasRestantes: 17,
    status: 'no-prazo',
    prioridade: 'media'
  },
  {
    id: '7',
    codigo: 'DES-2026-007',
    imovel: 'Casa Sobrado - Vila Nova',
    endereco: 'Rua Nova, 888',
    inquilino: 'Família Souza',
    etapaAtual: 'manutencao',
    responsavel: 'Equipe Manutenção',
    dataInicio: new Date('2026-03-20'),
    prazoFinal: new Date('2026-04-19'),
    diasRestantes: 22,
    status: 'no-prazo',
    prioridade: 'baixa'
  },
  {
    id: '8',
    codigo: 'DES-2026-008',
    imovel: 'Apartamento 801 - Ed. Luxo',
    endereco: 'R. Presidente, 999',
    inquilino: 'Paulo Medeiros',
    etapaAtual: 'conferencia',
    responsavel: 'Maria Santos',
    dataInicio: new Date('2026-03-22'),
    prazoFinal: new Date('2026-04-21'),
    diasRestantes: 24,
    status: 'no-prazo',
    prioridade: 'baixa'
  },
  {
    id: '9',
    codigo: 'DES-2025-089',
    imovel: 'Sala 301 - Ed. Business',
    endereco: 'Av. Empresarial, 777',
    inquilino: 'Consultoria Tech',
    etapaAtual: 'finalizado',
    responsavel: 'Carlos Mendes',
    dataInicio: new Date('2026-02-01'),
    prazoFinal: new Date('2026-03-03'),
    diasRestantes: 0,
    status: 'concluido',
    prioridade: 'baixa'
  },
  {
    id: '10',
    codigo: 'DES-2026-010',
    imovel: 'Apartamento 102 - Ed. Família',
    endereco: 'Rua das Palmeiras, 234',
    inquilino: 'Luciana Rocha',
    etapaAtual: 'encaminhamento',
    responsavel: 'Pedro Oliveira',
    dataInicio: new Date('2026-03-18'),
    prazoFinal: new Date('2026-04-17'),
    diasRestantes: 20,
    status: 'no-prazo',
    prioridade: 'media'
  },
  {
    id: '11',
    codigo: 'DES-2026-011',
    imovel: 'Casa Geminada - Jardim Sul',
    endereco: 'Rua Sul, 567',
    inquilino: 'Marcos Vieira',
    etapaAtual: 'agendamento-vistoria',
    responsavel: 'Maria Santos',
    dataInicio: new Date('2026-03-25'),
    prazoFinal: new Date('2026-04-24'),
    diasRestantes: 27,
    status: 'no-prazo',
    prioridade: 'baixa'
  },
  {
    id: '12',
    codigo: 'DES-2026-012',
    imovel: 'Apartamento 603 - Ed. Central',
    endereco: 'R. Central, 345',
    inquilino: 'Beatriz Lima',
    etapaAtual: 'tratativas',
    responsavel: 'Carlos Mendes',
    dataInicio: new Date('2026-02-28'),
    prazoFinal: new Date('2026-03-30'),
    diasRestantes: 2,
    status: 'atencao',
    prioridade: 'alta',
    observacoes: 'Negociação de pendências'
  }
];

// Timeline mockada para detalhes de processo
export const mockTimelines: Record<string, TimelineEvent[]> = {
  '1': [
    {
      id: 't1-1',
      etapa: 'aviso-desocupacao',
      data: new Date('2026-03-01'),
      responsavel: 'Maria Santos',
      acao: 'Processo iniciado - Aviso de desocupação enviado ao inquilino'
    }
  ],
  '2': [
    {
      id: 't2-1',
      etapa: 'aviso-desocupacao',
      data: new Date('2026-03-05'),
      responsavel: 'Maria Santos',
      acao: 'Aviso de desocupação enviado',
      observacoes: 'Entregue pessoalmente'
    },
    {
      id: 't2-2',
      etapa: 'orientacao-inquilino',
      data: new Date('2026-03-08'),
      responsavel: 'Pedro Oliveira',
      acao: 'Reunião de orientação realizada',
      observacoes: 'Inquilino ciente das responsabilidades'
    },
    {
      id: 't2-3',
      etapa: 'agendamento-vistoria',
      data: new Date('2026-03-12'),
      responsavel: 'Pedro Oliveira',
      acao: 'Vistoria agendada para 05/04/2026'
    }
  ],
  '3': [
    {
      id: 't3-1',
      etapa: 'aviso-desocupacao',
      data: new Date('2026-02-15'),
      responsavel: 'Carlos Mendes',
      acao: 'Aviso enviado via e-mail e correspondência'
    },
    {
      id: 't3-2',
      etapa: 'orientacao-inquilino',
      data: new Date('2026-02-20'),
      responsavel: 'Carlos Mendes',
      acao: 'Tentativa de contato - sem sucesso'
    },
    {
      id: 't3-3',
      etapa: 'agendamento-vistoria',
      data: new Date('2026-02-25'),
      responsavel: 'Maria Santos',
      acao: 'Vistoria agendada e confirmada'
    },
    {
      id: 't3-4',
      etapa: 'tratativas',
      data: new Date('2026-03-05'),
      responsavel: 'Carlos Mendes',
      acao: 'Identificadas pendências financeiras',
      observacoes: 'Débitos de condomínio e água'
    }
  ]
};

// Notificações mockadas
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    tipo: 'alerta',
    titulo: 'Prazo próximo do vencimento',
    mensagem: 'O processo DES-2026-001 vence em 3 dias',
    processoId: '1',
    processocodigo: 'DES-2026-001',
    data: new Date('2026-03-28T09:00:00'),
    lida: false
  },
  {
    id: 'n2',
    tipo: 'acao-necessaria',
    titulo: 'Ação necessária',
    mensagem: 'Processo DES-2026-012 requer sua aprovação para próxima etapa',
    processoId: '12',
    processocodigo: 'DES-2026-012',
    data: new Date('2026-03-28T10:30:00'),
    lida: false
  },
  {
    id: 'n3',
    tipo: 'alerta',
    titulo: 'Processo vencido',
    mensagem: 'O processo DES-2026-003 está com prazo vencido há 11 dias',
    processoId: '3',
    processocodigo: 'DES-2026-003',
    data: new Date('2026-03-28T08:15:00'),
    lida: false
  },
  {
    id: 'n4',
    tipo: 'alerta',
    titulo: 'Processo vencido - Ação urgente',
    mensagem: 'O processo DES-2026-005 está vencido há 25 dias',
    processoId: '5',
    processocodigo: 'DES-2026-005',
    data: new Date('2026-03-27T14:00:00'),
    lida: false
  },
  {
    id: 'n5',
    tipo: 'info',
    titulo: 'Processo concluído',
    mensagem: 'O processo DES-2025-089 foi finalizado com sucesso',
    processoId: '9',
    processocodigo: 'DES-2025-089',
    data: new Date('2026-03-26T16:45:00'),
    lida: true
  },
  {
    id: 'n6',
    tipo: 'acao-necessaria',
    titulo: 'Vistoria agendada',
    mensagem: 'Confirmar presença na vistoria do processo DES-2026-002 em 05/04',
    processoId: '2',
    processocodigo: 'DES-2026-002',
    data: new Date('2026-03-25T11:00:00'),
    lida: true
  }
];
