import { useState, useEffect } from "react";
import { getNotificacoes, marcarNotificacaoLida, deletarNotificacao } from "../data/api";
import { Notification } from "../types";
import { useAuth } from "../auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Link } from "react-router";
import {
  Bell,
  AlertCircle,
  Info,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getNotificacoes(user.id)
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const unreadNotifications = notifications.filter((n) => !n.lida);
  const readNotifications = notifications.filter((n) => n.lida);

  const handleMarkAsRead = async (id: string) => {
    await marcarNotificacaoLida(id).catch(() => {});
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  };

  const handleMarkAllAsRead = async () => {
    await Promise.all(unreadNotifications.map((n) => marcarNotificacaoLida(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  const handleDelete = async (id: string) => {
    await deletarNotificacao(id).catch(() => {});
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case "alerta":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "acao-necessaria":
        return <Bell className="h-5 w-5 text-orange-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (tipo: string) => {
    switch (tipo) {
      case "alerta":
        return "border-l-red-500";
      case "acao-necessaria":
        return "border-l-orange-500";
      default:
        return "border-l-blue-500";
    }
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <Card
      className={`border-l-4 ${getNotificationColor(notification.tipo)} ${
        !notification.lida ? "bg-blue-50/30" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="mt-0.5">{getNotificationIcon(notification.tipo)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">
                {notification.titulo}
                {!notification.lida && (
                  <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </h3>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {format(notification.data, "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">{notification.mensagem}</p>

            <div className="flex items-center gap-2 flex-wrap">
              {notification.processoId && (
                <Link to={`/processo/${notification.processoId}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Ver Processo
                  </Button>
                </Link>
              )}

              {!notification.lida && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Marcar como lida
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(notification.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remover
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Carregando notificações...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
            <p className="text-gray-500 mt-1">Central de alertas e notificações do sistema</p>
          </div>
          {unreadNotifications.length > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="nao-lidas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="nao-lidas">
            Não Lidas
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="lidas">
            Lidas
            <Badge variant="secondary" className="ml-2">
              {readNotifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="todas">
            Todas
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nao-lidas" className="space-y-4">
          {unreadNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tudo em dia!</h3>
                <p className="text-gray-500">Você não tem notificações não lidas</p>
              </CardContent>
            </Card>
          ) : (
            unreadNotifications.map((n) => <NotificationItem key={n.id} notification={n} />)
          )}
        </TabsContent>

        <TabsContent value="lidas" className="space-y-4">
          {readNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Info className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma notificação lida
                </h3>
                <p className="text-gray-500">
                  As notificações que você marcar como lidas aparecerão aqui
                </p>
              </CardContent>
            </Card>
          ) : (
            readNotifications.map((n) => <NotificationItem key={n.id} notification={n} />)
          )}
        </TabsContent>

        <TabsContent value="todas" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma notificação
                </h3>
                <p className="text-gray-500">Quando houver notificações, elas aparecerão aqui</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
          )}
        </TabsContent>
      </Tabs>

      {notifications.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Alertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {notifications.filter((n) => n.tipo === "alerta").length}
                  </p>
                  <p className="text-xs text-gray-500">Notificações de alerta</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Ações Necessárias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {notifications.filter((n) => n.tipo === "acao-necessaria").length}
                  </p>
                  <p className="text-xs text-gray-500">Requerem sua atenção</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Informativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {notifications.filter((n) => n.tipo === "info").length}
                  </p>
                  <p className="text-xs text-gray-500">Para conhecimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
