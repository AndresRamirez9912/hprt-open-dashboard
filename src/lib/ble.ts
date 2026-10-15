// Bluetooth LE protocol of HPRT CP4x printers (Web Bluetooth). Over BLE the printer only gives
// its identity and Wi-Fi settings; photos always go over Wi-Fi.
//
// Frames on the command and notify characteristics: 0x7F | len (u16 LE = payload + 1) | cmd | payload

import { AppError } from "./errors";

/** Bluetooth failure; its message is an i18n key (namespace "ble"). */
export class BleError extends AppError {}

const hex = (b: Uint8Array) =>
  [...b].map((x) => x.toString(16).padStart(2, "0")).join("");

export const SERVICE = "1b7e8251-2877-41c3-b46e-cf057c562023";
const CH_NOTIFY = "8ac32d3f-5cb9-4d44-bec2-ee689169f626"; //   responses (notify)
const CH_COMMAND = "42b8df34-94e5-4d8c-a978-d9745546b7bf"; //  command frames
const CH_SECURITY = "cac2aba4-edbb-4c4a-bbaf-0a84a5cd93a1"; // Wi-Fi security: 1 = open, 64 = WPA/WEP
const CH_SSID = "aca0ef7c-eeaa-48ad-9508-19a6cef6b356";
const CH_PASSWORD = "40b7de33-93e4-4c8b-a876-d833b415a6ce";

const BleCmd = {
  SN: 1,
  AP_MODE: 2,
  WIFI_INFO: 4,
  STA_RESULT: 5,
  BT_FIRMWARE: 6,
} as const;

export interface WifiInfo {
  mode: "STA" | "AP";
  ssid: string;
  security: string;
  ip: string;
}

/** "192.168.002.152" -> "192.168.2.152" (the printer zero-pads octets). */
export const normalizeIp = (ip: string) =>
  /^\d{1,3}(\.\d{1,3}){3}$/.test(ip.trim())
    ? ip
        .trim()
        .split(".")
        .map((o) => String(Number(o)))
        .join(".")
    : ip.trim();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const frame = (cmd: number) => new Uint8Array([0x7f, 0x01, 0x00, cmd]);
const text = (b: Uint8Array) =>
  new TextDecoder().decode(b).replace(/\0/g, "").trim();

export function isBluetoothAvailable() {
  return typeof navigator !== "undefined" && "bluetooth" in navigator;
}

export class Cp4xBle {
  private device: BluetoothDevice;
  private chars = new Map<string, BluetoothRemoteGATTCharacteristic>();
  private waiters: { cmd: number; resolve: (p: Uint8Array) => void }[] = [];
  onDisconnect?: () => void;
  /** Receives one line per BLE frame sent or received (for the protocol log). */
  onLog?: (line: string) => void;

  private constructor(device: BluetoothDevice) {
    this.device = device;
  }

  get name() {
    return this.device.name ?? "Printer";
  }

