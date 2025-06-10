import "./styles.css";

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Routes } from "./routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./libs/query-client";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <Routes />
    </QueryClientProvider>
  </StrictMode>
);
