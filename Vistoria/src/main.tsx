
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  const root = document.getElementById("root")!;

  try {
    createRoot(root).render(<App />);
  } catch (e: unknown) {
    root.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;padding:2rem">
        <div style="max-width:520px;text-align:center">
          <h2 style="color:#dc2626;margin-bottom:1rem">Erro de configuração</h2>
          <p style="color:#374151;white-space:pre-wrap">${(e as Error).message}</p>
        </div>
      </div>
    `;
  }
