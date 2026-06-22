import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { mockProcesses } from "../data/mockData";
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router";
import StatusBadge from "../components/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { STAGE_LABELS } from "../types";

export default function Dashboard() {
  // KPIs
  const totalProcessos = mockProcesses.length;
  const noPrazo = mockProcesses.filter(p => p.status === 'no-prazo').length;
  const atencao = mockProcesses.filter(p => p.status === 'atencao').length;
  const vencidos = mockProcesses.filter(p => p.status === 'vencido').length;
  const concluidos = mockProcesses.filter(p => p.status === 'concluido').length;

  // Processos críticos (vencidos ou com atenção)
  const processosCriticos = mockProcesses
    .filter(p => p.status === 'vencido' || p.status === 'atencao')
    .sort((a, b) => a.diasRestantes - b.diasRestantes)
    .slice(0, 5);

  // Dados para gráfico de etapas
  const processosPorEtapa = mockProcesses.reduce((acc, p) => {
    const etapa = STAGE_LABELS[p.etapaAtual];
    acc[etapa] = (acc[etapa] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartDataEtapas = Object.entries(processosPorEtapa)
    .map(([etapa, count]) => ({
      etapa: etapa.length > 20 ? etapa.substring(0, 20) + '...' : etapa,
      quantidade: count
    }))
    .sort((a, b) => b.quantidade - a.quantidade);

  // Dados para gráfico de status
  const chartDataStatus = [
    { name: 'No Prazo', value: noPrazo, color: '#22c55e' },
    { name: 'Atenção', value: atencao, color: '#eab308' },
    { name: 'Vencido', value: vencidos, color: '#ef4444' },
    { name: 'Concluído', value: concluidos, color: '#3b82f6' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral dos processos de desocupação</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Processos
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProcessos}</div>
            <p className="text-xs text-gray-500 mt-1">Em andamento e concluídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              No Prazo
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{noPrazo}</div>
            <p className="text-xs text-gray-500 mt-1">
              {((noPrazo / totalProcessos) * 100).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Atenção
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{atencao}</div>
            <p className="text-xs text-gray-500 mt-1">Próximos ao vencimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vencidos
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{vencidos}</div>
            <p className="text-xs text-gray-500 mt-1">Requerem ação urgente</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Processos por Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataEtapas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="etapa" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartDataStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartDataStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Processos Críticos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Processos Críticos</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Processos vencidos ou próximos ao vencimento
              </p>
            </div>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          {processosCriticos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-600" />
              <p>Nenhum processo crítico no momento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {processosCriticos.map((processo) => (
                <Link
                  key={processo.id}
                  to={`/processo/${processo.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {processo.codigo}
                        </span>
                        <StatusBadge status={processo.status} />
                      </div>
                      <p className="text-sm text-gray-600">{processo.imovel}</p>
                      <p className="text-xs text-gray-500">{processo.endereco}</p>
                    </div>
                    <div className="text-right">
                      {processo.status === 'vencido' ? (
                        <div className="text-red-600">
                          <p className="font-semibold">
                            {Math.abs(processo.diasRestantes)} dias em atraso
                          </p>
                          <p className="text-xs">Ação urgente</p>
                        </div>
                      ) : (
                        <div className="text-yellow-600">
                          <p className="font-semibold">
                            {processo.diasRestantes} dias restantes
                          </p>
                          <p className="text-xs">Atenção necessária</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    <span>Etapa: {STAGE_LABELS[processo.etapaAtual]}</span>
                    <span>•</span>
                    <span>Responsável: {processo.responsavel}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
