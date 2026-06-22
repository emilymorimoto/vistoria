import { useState } from "react";
import { useParams, Link } from "react-router";
import { mockProcesses, mockTimelines } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Building2, 
  MapPin, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit,
  FileText,
  MessageSquare
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import { STAGE_LABELS } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";

export default function ProcessDetail() {
  const { id } = useParams();
  const processo = mockProcesses.find(p => p.id === id);
  const timeline = mockTimelines[id!] || [];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaEtapa, setNovaEtapa] = useState("");
  const [observacoes, setObservacoes] = useState("");

  if (!processo) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processo não encontrado
          </h2>
          <p className="text-gray-500 mb-6">
            O processo solicitado não existe ou foi removido.
          </p>
          <Link to="/processos">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Processos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleMudarEtapa = () => {
    // Aqui seria feita a chamada à API
    console.log("Mudando etapa para:", novaEtapa, "Observações:", observacoes);
    setIsModalOpen(false);
    setNovaEtapa("");
    setObservacoes("");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/processos">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{processo.codigo}</h1>
            <p className="text-gray-500 mt-1">{processo.imovel}</p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={processo.status} />
            <PriorityBadge priority={processo.prioridade} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Processo */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Processo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Imóvel</p>
                    <p className="font-medium">{processo.imovel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Endereço</p>
                    <p className="font-medium">{processo.endereco}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Inquilino</p>
                    <p className="font-medium">{processo.inquilino}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Responsável Atual</p>
                    <p className="font-medium">{processo.responsavel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Início</p>
                    <p className="font-medium">
                      {format(processo.dataInicio, "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Prazo Final</p>
                    <p className="font-medium">
                      {format(processo.prazoFinal, "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                    {processo.status !== 'concluido' && (
                      <p className={`text-sm mt-1 ${
                        processo.diasRestantes < 0 
                          ? 'text-red-600 font-semibold' 
                          : processo.diasRestantes <= 5 
                          ? 'text-yellow-600' 
                          : 'text-green-600'
                      }`}>
                        {processo.diasRestantes < 0 
                          ? `${Math.abs(processo.diasRestantes)} dias em atraso` 
                          : `${processo.diasRestantes} dias restantes`
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {processo.observacoes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-1">Observações</p>
                  <p className="text-sm">{processo.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico do Processo</CardTitle>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  Nenhum evento registrado ainda
                </p>
              ) : (
                <div className="space-y-4">
                  {timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === timeline.length - 1 
                            ? 'bg-blue-100' 
                            : 'bg-gray-100'
                        }`}>
                          {index === timeline.length - 1 ? (
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2" />
                        )}
                      </div>

                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {STAGE_LABELS[event.etapa]}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(event.data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {event.acao}
                        </p>
                        <p className="text-xs text-gray-600">
                          Por: {event.responsavel}
                        </p>
                        {event.observacoes && (
                          <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                            {event.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral - Ações */}
        <div className="space-y-6">
          {/* Etapa Atual */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Etapa Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-600 mb-1">Aguardando em:</p>
                <p className="font-semibold text-blue-900">
                  {STAGE_LABELS[processo.etapaAtual]}
                </p>
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4" disabled={processo.status === 'concluido'}>
                    <Edit className="h-4 w-4 mr-2" />
                    Mudar Etapa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Mudar Etapa do Processo</DialogTitle>
                    <DialogDescription>
                      Selecione a próxima etapa e adicione observações sobre a mudança.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="etapa">Nova Etapa</Label>
                      <Select value={novaEtapa} onValueChange={setNovaEtapa}>
                        <SelectTrigger id="etapa">
                          <SelectValue placeholder="Selecione a etapa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="orientacao-inquilino">Orientação ao Inquilino</SelectItem>
                          <SelectItem value="agendamento-vistoria">Agendamento da Vistoria</SelectItem>
                          <SelectItem value="tratativas">Tratativas</SelectItem>
                          <SelectItem value="encaminhamento">Encaminhamento</SelectItem>
                          <SelectItem value="juridico-cobranca">Jurídico / Cobrança</SelectItem>
                          <SelectItem value="execucao">Execução</SelectItem>
                          <SelectItem value="manutencao">Manutenção</SelectItem>
                          <SelectItem value="conferencia">Conferência</SelectItem>
                          <SelectItem value="relocacao">Relocação</SelectItem>
                          <SelectItem value="envio-chaves">Envio de Chaves</SelectItem>
                          <SelectItem value="anuncio">Anúncio</SelectItem>
                          <SelectItem value="finalizado">Finalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        placeholder="Adicione observações sobre esta mudança..."
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleMudarEtapa} disabled={!novaEtapa}>
                      Confirmar Mudança
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Adicionar Comentário
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Lembrete
              </Button>
            </CardContent>
          </Card>

          {/* Alerta de Prazo */}
          {processo.status === 'vencido' && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">
                      Prazo Vencido
                    </p>
                    <p className="text-sm text-red-700">
                      Este processo está {Math.abs(processo.diasRestantes)} dias em atraso.
                      Ação urgente necessária.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {processo.status === 'atencao' && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">
                      Atenção ao Prazo
                    </p>
                    <p className="text-sm text-yellow-700">
                      Restam apenas {processo.diasRestantes} dias para conclusão.
                      Acompanhe de perto.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
