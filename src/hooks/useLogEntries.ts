// Every protocol line: the bridge's (TCP/UDP) and the browser's (Bluetooth), in time order.
import { mergeLogs, type ClassifiedLog } from "../lib/logs";
import { useBluetooth } from "../state/Bluetooth";
import { useBridgeLogs } from "./useBridge";

export function useLogEntries(): ClassifiedLog[] {
  const { data = [] } = useBridgeLogs();
  const { logs } = useBluetooth();
  return mergeLogs(data, logs);
}
