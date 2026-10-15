import type { JSX } from "react";
import { MobileShell } from "../components/templates/MobileShell";
import { WebShell } from "../components/templates/WebShell";
import { useBridgeEvents } from "../hooks/useBridge";
import * as Mobile from "../pages/mobile";
import * as Web from "../pages/web";
import { useRoute, type Route } from "./router";
import { useIsDesktop } from "./useIsDesktop";

const MOBILE: Record<Route, () => JSX.Element> = {
  print: Mobile.PrintPage,
  status: Mobile.StatusPage,
  connection: Mobile.ConnectionPage,
  logs: Mobile.LogsPage,
};

const WEB: Record<Route, () => JSX.Element> = {
  print: Web.PrintPage,
  status: Web.StatusPage,
  connection: Web.ConnectionPage,
  logs: Web.LogsPage,
};

/** Picks the Web screens from 1024 px and the Mobile screens below. */
export function App() {
  const route = useRoute();
  const desktop = useIsDesktop();
  useBridgeEvents();

  if (desktop) {
    const Page = WEB[route];
    return (
      <WebShell route={route}>
        <Page />
      </WebShell>
    );
  }
  const Page = MOBILE[route];
  return (
    <MobileShell route={route}>
      <Page />
    </MobileShell>
  );
}
