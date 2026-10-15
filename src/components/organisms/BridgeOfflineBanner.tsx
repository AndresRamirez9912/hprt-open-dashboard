import { useTranslation } from "react-i18next";
import { useBridgeOnline } from "../../hooks/useBridge";
import { Callout } from "../molecules/Callout";

/** Shown when the event stream to the local bridge is down. */
export function BridgeOfflineBanner() {
  const { t } = useTranslation();
  if (useBridgeOnline() !== false) return null;
  return (
    <Callout tone="error" icon="cloud_off">
      {t("app.bridgeOffline")}
    </Callout>
  );
}
