// Classifies raw protocol log lines (from the bridge and from Bluetooth) for the Logs filters.
import type { LogEntry } from "../api/types";

export type LogCategory =
  "commands" | "network" | "alerts" | "bluetooth" | "other";
/** Console filter: one category or all of them. */
export type LogFilter = LogCategory | "all";

const ALERT =
  /error|fail|stall|lost|timeout|timed out|unreachable|refused|printer reports|busy|cancel/i;
const NETWORK =
  /connect|reconnect|waiting for|discover|searching|socket|knock|gateway|wifi|wi-fi/i;
const COMMAND = /^(cmd |data-port |job:|printing |retrying print)/;

export function categoryOf(msg: string): LogCategory {
  if (msg.startsWith("ble ")) return ALERT.test(msg) ? "alerts" : "bluetooth";
  if (ALERT.test(msg)) return "alerts";
  if (COMMAND.test(msg)) return "commands";
  if (NETWORK.test(msg)) return "network";
  return "other";
}

export interface ClassifiedLog extends LogEntry {
  category: LogCategory;
}

/** Bridge and Bluetooth lines merged in time order, each with its category. */
export function mergeLogs(
  bridgeLogs: LogEntry[],
  bleLogs: LogEntry[],
): ClassifiedLog[] {
  return [...bridgeLogs, ...bleLogs]
    .sort((a, b) => a.t - b.t)
    .map((e) => ({ ...e, category: categoryOf(e.msg) }));
}

export function logFileText(entries: ClassifiedLog[]): string {
  return (
    entries
      .map((e) => `${new Date(e.t).toISOString()} [${e.category}] ${e.msg}`)
      .join("\n") + "\n"
  );
}
