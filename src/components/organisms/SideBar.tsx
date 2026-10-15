import { useTranslation } from "react-i18next";
import { hrefFor, ROUTES, type Route } from "../../app/router";
import { usePrinter } from "../../hooks/useBridge";
import { modelFromName } from "../../lib/printers";
import { Icon } from "../atoms/Icon";
import { NavItem } from "../molecules/NavItem";
import { SideDeviceCard } from "./SideDeviceCard";
import styles from "./SideBar.module.scss";

const ICONS: Record<Route, string> = {
  print: "photo_prints",
  status: "tune",
  connection: "wifi",
  logs: "receipt_long",
};

/** Desktop side bar: brand, printer chip, the four sections and the device card. */
export function SideBar({ route }: { route: Route }) {
  const { t } = useTranslation();
  const printer = usePrinter();
  const model = modelFromName(printer?.info?.name).id;

  return (
    <aside className={styles.bar}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <Icon name="print" />
          </span>
          <span className={styles.names}>
            <strong>{t("app.brand")}</strong>
            {printer && <small>{model}</small>}
          </span>
        </div>
        <span
          className={`${styles.chip} ${printer ? (printer.reconnecting ? styles.warn : "") : styles.off}`}
        >
          <span className={styles.dot} />
          {printer
            ? t(printer.reconnecting ? "web.reconnecting" : "web.online", {
                model,
              })
            : t("web.offline")}
        </span>
        <nav className={styles.nav} aria-label={t("app.brand")}>
          {ROUTES.map((r) => (
            <NavItem
              key={r}
              variant="side"
              href={hrefFor(r)}
              icon={ICONS[r]}
              label={t(`web.nav.${r}`)}
              active={r === route}
            />
          ))}
        </nav>
      </div>
      <SideDeviceCard />
    </aside>
  );
}
