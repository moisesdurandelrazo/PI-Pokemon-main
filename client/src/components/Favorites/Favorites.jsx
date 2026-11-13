import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CatchingPokemonRounded from "@mui/icons-material/CatchingPokemonRounded";
import { removeFavorite } from "../../redux/actions";
import fallbackImage from "../../images/poke.png";
import "./Favorites.css";

const typeLabels = {
  normal: "Normal", fire: "Fuego", water: "Agua", electric: "Eléctrico",
  grass: "Planta", ice: "Hielo", fighting: "Lucha", poison: "Veneno",
  ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
  rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro",
  steel: "Acero", fairy: "Hada",
};
const getTypes = pokemon => (Array.isArray(pokemon.types) ? pokemon.types : Array.isArray(pokemon.type) ? pokemon.type : [])
  .map(type => typeof type === "string" ? type : type?.name).filter(Boolean);
const getNumber = id => /^\d+$/.test(String(id)) ? `N.º ${String(id).padStart(4, "0")}` : "Pokémon creado";

export default function Favorites() {
  const dispatch = useDispatch();
  const savedFavorites = useSelector(state => state.favorites);
  const favorites = (savedFavorites || []).filter(pokemon => pokemon && pokemon.id != null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("saved");
  const [announcement, setAnnouncement] = useState("");
  const availableTypes = [...new Set(favorites.flatMap(getTypes))].sort();
  // A removed Pokémon may have been the last one of the selected type.
  const activeType = availableTypes.includes(type) ? type : "";
  const query = search.trim().toLocaleLowerCase("es");
  const filtered = favorites.filter(pokemon => {
    const matchesSearch = pokemon.name?.toLocaleLowerCase("es").includes(query)
      || String(pokemon.id).toLowerCase().includes(query)
      || getNumber(pokemon.id).toLowerCase().includes(query);
    return matchesSearch && (!activeType || getTypes(pokemon).includes(activeType));
  }).reverse().sort((a, b) => {
    if (sort === "name") return (a.name || "").localeCompare(b.name || "", "es");
    if (sort === "number") return String(a.id).localeCompare(String(b.id), "es", { numeric: true });
    return 0;
  });
  function resetFilters() { setSearch(""); setType(""); setSort("saved"); }
  function remove(pokemon) {
    dispatch(removeFavorite(pokemon.id));
    setAnnouncement(`${pokemon.name} se ha quitado de tus favoritos.`);
  }

  return (
    <main className="favorites-page">
      <div className="favorites-shell">
        <div className="favorites-breadcrumb"><Link to="/pokemons">Pokédex</Link><span aria-hidden="true">/</span><span>Mis favoritos</span></div>
        <section className="favorites-intro" aria-labelledby="favorites-title">
          <div>
            <p className="favorites-eyebrow"><span aria-hidden="true" /> TU COLECCIÓN PERSONAL</p>
            <h1 id="favorites-title">Mis favoritos<span className="favorites-title-dot">.</span></h1>
            <p className="favorites-subtitle">Cada entrenador tiene sus imprescindibles. Estos son los tuyos.</p>
          </div>
          <div className="favorites-total"><FavoriteRounded aria-hidden="true" /><div><strong>{favorites.length}</strong><span>Pokémon {favorites.length === 1 ? "guardado" : "guardados"}</span></div></div>
        </section>

        {favorites.length > 0 && <section className="favorites-filters" aria-label="Buscar y filtrar favoritos">
          <div className="favorites-search-group">
            <label htmlFor="favorite-search">Encuentra a tu favorito</label>
            <div className="favorites-search"><SearchRounded aria-hidden="true" /><input id="favorite-search" type="search" placeholder="Nombre o número de la Pokédex" value={search} onChange={event => setSearch(event.target.value)} /></div>
            <p>Busca entre los Pokémon que has añadido a tu colección.</p>
          </div>
          <div className="favorites-type-group"><label htmlFor="favorite-type">Tipo de Pokémon</label><select id="favorite-type" value={activeType} onChange={event => setType(event.target.value)}><option value="">Todos los tipos</option>{availableTypes.map(name => <option key={name} value={name}>{typeLabels[name] || name}</option>)}</select></div>
        </section>}

        <section className="favorites-collection" aria-label="Colección de favoritos">
          <div className="favorites-toolbar">
            <p aria-live="polite"><span className="favorites-toolbar-icon" aria-hidden="true"><CatchingPokemonRounded /></span>{favorites.length ? <><strong>{filtered.length}</strong> de {favorites.length} Pokémon</> : "Tu próxima aventura empieza aquí"}</p>
            {favorites.length > 0 && <div className="favorites-sort"><label htmlFor="favorite-sort">Ordenar por</label><select id="favorite-sort" value={sort} onChange={event => setSort(event.target.value)}><option value="saved">Añadidos recientemente</option><option value="number">Número de la Pokédex</option><option value="name">Nombre: A–Z</option></select></div>}
          </div>
          <p className="favorites-sr-only" role="status">{announcement}</p>

          {favorites.length === 0 ? <div className="favorites-empty">
            <div className="favorites-empty-art" aria-hidden="true"><CatchingPokemonRounded /><span><FavoriteRounded /></span></div>
            <p className="favorites-eyebrow">HAZ SITIO PARA TUS FAVORITOS</p>
            <h2>Una colección llena de posibilidades</h2>
            <p>Explora la Pokédex y añade los Pokémon que más te gusten.<br />Aquí tendrás a todos tus favoritos, siempre a mano.</p>
            <Link className="favorites-explore" to="/pokemons">Explorar la Pokédex <ArrowForwardRounded aria-hidden="true" /></Link>
          </div> : filtered.length === 0 ? <div className="favorites-empty favorites-no-results"><SearchRounded aria-hidden="true" /><h2>No encontramos ese Pokémon</h2><p>Prueba con otro nombre, número o tipo.</p><button className="favorites-explore" onClick={resetFilters}>Limpiar filtros</button></div> : <div className="favorites-grid">
            {filtered.map(pokemon => <article className="favorite-card" key={pokemon.id}>
              <div className="favorite-card-visual">
                <Link className="favorite-image-link" to={`/pokemons/${encodeURIComponent(pokemon.id)}`} aria-label={`Ver detalles de ${pokemon.name}`}>
                  <span className="favorite-card-ball" aria-hidden="true"><CatchingPokemonRounded /></span>
                  <img src={pokemon.img || fallbackImage} alt={pokemon.name || "Pokémon"} loading="lazy" width="240" height="240" onError={event => { if (event.currentTarget.getAttribute("src") !== fallbackImage) event.currentTarget.src = fallbackImage; }} />
                </Link>
                <button className="favorite-remove" onClick={() => remove(pokemon)} aria-label={`Quitar a ${pokemon.name} de favoritos`} title="Quitar de favoritos"><FavoriteRounded aria-hidden="true" /></button>
              </div>
              <div className="favorite-card-info"><p className="favorite-number">{getNumber(pokemon.id)}</p><Link to={`/pokemons/${encodeURIComponent(pokemon.id)}`} className="favorite-name"><h2>{pokemon.name || "Pokémon"}</h2><ArrowForwardRounded aria-hidden="true" /></Link><div className="favorite-types">{getTypes(pokemon).map(name => <span key={name} className={`favorite-type favorite-type--${Object.hasOwn(typeLabels, name) ? name : "normal"}`}>{typeLabels[name] || name}</span>)}</div></div>
            </article>)}
          </div>}
          {favorites.length > 0 && <div className="favorites-bottom"><span><FavoriteRounded aria-hidden="true" /> Un equipo muy tuyo.</span><Link to="/pokemons">Seguir explorando <ArrowForwardRounded aria-hidden="true" /></Link></div>}
        </section>
      </div>
    </main>
  );
}
