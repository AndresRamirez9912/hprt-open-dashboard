// Reading the bridge: printer state, connection to the bridge, current job and logs.
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { bridge } from "../api/client";
import { openBridgeEvents } from "../api/events";
import type { BridgeState, JobEvent, LogEntry } from "../api/types";
import { LATENCY_HISTORY_SIZE, MAX_LOG_ENTRIES, queryKeys } from "./queryKeys";

/**
 * Subscribes to the bridge's live events and writes them into the query cache.
 * Mount it once, at the top of the app.
 */
export function useBridgeEvents() {
  const queryClient = useQueryClient();
  useEffect(
    () =>
      openBridgeEvents({
        onOpen: () => queryClient.setQueryData(queryKeys.online, true),
        onError: () => queryClient.setQueryData(queryKeys.online, false),
        onState: (state) => {
          queryClient.setQueryData(queryKeys.state, state);
          queryClient.setQueryData<(number | null)[]>(
            queryKeys.latencyHistory,
            (prev = []) =>
              state.connected && state.link
                ? [
                    ...prev,
                    state.link.lastRttMs !== undefined
                      ? state.link.lastRttMs
                      : state.link.rttAvgMs,
                  ].slice(-LATENCY_HISTORY_SIZE)
                : [],
          );
        },
        onJob: (event) => queryClient.setQueryData(queryKeys.job, event),
        onLog: (entry) =>
          queryClient.setQueryData<LogEntry[]>(queryKeys.logs, (prev = []) =>
            [...prev, entry].slice(-MAX_LOG_ENTRIES),
          ),
      }),
    [queryClient],
  );
}

/** Printer state. Kept fresh by the event stream; fetched once at start. */
export function useBridgeState() {
  return useQuery({
    queryKey: queryKeys.state,
    queryFn: bridge.state,
    staleTime: Infinity,
  });
}

/** Whether the event stream to the bridge is open (null until the first attempt ends). */
export function useBridgeOnline(): boolean | null {
  const { data } = useQuery<boolean | null>({
    queryKey: queryKeys.online,
    queryFn: () => null,
    enabled: false,
    initialData: null,
  });
  return data;
}

/** Last event of the running (or last) print job, pushed by the bridge. */
export function useJobEvent(): JobEvent | null {
  const { data } = useQuery<JobEvent | null>({
    queryKey: queryKeys.job,
    queryFn: () => null,
    enabled: false,
    initialData: null,
  });
  return data;
}

/** Bridge log lines: the bridge's recent history, then every new line as it arrives. */
export function useBridgeLogs() {
  return useQuery({
    queryKey: queryKeys.logs,
    queryFn: bridge.logs,
    staleTime: Infinity,
  });
}

/** Convenience: the connected printer's state, or nothing when no printer is connected. */
export function usePrinter(): BridgeState | undefined {
  const { data } = useBridgeState();
  return data?.connected || data?.reconnecting ? data : undefined;
}

/** Latest heartbeat round trips, oldest first (null = lost). */
export function useLatencyHistory(): (number | null)[] {
  const { data } = useQuery<(number | null)[]>({
    queryKey: queryKeys.latencyHistory,
    queryFn: () => [],
    enabled: false,
    initialData: [],
  });
  return data;
}
