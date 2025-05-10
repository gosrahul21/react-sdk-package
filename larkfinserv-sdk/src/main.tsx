import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")!).render(
  <SnackbarProvider maxSnack={3}>
    <App />
  </SnackbarProvider>
);
