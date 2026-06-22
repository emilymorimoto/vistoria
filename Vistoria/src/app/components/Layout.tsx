import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  List,
  Kanban,
  Bell,
  Building2,
  LogOut,
  User,
  Plus,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { getNotificacoes } from "../data/api";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    getNotificacoes(user.id)
      .then((notifs) => setUnreadCount(notifs.filter((n) => !n.lida).length))
      .catch(() => {});
  }, [user, location.pathname]);

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/processos", label: "Processos", icon: List },
    { path: "/kanban", label: "Kanban", icon: Kanban },
    { path: "/notificacoes", label: "Notificações", icon: Bell, badge: unreadCount },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="font-bold text-lg">Gestão Imobiliária</h1>
              <p className="text-xs text-gray-500">Desocupações</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to="/processos/novo"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Novo Processo</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email?.split("@")[0] ?? "Usuário"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email ?? ""}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-600"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