  /** Opens the browser device chooser filtered to HPRT CP4x printers. */
  static async request(): Promise<Cp4xBle> {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE] }],
    });
    const ble = new Cp4xBle(device);
    await ble.connect();
    return ble;
  }

  private listening = new WeakSet<BluetoothRemoteGATTCharacteristic>();
  private closedByUser = false;

  /**
   * Chrome reports "GATT Server is disconnected. Cannot retrieve services" when the link drops
   * between connect() and service discovery, which the printer does while it restarts its radio.
   */
  private async connect(attempts = 4) {
    let last: unknown;
    for (let i = 0; i < attempts; i++) {
      try {
        return await this.connectOnce();
      } catch (e) {
        last = e;
        await sleep(1000 * (i + 1));
      }
    }
    throw last;
  }

  private async connectOnce() {
    const server = await this.device.gatt!.connect();
    const service = await server.getPrimaryService(SERVICE);
    for (const uuid of [
      CH_NOTIFY,
      CH_COMMAND,
      CH_SECURITY,
      CH_SSID,
      CH_PASSWORD,
    ]) {
      this.chars.set(uuid, await service.getCharacteristic(uuid));
    }
    const notify = this.chars.get(CH_NOTIFY)!;
    if (!this.listening.has(notify)) {
      this.listening.add(notify);
      notify.addEventListener("characteristicvaluechanged", (e) => {
        const v = (e.target as BluetoothRemoteGATTCharacteristic).value!;
        this.onNotify(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
      });
    }
    await notify.startNotifications();
  }

  /**
   * The printer drops idle BLE links (or stops notifying) after a while. Re-open GATT and
   * re-subscribe to notifications before talking to it again.
   */
  private async ensureConnected(force = false) {
    if (!force && this.device.gatt?.connected) return;
    if (force) this.device.gatt?.disconnect();
    await this.connect();
  }

  disconnect() {
    if (this.closedByUser) return;
    this.closedByUser = true;
    this.device.gatt?.disconnect();
    this.onDisconnect?.();
  }

  private onNotify(data: Uint8Array) {
    this.onLog?.(`ble rx ${hex(data)}`);
    if (data.length < 4 || data[0] !== 0x7f) return;
    const cmd = data[3];
    const i = this.waiters.findIndex((w) => w.cmd === cmd);
    if (i >= 0) this.waiters.splice(i, 1)[0].resolve(data);
  }

  private wait(cmd: number, timeoutMs: number) {
    return new Promise<Uint8Array>((resolve, reject) => {
      const w = { cmd, resolve };
      this.waiters.push(w);
      setTimeout(() => {
        const i = this.waiters.indexOf(w);
        if (i >= 0) {
          this.waiters.splice(i, 1);
          reject(new BleError("ble.noAnswer"));
        }
      }, timeoutMs);
    });
  }

  private async write(uuid: string, value: Uint8Array) {
    // Never log the Wi-Fi password.
    this.onLog?.(
      uuid === CH_PASSWORD
        ? `ble tx ${uuid.slice(0, 8)} (${value.length} bytes hidden)`
        : `ble tx ${uuid.slice(0, 8)} ${hex(value)}`,
    );
    await this.chars.get(uuid)!.writeValueWithResponse(value);
  }

  private async command(cmd: number, timeoutMs = 15000) {
    for (let attempt = 0; ; attempt++) {
      try {
        await this.ensureConnected(attempt > 0);
        const answer = this.wait(
          cmd,
          attempt === 0 ? Math.min(timeoutMs, 6000) : timeoutMs,
        );
        await this.write(CH_COMMAND, frame(cmd));
        return await answer;
      } catch (e) {
        if (attempt >= 1) throw e;
        // First failure: reconnect GATT and try once more.
      }
    }
  }

  async serialNumber() {
    const d = await this.command(BleCmd.SN);
    const len = d[1] | (d[2] << 8);
    return text(d.subarray(4, 3 + len));
  }

  async bluetoothFirmware() {
    const d = await this.command(BleCmd.BT_FIRMWARE);
    return `${d[6]}.${d[5]}.${d[4]}`;
  }

  /** cmd 4: mode(1 = STA) | ssidLen ssid | typeLen type | pwdLen pwd(masked) | ipLen ip */
  async wifiInfo(): Promise<WifiInfo> {
    const d = await this.command(BleCmd.WIFI_INFO, 20000);
    let p = 5;
    const field = () => {
      const n = d[p] ?? 0;
      const s = text(d.subarray(p + 1, p + 1 + n));
      p += 1 + n;
      return s;
    };
    const mode = d[4] === 1 ? "STA" : "AP";
    const ssid = field();
    const security = field();
    field(); // password, masked by the printer
    const ip = normalizeIp(field());
    return { mode, ssid, security, ip };
  }

  /**
   * Join an existing Wi-Fi network (STA). Same order as BtConnection.enableStaMode:
   * read security -> write security -> write SSID -> write password -> wait for cmd 5 with the new IP.
   */
  /** Resolves (with null) if the GATT link drops before `p` settles. */
  private orDisconnect<T>(p: Promise<T>): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const onDrop = () => resolve(null);
      this.device.addEventListener("gattserverdisconnected", onDrop, {
        once: true,
      });
      p.then(resolve, reject).finally(() =>
        this.device.removeEventListener("gattserverdisconnected", onDrop),
      );
    });
  }

  /** After a network switch the printer restarts its radio: wait for BLE to come back and read cmd 4. */
  private async confirmAfterSwitch(
    timeoutMs = 45000,
  ): Promise<WifiInfo | null> {
    const deadline = Date.now() + timeoutMs;
    await sleep(3000);
    while (Date.now() < deadline) {
      try {
        await this.connect(1);
        return await this.wifiInfo();
      } catch {
        await sleep(2000);
      }
    }
    return null;
  }

  /**
   * Join an existing Wi-Fi network (STA). Same order as BtConnection.enableStaMode:
   * read security -> write security -> write SSID -> write password -> wait for cmd 5 [1, ip].
   * Writes are never repeated; if BLE drops meanwhile, the result is read back with cmd 4.
   */
  async joinWifi(
    ssid: string,
    password: string,
    secured = true,
  ): Promise<WifiInfo> {
    await this.ensureConnected();
    await this.chars.get(CH_SECURITY)!.readValue();
    const enc = new TextEncoder();
    const result = this.wait(BleCmd.STA_RESULT, 120000);
    result.catch(() => {});
    await this.write(CH_SECURITY, new Uint8Array([secured ? 64 : 1]));
    await this.write(CH_SSID, enc.encode(ssid));
    await this.write(CH_PASSWORD, enc.encode(password || "12345678"));
    const d = await this.orDisconnect(result);
    if (d) {
      if (d[4] !== 1)
        throw new BleError("ble.joinFailedCode", { ssid, code: d[4] });
      return {
        mode: "STA",
        ssid,
        security: secured ? "WPA/WPA2" : "Open",
        ip: normalizeIp(text(d.subarray(5))),
      };
    }
    const info = await this.confirmAfterSwitch(120000);
    if (!info) throw new BleError("ble.droppedWhileJoining");
    if (info.mode !== "STA" || info.ssid !== ssid)
      throw new BleError("ble.joinFailed", { ssid });
    return info;
  }

  /**
   * Switch the printer to its own hotspot (AP). The answer (cmd 2) is [1, hotspot SSID]
   * (CP4xBluetoothProtocol.enableApMode stores it as the SSID). The hotspot password the app
   * uses is AP_PASSWORD. The printer often drops BLE while switching; then confirm with cmd 4.
   */
  async enableAccessPoint(): Promise<WifiInfo> {
    await this.ensureConnected();
    const answer = this.wait(BleCmd.AP_MODE, 30000);
    answer.catch(() => {});
    await this.write(CH_COMMAND, frame(BleCmd.AP_MODE));
    const d = await this.orDisconnect(answer).catch(() => null);
    if (d && d[4] !== 1) throw new BleError("ble.hotspotRefused");
    const ssid = d ? text(d.subarray(5)) : "";
    const info = await this.confirmAfterSwitch();
    if (info) return info;
    if (ssid) return { mode: "AP", ssid, security: "", ip: "" };
    throw new BleError("ble.droppedWhileHotspot");
  }
}

/** Hotspot password used by the app for CP4x printers (CP4xBasePrinter.R1()). */
export const AP_PASSWORD = "12345678";
