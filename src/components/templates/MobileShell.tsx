import type { ReactNode } from "react";
import type { Route } from "../../app/router";
import { AppHeader } from "../organisms/AppHeader";
import { BridgeOfflineBanner } from "../organisms/BridgeOfflineBanner";
import { PrintJobPill } from "../organisms/PrintJobPill";
import { PrintProgressDialog } from "../organisms/PrintProgressDialog";
import { NavBar } from "../organisms/NavBar";
import styles from "./MobileShell.module.scss";

/** Mobile screens: top header, page, bottom tab bar. */
export function MobileShell({
  route,
  children,
}: {
  route: Route;
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <AppHeader route={route} />
      <main className={styles.main}>
        <BridgeOfflineBanner />
        {children}
      </main>
      <NavBar route={route} />
      <PrintProgressDialog />
      <PrintJobPill aboveNavBar />
    </div>
  );
}
