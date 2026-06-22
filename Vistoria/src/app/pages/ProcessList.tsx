import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getProcessos } from "../data/api";
import { Process, STAGE_LABELS, ProcessStatus, ProcessStage } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, Eye, Calendar, Plus, Loader2 } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ProcessList() {
  const [processos, setProcessos] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [etapaFilter, setEtapaFilter] = useState<string>("todos");

  useEffect(() => {
    getProcessos()
      .then(setProcessos)
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProcesses = processos.filter((p) => {
    const matchesSearch =
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.imovel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.inquilino.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || p.status === statusFilter;
    const matchesEtapa = etapaFilter === "todos" || p.etapaAtual === etapaFilter;
    return matchesSearch && matchesStatus && matchesEtapa;
  });

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Processos</h1>
          <p className="text-gray-500 mt-1">
            Listagem completa de todos os processos de desocupação
          </p>
        </div>
        <Link to="/processos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por código, imóvel ou inquilino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="no-prazo">No Prazo</SelectItem>
                <SelectItem value="atencao">Atenção</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>

            <Select value={etapaFilter} onValueChange={setEtapaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Etapas</SelectItem>
                <SelectItem value="aviso-desocupacao">Aviso de Desocupação</SelectItem>
                <SelectItem value="orientacao-inquilino">Orientação ao Inquilino</SelectItem>
                <SelectItem value="agendamento-vistoria">Agendamento da Vistoria</SelectItem>
                <SelectItem value="tratativas">Tratativas</SelectItem>
                <SelectItem value="encaminhamento">Encaminhamento</SelectItem>
                <SelectItem value="juridico-cobranca">Jurídico / Cobrança</SelectItem>
                <SelectItem value="execucao">Execução</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredProcesses.length} processo(s) encontrado(s)
            </p>
            {(searchTerm || statusFilter !== "todos" || etapaFilter !== "todos") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("todos");
                  setEtapaFilter("todos");
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Carregando processos...
            </div>
          ) : erro ? (
            <div className="text-center py-16 text-red-600">
              <p className="font-semibold">Erro ao carregar processos</p>
              <p className="text-sm mt-1">{erro}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Inquilino</TableHead>
                  <TableHead>Etapa Atual</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      Nenhum processo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProcesses.map((processo) => (
                    <TableRow key={processo.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{processo.codigo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{processo.imovel}</p>
                          <p className="text-xs text-gray-500">{processo.endereco}</p>
                        </div>
                      </TableCell>
                      <TableCell>{processo.inquilino}</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {STAGE_LABELS[processo.etapaAtual]}
                        </span>
                      </TableCell>
                      <TableCell>{processo.responsavel}</TableCell>
                      <TableCell>
                        {processo.prazoFinal ? (
                          <>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {format(processo.prazoFinal, "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                            </div>
                            {processo.status !== "concluido" && processo.diasRestantes !== null && (
                              <p
                                className={`text-xs mt-1 ${
                                  processo.diasRestantes < 0
                                    ? "text-red-600 font-semibold"
                                    : processo.diasRestantes <= 5
                                    ? "text-yellow-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {processo.diasRestantes < 0
                                  ? `${Math.abs(processo.diasRestantes)} dias em atraso`
                                  : `${processo.diasRestantes} dias restantes`}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">Sem prazo</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={processo.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={processo.prioridade} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/processo/${processo.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
