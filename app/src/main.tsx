import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// FIXME: averiguar por qué usar `StrictMode` renderiza dos veces el canvas del mapa
createRoot(document.getElementById("root")!).render(<App />);
