// Types of the bridge API (free-photo/server, replicated by the Go backend).

export interface PrinterError {
  code: number;
  label: string;
}

export interface PrinterStatus {
  battery: number;
  printCounter: number;
  firmware: string;
  errors: PrinterError[];
  stageCode: number;
  token: [number, number];
  raw: string;
}

export interface LinkStats {
  samples: number;
  lossPct: number;
  rttAvgMs: number | null;
  rttMaxMs: number | null;
  /** Latest heartbeat round trip (null if lost). Older bridges do not send it. */
  lastRttMs?: number | null;
}

export interface BridgeState {
  connected: boolean;
  reconnecting?: boolean;
  ip?: string;
  info?: {
    name: string | null;
    sn: string | null;
    model: string | null;
    firmware?: string;
  };
  status?: PrinterStatus | null;
  printing?: boolean;
  link?: LinkStats | null;
  reserved?: boolean;
}

export interface DiscoveredPrinter {
  ip: string;
  name: string;
  sn: string;
}

export type JobPhase =
  "claim" | "sending" | "sent" | "stage" | "done" | "failed";

export interface JobEvent {
  phase: JobPhase;
  label?: string;
  progress?: number;
  rate?: number;
  stageCode?: number;
  ok?: boolean;
  error?: string;
  unconfirmed?: boolean;
}

export interface LogEntry {
  t: number; // epoch ms
  msg: string;
}

export interface LinkReport {
  ip: string;
  ping: {
    sent: number;
    lossPct: number;
    rttMinMs: number | null;
    rttAvgMs: number | null;
    rttMaxMs: number | null;
  } | null;
  pcWifi: {
    ssid: string;
    signal: number;
    freq: string;
    channel: number;
  } | null;
  heartbeat: LinkStats | null;
}

export interface Gateway {
  gateway: string;
  dev: string;
  wifi: LinkReport["pcWifi"];
}

export interface WifiNetwork {
  ssid: string;
  signal: number;
  freqMHz: number;
  security: string;
  band24: boolean;
}

export interface PrintResult {
  ok: boolean;
  error?: string;
  unconfirmed?: boolean;
}
