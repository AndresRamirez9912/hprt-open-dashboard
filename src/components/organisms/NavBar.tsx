import { useTranslation } from "react-i18next";
import { hrefFor, ROUTES, type Route } from "../../app/router";
import { NavItem } from "../molecules/NavItem";
import styles from "./NavBar.module.scss";

const ICONS: Record<Route, string> = {
  print: "photo_camera",
  status: "print",
  connection: "wifi_tethering",
  logs: "terminal",
};

/** The four tabs: bottom bar on mobile/tablet, left side bar on desktop. */
export function NavBar({ route }: { route: Route }) {
  const { t } = useTranslation();
  return (
    <nav className={styles.nav} aria-label={t("app.brand")}>
      {ROUTES.map((r) => (
        <NavItem
          key={r}
          href={hrefFor(r)}
          icon={ICONS[r]}
          label={t(`nav.${r}`)}
          active={r === route}
        />
      ))}
    </nav>
  );
}
