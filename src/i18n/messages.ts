// Turns what the bridge and the Bluetooth layer report (codes and English messages) into
// translated text. The bridge API speaks English on purpose; the app translates.
import type { TFunction } from "i18next";
import { AppError } from "../lib/errors";

/** Print stage code (0..15) -> text. */
export function stageText(t: TFunction, code: number): string {
  return t(`stage.${code}`, { defaultValue: t("stage.unknown", { code }) });
}

/** Printer error code -> text (falls back to the bridge's English label). */
export function printerErrorText(
  t: TFunction,
  code: number,
  fallback: string,
): string {
  return t(`printerError.${code}`, { defaultValue: fallback });
}

// Known bridge messages. Each pattern maps to an i18n key and its parameters.
const PATTERNS: [
  RegExp,
  (m: RegExpMatchArray) => [string, Record<string, string>?],
][] = [
  [/^Link dropped/, () => ["print.job.retrying"]],
  [/^Printer is busy with another device$/, () => ["bridge.busy"]],
  [/^A print job is already running$/, () => ["bridge.jobRunning"]],
  [/^No printer connected$/, () => ["bridge.noPrinter"]],
  [
    /^Printer did not answer the print request$/,
    () => ["bridge.noClaimAnswer"],
  ],
  [/^Connection to the printer was lost$/, () => ["bridge.lost"]],
  [/^Timed out waiting for the printer$/, () => ["bridge.timeout"]],
  [/^Print cancelled$/, () => ["bridge.cancelled"]],
  [
    /^Sending stalled for (\d+) s/,
    (m) => ["bridge.stalled", { seconds: m[1] }],
  ],
  [/^Invalid IP address$/, () => ["bridge.invalidIp"]],
  [/^Body must be a JPEG image$/, () => ["bridge.notJpeg"]],
  [/^Payload too large$/, () => ["bridge.tooLarge"]],
  [/^Wi-Fi scan not available/, () => ["bridge.scanUnavailable"]],
  [
    /^Could not connect to ([\d.]+): \1 is unreachable/,
    (m) => ["bridge.unreachable", { ip: m[1] }],
  ],
  [
    /^Could not connect to ([\d.]+): \1 refused the connection/,
    (m) => ["bridge.refused", { ip: m[1] }],
  ],
  [
    /^Could not connect to ([\d.]+): Timeout connecting/,
    (m) => ["bridge.connectTimeout", { ip: m[1] }],
  ],
  [
    /^Could not connect to ([\d.]+): (.*)$/,
    (m) => ["bridge.connectOther", { ip: m[1], reason: m[2] }],
  ],
];

// English labels the bridge joins into job errors ("Paper error — Paper jammed").
const ERROR_LABELS: Record<string, string> = {
  "Print failed": "stage.8",
  "Ribbon cartridge error": "stage.9",
  "Paper error": "stage.10",
  "Paper jam": "stage.11",
  "No paper tray": "printerError.0",
  "Out of paper": "printerError.1",
  "Ribbon missing": "printerError.2",
  "Data transmit error": "printerError.3",
  "Paper jammed": "printerError.4",
  "Ribbon error": "printerError.6",
  "Low power, please charge it": "printerError.7",
  "Memory error": "printerError.8",
  "Print head overheating": "printerError.9",
  "Battery overheating": "printerError.10",
  "Ribbon not match": "printerError.11",
  "Authorized ribbon used up": "printerError.12",
  "RFID error": "printerError.13",
  "RFID mileage is 0": "printerError.14",
  "Paper covers the sensor": "printerError.16",
  "Abnormal paper jam": "printerError.17",
};

/** Translates one bridge message; unknown messages are returned as they are. */
export function bridgeMessageText(t: TFunction, message: string): string {
  const known = (part: string): string | null => {
    for (const [re, toKey] of PATTERNS) {
      const m = part.match(re);
      if (m) {
        const [key, params] = toKey(m);
        return t(key, params);
      }
    }
    return ERROR_LABELS[part] ? t(ERROR_LABELS[part]) : null;
  };
  // A whole known message first; otherwise a stage and printer errors joined with " — ".
  return (
    known(message) ??
    message
      .split(" — ")
      .map((part) => known(part) ?? part)
      .join(" — ")
  );
}

/** Any error thrown by the api or BLE layers -> translated text. */
export function errorText(t: TFunction, error: unknown): string {
  if (error instanceof AppError) return t(error.key, error.params);
  if (error instanceof TypeError) return t("bridge.network"); // fetch failed: bridge down
  if (error instanceof Error) return bridgeMessageText(t, error.message);
  return String(error);
}
