import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ProcessList from "./pages/ProcessList";
import KanbanView from "./pages/KanbanView";
import ProcessDetail from "./pages/ProcessDetail";
import Notifications from "./pages/Notifications";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "processos", Component: ProcessList },
      { path: "kanban", Component: KanbanView },
      { path: "processo/:id", Component: ProcessDetail },
      { path: "notificacoes", Component: Notifications },
    ],
  },
]);
