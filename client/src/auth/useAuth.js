import { useEffect, useSyncExternalStore } from "react";
import { authStore } from "./store";

export function useAuth() {
  const state = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
  useEffect(() => { void authStore.restore(); }, []);
  return state;
}
