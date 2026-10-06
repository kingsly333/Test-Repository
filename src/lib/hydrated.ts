"use client";
import { useSyncExternalStore } from "react";

/** false on the server and first client render, true afterwards. Avoids date/localStorage mismatches. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
