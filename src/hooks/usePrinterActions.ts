// Actions on the bridge (React Query mutations) and on-demand queries.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bridge } from "../api/client";
import type { BridgeState } from "../api/types";
import { AppError } from "../lib/errors";
import { queryKeys } from "./queryKeys";

/** Searches the LAN for printers (takes about 6 s). */
export function useDiscover() {
  return useMutation({ mutationFn: () => bridge.discover(6000) });
}

export function useConnect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (v: {
      ip: string;
      name?: string;
      sn?: string;
      wakeMs?: number;
    }) => bridge.connect(v.ip, { name: v.name, sn: v.sn, wakeMs: v.wakeMs }),
    onSuccess: (state) => queryClient.setQueryData(queryKeys.state, state),
  });
}

export function useDisconnect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bridge.disconnect,
    onSuccess: (state) => queryClient.setQueryData(queryKeys.state, state),
  });
}

/** "Reset network link": closes the sockets and opens them again with the same printer. */
export function useResetLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (printer: BridgeState) => {
      await bridge.disconnect();
      return bridge.connect(printer.ip!, {
        name: printer.info?.name ?? undefined,
        sn: printer.info?.sn ?? undefined,
      });
    },
    onSuccess: (state) => queryClient.setQueryData(queryKeys.state, state),
  });
}

/** Ping test from the bridge to the printer, plus the bridge machine's own Wi-Fi. */
export function useLinkTest() {
  return useMutation({ mutationFn: (ip?: string) => bridge.linkTest(ip) });
}

/** Re-reads the printer state from the bridge ("Sync"). */
export function useRefreshState() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.state });
}

/** Wi-Fi networks seen from the bridge machine. Runs only when refetch() is called. */
export function useWifiScan() {
  return useQuery({
    queryKey: queryKeys.wifiScan,
    queryFn: bridge.wifiScan,
    enabled: false,
    staleTime: 60_000,
  });
}

/** Gateway of the network the bridge is on (in hotspot mode, the printer itself). */
export function useGateway() {
  return useMutation({ mutationFn: bridge.gateway });
}

export function useCancelPrint() {
  return useMutation({ mutationFn: bridge.cancel });
}

/**
 * Connects to the printer through its own hotspot: the bridge machine must already be on the
 * printer's network, whose gateway is the printer.
 */
export function useConnectThroughHotspot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (v: {
      hotspotSsid: string;
      name?: string;
      sn?: string;
    }) => {
      const gateway = await bridge.gateway();
      const hostSsid = gateway.wifi?.ssid ?? "";
      const onHotspot = v.hotspotSsid
        ? hostSsid === v.hotspotSsid
        : hostSsid.startsWith("DIRECT-");
      if (!onHotspot)
        throw new AppError("connection.hotspot.notOnHotspot", {
          ssid: hostSsid || "—",
        });
      try {
        // The printer may still be bringing its hotspot up: give it time to wake.
        return await bridge.connect(gateway.gateway, {
          name: v.name,
          sn: v.sn,
          wakeMs: 8000,
        });
      } catch {
        throw new AppError("connection.hotspot.noAnswer", {
          ip: gateway.gateway,
        });
      }
    },
    onSuccess: (state) => queryClient.setQueryData(queryKeys.state, state),
  });
}
