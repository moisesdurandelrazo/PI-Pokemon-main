// Módulo para importar desde tu frontend. No contiene claves ni lee la cookie.
export function createPokemonClient(baseUrl, fetchImpl = globalThis.fetch) {
  const base = baseUrl.replace(/\/$/, "");
  let csrfToken;
  async function call(path, { method = "GET", body, csrf = false } = {}) {
    const headers = {};
    if (body !== undefined || csrf) headers["Content-Type"] = "application/json";
    if (csrf) {
      if (!csrfToken) await me();
      if (typeof csrfToken !== "string" || !csrfToken) throw new Error("No se pudo validar la sesión");
      headers["X-CSRF-Token"] = csrfToken;
    }
    const response = await fetchImpl(`${base}${path}`, {
      method, credentials: "include", redirect: "error", headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const data = response.status === 204 ? null : await response.json();
    if (!response.ok) {
      if (response.status === 401) csrfToken = undefined;
      const error = new Error(data?.msg || "No se pudo completar la solicitud");
      error.status = response.status;
      throw error;
    }
    if (data?.csrfToken) csrfToken = data.csrfToken;
    return data;
  }
  const me = () => call("/auth/me");
  return {
    register: (email, password) => call("/auth/register", { method: "POST", body: { email, password } }),
    login: (email, password) => call("/auth/login", { method: "POST", body: { email, password } }),
    me,
    async logout() {
      await call("/auth/logout", { method: "POST", csrf: true });
      csrfToken = undefined;
    },
    createPokemon: pokemon => call("/pokemons", { method: "POST", body: pokemon, csrf: true }),
  };
}
