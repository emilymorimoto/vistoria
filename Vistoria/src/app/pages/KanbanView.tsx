import { useState } from "react";
import { mockProcesses } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ProcessStage, STAGE_LABELS } from "../types";
import StatusBadge from "../components/StatusBadge";
import { Link } from "react-router";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function KanbanView() {
  // Etapas principais do fluxo
  const mainStages: ProcessStage[] = [
    'aviso-desocupacao',
    'orientacao-inquilino',
    'agendamento-vistoria',
    'tratativas',
    'encaminhamento'
  ];

  const secondaryStages: ProcessStage[] = [
    'juridico-cobranca',
    'execucao',
    'manutencao',
    'conferencia',
    'relocacao',
    'envio-chaves',
    'anuncio',
    'finalizado'
  ];

  // Agrupar processos por etapa
  const processesByStage = (stage: ProcessStage) => {
    return mockProcesses.filter(p => p.etapaAtual === stage);
  };

  const KanbanColumn = ({ stage }: { stage: ProcessStage }) => {
    const processes = processesByStage(stage);
    
    return (
      <div className="flex-shrink-0 w-80">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {STAGE_LABELS[stage]}
              </CardTitle>
              <Badge variant="secondary">{processes.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
            {processes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Nenhum processo nesta etapa
              </p>
            ) : (
              processes.map((processo) => (
                <Link
                  key={processo.id}
                  to={`/processo/${processo.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-sm mb-1">
                            {processo.codigo}
                          </p>
                          <p className="text-sm text-gray-700">
                            {processo.imovel}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {processo.inquilino}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <StatusBadge status={processo.status} />
                        </div>

                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{processo.responsavel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(processo.prazoFinal, "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          </div>
                        </div>

                        {processo.status !== 'concluido' && (
                          <div className={`text-xs font-medium pt-2 border-t ${
                            processo.diasRestantes < 0 
                              ? 'text-red-600' 
                              : processo.diasRestantes <= 5 
                              ? 'text-yellow-600' 
                              : 'text-green-600'
                          }`}>
                            {processo.diasRestantes < 0 
                              ? `⚠️ ${Math.abs(processo.diasRestantes)} dias em atraso` 
                              : `${processo.diasRestantes} dias restantes`
                            }
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Visão Kanban</h1>
        <p className="text-gray-500 mt-1">
          Acompanhe o fluxo dos processos por etapa
        </p>
      </div>

      {/* Etapas Principais */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Fluxo Principal (até 30 dias)
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {mainStages.map((stage) => (
            <KanbanColumn key={stage} stage={stage} />
          ))}
        </div>
      </div>

      {/* Etapas Secundárias */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Ramificações e Complementares
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {secondaryStages.map((stage) => (
            <KanbanColumn key={stage} stage={stage} />
          ))}
        </div>
      </div>
    </div>
  );
}