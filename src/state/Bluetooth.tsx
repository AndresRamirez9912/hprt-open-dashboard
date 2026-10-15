// Bluetooth session with the printer (Web Bluetooth runs in the browser, not in the bridge).
// Shared by the Connection page (actions) and the Logs page (its frames).
import { createContext, useContext, useState, type ReactNode } from "react";
import type { LogEntry } from "../api/types";
import { Cp4xBle, type WifiInfo } from "../lib/ble";

export type BleBusy = "pairing" | "reading" | "joining" | "hotspot" | null;

interface BluetoothState {
  ble: Cp4xBle | null;
  serial: string;
  btFirmware: string;
  wifi: WifiInfo | null;
  busy: BleBusy;
  error: unknown;
  logs: LogEntry[];
}

interface BluetoothApi extends BluetoothState {
  /** Opens the browser's device chooser. */
  pair: () => Promise<void>;
  refresh: () => Promise<void>;
  disconnect: () => void;
  joinWifi: (ssid: string, password: string, secured: boolean) => Promise<void>;
  enableHotspot: () => Promise<void>;
}

const Context = createContext<BluetoothApi | null>(null);

const MAX_BLE_LOGS = 300;

export function BluetoothProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BluetoothState>({
    ble: null,
    serial: "",
    btFirmware: "",
    wifi: null,
    busy: null,
    error: null,
    logs: [],
  });
  const update = (patch: Partial<BluetoothState>) =>
    setState((s) => ({ ...s, ...patch }));
  const log = (msg: string) =>
    setState((s) => ({
      ...s,
      logs: [...s.logs, { t: Date.now(), msg }].slice(-MAX_BLE_LOGS),
    }));

  /** Runs a BLE operation, keeping `busy` and `error` up to date. */
  const run = async (busy: BleBusy, op: () => Promise<void>) => {
    update({ busy, error: null });
    try {
      await op();
    } catch (error) {
      // NotFoundError: the user closed the device chooser. Not an error to show.
      if (!(error instanceof DOMException && error.name === "NotFoundError")) {
        update({ error });
        log(
          `ble error: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    } finally {
      update({ busy: null });
    }
  };

  const readPrinter = async (ble: Cp4xBle) => {
    const serial = await ble.serialNumber();
    const btFirmware = await ble.bluetoothFirmware();
    const wifi = await ble.wifiInfo();
    update({ serial, btFirmware, wifi });
    log(
      `ble printer ${ble.name}: sn ${serial}, bt ${btFirmware}, wifi ${wifi.mode} "${wifi.ssid}" ${wifi.ip}`,
    );
  };

  const api: BluetoothApi = {
    ...state,
    pair: () =>
      run("pairing", async () => {
        const ble = await Cp4xBle.request();
        ble.onLog = log;
        ble.onDisconnect = () => {
          log("ble disconnected");
          update({ ble: null });
        };
        log(`ble paired ${ble.name}`);
        update({ ble, busy: "reading" });
        await readPrinter(ble);
      }),
    refresh: () =>
      run("reading", async () => {
        if (state.ble) await readPrinter(state.ble);
      }),
    disconnect: () => state.ble?.disconnect(),
    joinWifi: (ssid, password, secured) =>
      run("joining", async () => {
        if (!state.ble) return;
        log(`ble join wifi "${ssid}"`);
        update({ wifi: await state.ble.joinWifi(ssid, password, secured) });
      }),
    enableHotspot: () =>
      run("hotspot", async () => {
        if (!state.ble) return;
        log("ble enable hotspot");
        update({ wifi: await state.ble.enableAccessPoint() });
      }),
  };

  return <Context.Provider value={api}>{children}</Context.Provider>;
}

export function useBluetooth(): BluetoothApi {
  const ctx = useContext(Context);
  if (!ctx)
    throw new Error("useBluetooth must be used inside <BluetoothProvider>");
  return ctx;
}
