import { createPokemonClient } from "./api.mjs";
import { baseUrl } from "../utils";

export const authApi = createPokemonClient(baseUrl || "");
let state = { user: null, loading: true, error: "" };
let restoring;
const listeners = new Set();
const update = patch => {
  state = { ...state, ...patch };
  listeners.forEach(listener => listener());
};
export const authStore = {
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  getSnapshot() { return state; },
  restore() {
    if (!state.loading) return Promise.resolve();
    if (restoring) return restoring;
    restoring = authApi.me()
      .then(({ user }) => update({ user, error: "" }))
      .catch(error => update({ user: null, error: error.status === 401 ? "" : "No se pudo comprobar tu sesión. Inténtalo de nuevo." }))
      .finally(() => { update({ loading: false }); restoring = undefined; });
    return restoring;
  },
  async retry() { update({ loading: true, error: "" }); await this.restore(); },
  async login(email, password) {
    const result = await authApi.login(email, password);
    update({ user: result.user, loading: false, error: "" });
  },
  async register(email, password) {
    const result = await authApi.register(email, password);
    update({ user: result.user, loading: false, error: "" });
  },
  async logout() {
    try { await authApi.logout(); }
    catch (error) { if (error.status !== 401) throw error; }
    update({ user: null, loading: false, error: "" });
  },
  signedOut() { update({ user: null, loading: false, error: "" }); },
};
