function nonNegativeInteger(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !/^\d+$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : null;
}

export function normalizePokemonPage(payload, currentPage, perPage) {
  const data = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(data)) throw new TypeError("La API no devolvió una lista de Pokémon válida");
  const reportedTotal = Array.isArray(payload) ? null
    : nonNegativeInteger(payload.total ?? payload.totalPokemons ?? payload.count);
  // A full page without metadata does not tell us how large the catalogue is.
  // A short page does let us infer its end, without hardcoding Pokémon counts.
  const total = reportedTotal ?? (data.length < perPage ? (currentPage - 1) * perPage + data.length : null);
  return { data, total };
}

export function getPageCount(total, currentPage, itemCount, perPage) {
  if (total != null) return Math.max(1, Math.ceil(total / perPage));
  return currentPage + (itemCount >= perPage ? 1 : 0);
}
