// Minimal hash router for the four tabs (#/print, #/status, #/connection, #/logs).
import { useSyncExternalStore } from "react";

export const ROUTES = ["print", "status", "connection", "logs"] as const;
export type Route = (typeof ROUTES)[number];

function currentRoute(): Route {
  const name = window.location.hash.replace(/^#\/?/, "");
  return (ROUTES as readonly string[]).includes(name)
    ? (name as Route)
    : "print";
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, currentRoute);
}

export const hrefFor = (route: Route) => `#/${route}`;

export function navigate(route: Route) {
  window.location.hash = `/${route}`;
}
