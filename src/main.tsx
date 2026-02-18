import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App.tsx";
import { Fot } from "./components/ui/footer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Fot />
  </StrictMode>,
);
