import type { ReactNode } from "react";
import type { Route } from "../../app/router";
import { BridgeOfflineBanner } from "../organisms/BridgeOfflineBanner";
import { PrintJobPill } from "../organisms/PrintJobPill";
import { PrintProgressDialog } from "../organisms/PrintProgressDialog";
import { SideBar } from "../organisms/SideBar";
import { TopBar } from "../organisms/TopBar";
import styles from "./WebShell.module.scss";

/** Web (desktop) screens: side bar, top bar and the page. */
export function WebShell({
  route,
  children,
}: {
  route: Route;
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <SideBar route={route} />
      <div className={styles.content}>
        <TopBar />
        <main className={styles.main}>
          <BridgeOfflineBanner />
          {children}
        </main>
      </div>
      <PrintProgressDialog />
      <PrintJobPill />
    </div>
  );
}
