import { createBrowserRouter } from "react-router";
import ProtectedLayout from "./components/ProtectedLayout";
import Dashboard from "./pages/Dashboard";
import ProcessList from "./pages/ProcessList";
import KanbanView from "./pages/KanbanView";
import ProcessDetail from "./pages/ProcessDetail";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import CreateProcess from "./pages/CreateProcess";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "processos", Component: ProcessList },
      { path: "processos/novo", Component: CreateProcess },
      { path: "kanban", Component: KanbanView },
      { path: "processo/:id", Component: ProcessDetail },
      { path: "notificacoes", Component: Notifications },
    ],
  },
]);
