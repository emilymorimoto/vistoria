import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { criarProcesso } from "../data/api";
import { useAuth } from "../auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CreateProcess() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Imóvel
  const [imovelEndereco, setImovelEndereco] = useState("");
  const [imovelTipo, setImovelTipo] = useState("apartamento");
  const [imovelCodigo, setImovelCodigo] = useState("");

  // Inquilino
  const [inquilinoNome, setInquilinoNome] = useState("");
  const [inquilinoContato, setInquilinoContato] = useState("");

  // Processo
  const [prioridade, setPrioridade] = useState<"alta" | "media" | "baixa">("media");
  const [dataAviso, setDataAviso] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErro(null);
    setSalvando(true);

    try {
      const id = await criarProcesso({
        imovelEndereco,
        imovelTipo,
        imovelCodigo: imovelCodigo || undefined,
        inquilinoNome,
        inquilinoContato: inquilinoContato || undefined,
        responsavelId: user.id,
        prioridade,
        dataAvisoDesocupacao: dataAviso || undefined,
        observacoes: observacoes || undefined,
      });
      navigate(`/processo/${id}`);
    } catch (e: unknown) {
      setErro((e as Error).message);
      setSalvando(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link to="/processos">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Novo Processo</h1>
        <p className="text-gray-500 mt-1">Cadastre um novo processo de desocupação</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Imóvel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do Imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imovelEndereco">Endereço *</Label>
              <Input
                id="imovelEndereco"
                placeholder="Ex: Rua das Flores, 123 - Centro"
                value={imovelEndereco}
                onChange={(e) => setImovelEndereco(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imovelTipo">Tipo *</Label>
                <Select value={imovelTipo} onValueChange={setImovelTipo}>
                  <SelectTrigger id="imovelTipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imovelCodigo">Código (opcional)</Label>
                <Input
                  id="imovelCodigo"
                  placeholder="Ex: IM-006"
                  value={imovelCodigo}
                  onChange={(e) => setImovelCodigo(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inquilino */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do Inquilino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inquilinoNome">Nome *</Label>
              <Input
                id="inquilinoNome"
                placeholder="Ex: João Silva"
                value={inquilinoNome}
                onChange={(e) => setInquilinoNome(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inquilinoContato">Contato (opcional)</Label>
              <Input
                id="inquilinoContato"
                placeholder="Ex: (44) 99999-0001"
                value={inquilinoContato}
                onChange={(e) => setInquilinoContato(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Processo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do Processo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade *</Label>
                <Select
                  value={prioridade}
                  onValueChange={(v) => setPrioridade(v as "alta" | "media" | "baixa")}
                >
                  <SelectTrigger id="prioridade">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataAviso">Data do Aviso de Desocupação</Label>
                <Input
                  id="dataAviso"
                  type="date"
                  value={dataAviso}
                  onChange={(e) => setDataAviso(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Data em que o aviso foi dado ao inquilino (início da contagem dos 30 dias)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre o processo..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {erro && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            Erro ao criar processo: {erro}
          </p>
        )}

        <div className="flex gap-3">
          <Link to="/processos">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={salvando}>
            {salvando ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Processo"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
