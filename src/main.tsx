import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./i18n";
import { BluetoothProvider } from "./state/Bluetooth";
import { PrintJobProvider } from "./state/PrintJob";
import { PrintSettingsProvider } from "./state/PrintSettings";
import "./styles/global.scss";

// The bridge is local: no automatic retries or refetch on focus; live data arrives over SSE.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PrintSettingsProvider>
        <PrintJobProvider>
          <BluetoothProvider>
            <App />
          </BluetoothProvider>
        </PrintJobProvider>
      </PrintSettingsProvider>
    </QueryClientProvider>
  </StrictMode>,
);
