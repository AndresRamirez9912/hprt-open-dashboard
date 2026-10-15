// Printing: builds the print file once and sends it once per copy, one copy at a time.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bridge } from "../api/client";
import type { PrintResult } from "../api/types";
import { queryKeys } from "./queryKeys";

export interface PrintProgress {
  copy: number;
  copies: number;
}

interface PrintInput {
  buildFile: () => Promise<Blob>;
  copies: number;
}

export function usePrint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      buildFile,
      copies,
    }: PrintInput): Promise<PrintResult> => {
      queryClient.setQueryData(queryKeys.job, null); // forget the previous job
      const file = await buildFile();
      let result: PrintResult = { ok: true };
      for (let copy = 1; copy <= copies; copy++) {
        queryClient.setQueryData<PrintProgress>(queryKeys.printProgress, {
          copy,
          copies,
        });
        const started = Date.now();
        result = await bridge.print(file);
        if (!result.ok) throw new Error(result.error ?? "Print failed");
        queryClient.setQueryData(queryKeys.printDuration, Date.now() - started);
      }
      return result;
    },
  });
}

/** Which copy is being printed (while usePrint runs). */
export function usePrintProgress(): PrintProgress {
  const { data } = useQuery<PrintProgress>({
    queryKey: queryKeys.printProgress,
    queryFn: () => ({ copy: 1, copies: 1 }),
    enabled: false,
    initialData: { copy: 1, copies: 1 },
  });
  return data;
}

/**
 * Estimated time for `copies` prints, from how long the last successful print took
 * (the printer does not report it). null until something has been printed.
 */
export function useEstimatedPrintSeconds(copies: number): number | null {
  const { data } = useQuery<number | null>({
    queryKey: queryKeys.printDuration,
    queryFn: () => null,
    enabled: false,
    initialData: null,
  });
  return data === null ? null : Math.round((data * copies) / 1000);
}
