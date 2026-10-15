// React Query keys. Live data pushed by the bridge (state, job, logs) is written into these
// same keys, so components read it like any other query.
export const queryKeys = {
  state: ["bridge", "state"] as const,
  online: ["bridge", "online"] as const,
  job: ["bridge", "job"] as const,
  logs: ["bridge", "logs"] as const,
  printProgress: ["print", "progress"] as const,
  wifiScan: ["bridge", "wifi-scan"] as const,
  /** Last heartbeat round trips (ms, null = lost), collected from the state stream. */
  latencyHistory: ["bridge", "latency-history"] as const,
  /** How long the last print took, per copy (ms). */
  printDuration: ["print", "duration"] as const,
};

/** Heartbeats kept for the latency chart (one every ~3 s). */
export const LATENCY_HISTORY_SIZE = 12;

/** Bridge log lines kept in memory. */
export const MAX_LOG_ENTRIES = 500;
