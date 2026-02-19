import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/welcome.tsx";
import { Fot } from "./components/ui/footer.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Fot />
  </StrictMode>,
);
