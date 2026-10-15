// Server-sent events of the bridge: live printer state, print job progress and log lines.
import type { BridgeState, JobEvent, LogEntry } from "./types";

export interface BridgeEventHandlers {
  onOpen: () => void;
  onError: () => void;
  onState: (state: BridgeState) => void;
  onJob: (event: JobEvent) => void;
  onLog: (entry: LogEntry) => void;
}

/** Opens the event stream; returns a function that closes it. The browser reconnects by itself. */
export function openBridgeEvents(h: BridgeEventHandlers): () => void {
  const source = new EventSource("/api/events");
  const parse = <T>(e: Event) => JSON.parse((e as MessageEvent).data) as T;
  source.onopen = h.onOpen;
  source.onerror = h.onError;
  source.addEventListener("state", (e) => h.onState(parse<BridgeState>(e)));
  source.addEventListener("job", (e) => h.onJob(parse<JobEvent>(e)));
  source.addEventListener("log", (e) => h.onLog(parse<LogEntry>(e)));
  return () => source.close();
}
