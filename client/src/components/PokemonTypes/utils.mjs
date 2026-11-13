export const typeNames = {
  normal: "Normal", fire: "Fuego", water: "Agua", electric: "Eléctrico",
  grass: "Planta", ice: "Hielo", fighting: "Lucha", poison: "Veneno",
  ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
  rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro",
  steel: "Acero", fairy: "Hada",
};
export const pokemonTypes = types => (Array.isArray(types) ? types : [])
  .map(type => typeof type === "string" ? type : type?.name).filter(Boolean);
export const pokemonNumber = id => /^\d+$/.test(String(id)) ? `N.º ${String(id).padStart(4, "0")}` : "Pokémon creado";
