import { Box, Button, MenuItem, Paper, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";
import CatchingPokemonRounded from "@mui/icons-material/CatchingPokemonRounded";
import { getAllpokemons, getTypes } from "../../redux/actions";
import Pokemon from "../Pokemon";
import SearchInput from "../SearchInput";
import { typeNames, pokemonTypes } from "../PokemonTypes/utils.mjs";
import "./Pokemons.css";

const perPage = 12;
export default function Pokemons() {
  const dispatch = useDispatch();
  const pokemons = useSelector(state => state.pokemons);
  const total = useSelector(state => state.totalPokemons || 0);
  const types = useSelector(state => state.types);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState("number");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setFailed(false);
    dispatch(getAllpokemons(page, perPage)).then(result => {
      if (active) { setLoading(false); setFailed(!result); }
    });
    return () => { active = false; };
  }, [dispatch, page, retry]);
  useEffect(() => { dispatch(getTypes()); }, [dispatch]);
  const filtered = (pokemons || []).filter(pokemon => {
    const matches = !search || pokemon.name?.toLowerCase().includes(search.toLowerCase()) || (/^#?\d+$/.test(search) && Number(pokemon.id) === Number(search.replace(/^#/, "")));
    return matches && (!type || pokemonTypes(pokemon.types || pokemon.type).includes(type)) && (!source || (source === "API" ? !isNaN(pokemon.id) : isNaN(pokemon.id)));
  }).sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name, "es");
    if (sort === "attack") return (b.attack || 0) - (a.attack || 0);
    return String(a.id).localeCompare(String(b.id), "es", { numeric: true });
  });
  function clear() { setSearch(""); setType(""); setSource(""); }
  return <main className="page-shell dex-page">
    <div className="dex-heading"><div><p className="page-eyebrow">DESCUBRE EL MUNDO POKÉMON</p><h1 className="page-title">Pokédex</h1></div><span className="dex-heading-mark"><CatchingPokemonRounded aria-hidden="true" /> ¡Hazte con todos!</span></div>
    <section className="dex-search-band" aria-label="Buscar en la Pokédex"><SearchInput key={retry} onSearch={setSearch} /><div className="dex-search-tip"><strong>Tu próximo favorito te está esperando.</strong><p>Descubre sus tipos y estadísticas. Guarda los que más te gusten y crea tu propia colección.</p></div></section>
    <Paper component="section" elevation={0} className="dex-collection" aria-label="Lista de Pokémon">
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
        <TextField select id="dex-type" label="Tipo" value={type} onChange={event => setType(event.target.value)}>
          <MenuItem value="">Todos los tipos</MenuItem>
          {(types || []).map(item => <MenuItem key={item.name} value={item.name}>{typeNames[item.name] || item.name}</MenuItem>)}
        </TextField>
        <TextField select id="dex-source" label="Origen" value={source} onChange={event => setSource(event.target.value)}>
          <MenuItem value="">Todos los Pokémon</MenuItem>
          <MenuItem value="API">Pokédex nacional</MenuItem>
          <MenuItem value="DB">Creados por entrenadores</MenuItem>
        </TextField>
        <TextField select id="dex-sort" label="Ordenar por" value={sort} onChange={event => setSort(event.target.value)}>
          <MenuItem value="number">Número de la Pokédex</MenuItem>
          <MenuItem value="name">Nombre: A–Z</MenuItem>
          <MenuItem value="attack">Mayor ataque</MenuItem>
        </TextField>
      </Box>
      <div className="dex-results-summary"><span>{loading ? "Consultando la Pokédex…" : `${filtered.length} Pokémon en esta página`}</span><span>Página {page}</span></div>
      {loading ? <div className="page-empty" role="status"><CatchingPokemonRounded /><h2>Buscando Pokémon…</h2><p>Estamos preparando tu próxima aventura.</p></div> : failed ? <div className="page-empty" role="alert"><h2>No pudimos cargar la Pokédex</h2><p>Comprueba tu conexión e inténtalo de nuevo.</p><Button variant="contained" onClick={() => setRetry(value => value + 1)}>Reintentar</Button></div> : filtered.length === 0 ? <div className="page-empty"><CatchingPokemonRounded /><h2>No hay Pokémon con estos filtros</h2><p>Prueba otra búsqueda o explora la siguiente página.</p><Button variant="contained" onClick={() => { clear(); setRetry(value => value + 1); }}>Limpiar filtros</Button></div> : <div className="dex-grid">{filtered.map(pokemon => <Pokemon key={pokemon.id} {...pokemon} />)}</div>}
      {!failed && <div className="dex-pagination"><Pagination color="primary" count={Math.max(1, Math.ceil(total / perPage))} page={page} onChange={(_, next) => { setPage(next); clear(); setRetry(value => value + 1); }} shape="rounded" siblingCount={0} disabled={loading} aria-label="Páginas de la Pokédex" /></div>}
    </Paper>
  </main>;
}
