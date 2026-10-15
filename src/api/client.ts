// HTTP client of the bridge. Every function throws an Error whose message is the bridge's
// (English) error text; the UI translates it with errorText().
import type {
  BridgeState,
  DiscoveredPrinter,
  Gateway,
  LinkReport,
  LogEntry,
  PrintResult,
  WifiNetwork,
} from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body as T;
}

const postJson = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const bridge = {
  state: () => request<BridgeState>("/api/state"),
  logs: () => request<LogEntry[]>("/api/logs"),
  discover: (timeoutMs = 6000) =>
    request<DiscoveredPrinter[]>(`/api/discover?timeout=${timeoutMs}`),
  connect: (
    ip: string,
    extra: { name?: string; sn?: string; wakeMs?: number } = {},
  ) => request<BridgeState>("/api/connect", postJson({ ip, ...extra })),
  disconnect: () => request<BridgeState>("/api/disconnect", { method: "POST" }),
  linkTest: (ip?: string) =>
    request<LinkReport>(
      `/api/link${ip ? `?ip=${encodeURIComponent(ip)}` : ""}`,
    ),
  gateway: () => request<Gateway>("/api/gateway"),
  wifiScan: () => request<WifiNetwork[]>("/api/wifi/scan"),
  cancel: () =>
    request<{ cancelled: boolean }>("/api/cancel", { method: "POST" }),
  /** Resolves when the printer finishes (or fails) the job. */
  print: async (jpeg: Blob): Promise<PrintResult> => {
    const res = await fetch("/api/print", {
      method: "POST",
      headers: { "Content-Type": "image/jpeg" },
      body: jpeg,
    });
    return (await res
      .json()
      .catch(() => ({
        ok: false,
        error: `HTTP ${res.status}`,
      }))) as PrintResult;
  },
};
