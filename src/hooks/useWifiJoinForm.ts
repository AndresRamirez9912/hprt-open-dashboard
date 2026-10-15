// Form to move the printer to another Wi-Fi network (sent over Bluetooth).
import { useState } from "react";
import { useBluetooth } from "../state/Bluetooth";

export const MANUAL_SSID = "__manual__";

export function useWifiJoinForm() {
  const bt = useBluetooth();
  const [ssid, setSsid] = useState("");
  const [manualSsid, setManualSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [secured, setSecured] = useState(true);

  const manual = ssid === MANUAL_SSID;
  const target = (manual ? manualSsid : ssid).trim();

  return {
    /** Chosen network, or MANUAL_SSID when typing it. */
    ssid,
    setSsid,
    manual,
    manualSsid,
    setManualSsid,
    password,
    setPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword(!showPassword),
    secured,
    setSecured,
    joining: bt.busy === "joining",
    canJoin: Boolean(
      bt.ble && target && (!secured || password) && bt.busy === null,
    ),
    join: () => void bt.joinWifi(target, password, secured),
  };
}
