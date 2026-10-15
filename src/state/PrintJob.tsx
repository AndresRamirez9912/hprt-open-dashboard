// The running print job, shared by the whole app: it keeps going (and stays visible) while the
// user prepares another photo or moves to another page.
import { createContext, useContext, useState, type ReactNode } from "react";
import type { PrintResult } from "../api/types";
import { usePrint } from "../hooks/usePrint";

interface PrintJobApi {
  status: "idle" | "pending" | "success" | "error";
  result?: PrintResult;
  error: unknown;
  /** The progress dialog was put aside with "Continue". */
  minimized: boolean;
  start: (buildFile: () => Promise<Blob>, copies: number) => void;
  minimize: () => void;
  restore: () => void;
  /** Closes the finished job (dialog and pill). */
  close: () => void;
}

const Context = createContext<PrintJobApi | null>(null);

export function PrintJobProvider({ children }: { children: ReactNode }) {
  const print = usePrint();
  const [minimized, setMinimized] = useState(false);

  const api: PrintJobApi = {
    status: print.status,
    result: print.data,
    error: print.error,
    minimized,
    // The file is built from the editor as it is now; later edits do not change this job.
    start: (buildFile, copies) => {
      setMinimized(false);
      print.mutate({ buildFile, copies });
    },
    minimize: () => setMinimized(true),
    restore: () => setMinimized(false),
    close: () => {
      print.reset();
      setMinimized(false);
    },
  };

  return <Context.Provider value={api}>{children}</Context.Provider>;
}

export function usePrintJob(): PrintJobApi {
  const ctx = useContext(Context);
  if (!ctx)
    throw new Error("usePrintJob must be used inside <PrintJobProvider>");
  return ctx;
}
