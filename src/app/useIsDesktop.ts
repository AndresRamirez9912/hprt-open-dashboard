// Desktop (Web screens) from 1024 px; below that, the Mobile screens.
import { useSyncExternalStore } from "react";

const query = window.matchMedia("(min-width: 1024px)");

function subscribe(onChange: () => void) {
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, () => query.matches);
}
