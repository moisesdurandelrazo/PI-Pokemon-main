import { useState } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Box, Breadcrumbs, Button, Chip, Divider, InputAdornment, Link, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CatchingPokemonRounded from "@mui/icons-material/CatchingPokemonRounded";
import Pokemon from "../Pokemon";
import { pokemonNumber, pokemonTypes, typeNames } from "../PokemonTypes/utils.mjs";

const getTypes = pokemon => pokemonTypes(pokemon.types || pokemon.type);

export default function Favorites() {
  const savedFavorites = useSelector(state => state.favorites);
  const favorites = (savedFavorites || []).filter(pokemon => pokemon && pokemon.id != null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("saved");
  const [announcement, setAnnouncement] = useState("");
  const availableTypes = [...new Set(favorites.flatMap(getTypes))].sort();
  const activeType = availableTypes.includes(type) ? type : "";
  const query = search.trim().toLocaleLowerCase("es");
  const filtered = favorites.filter(pokemon => {
    const matches = pokemon.name?.toLocaleLowerCase("es").includes(query)
      || String(pokemon.id).toLowerCase().includes(query)
      || pokemonNumber(pokemon.id).toLowerCase().includes(query);
    return matches && (!activeType || getTypes(pokemon).includes(activeType));
  }).reverse().sort((a, b) => {
    if (sort === "name") return (a.name || "").localeCompare(b.name || "", "es");
    if (sort === "number") return String(a.id).localeCompare(String(b.id), "es", { numeric: true });
    return 0;
  });

  function resetFilters() { setSearch(""); setType(""); setSort("saved"); }

  return (
    <Box component="main" className="page-shell">
      <Breadcrumbs sx={{ mb: 3, fontSize: 12 }}>
        <Link component={RouterLink} to="/pokemons">Pokédex</Link>
        <Typography variant="caption">Mis favoritos</Typography>
      </Breadcrumbs>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="overline" color="primary">Tu colección personal</Typography>
          <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 34, sm: 44 }, mb: 1 }}>Mis favoritos.</Typography>
          <Typography variant="body2" color="text.secondary">Cada entrenador tiene sus imprescindibles. Estos son los tuyos.</Typography>
        </Box>
        <Chip icon={<FavoriteRounded />} label={`${favorites.length} Pokémon ${favorites.length === 1 ? "guardado" : "guardados"}`} color="primary" variant="outlined" sx={{ height: 40, px: 1 }} />
      </Stack>
      <Paper component="section" variant="outlined" aria-label="Colección de favoritos" sx={{ p: { xs: 2, sm: 4 } }}>
        {favorites.length > 0 && (
          <Stack spacing={2.5}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField id="favorite-search" label="Encuentra a tu favorito" type="search" placeholder="Nombre o número de la Pokédex" value={search} onChange={event => setSearch(event.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> } }} />
              <TextField select id="favorite-type" label="Tipo de Pokémon" value={activeType} onChange={event => setType(event.target.value)}>
                <MenuItem value="">Todos los tipos</MenuItem>
                {availableTypes.map(name => <MenuItem key={name} value={name}>{typeNames[name] || name}</MenuItem>)}
              </TextField>
              <TextField select id="favorite-sort" label="Ordenar por" value={sort} onChange={event => setSort(event.target.value)}>
                <MenuItem value="saved">Añadidos recientemente</MenuItem>
                <MenuItem value="number">Número de la Pokédex</MenuItem>
                <MenuItem value="name">Nombre: A–Z</MenuItem>
              </TextField>
            </Stack>
            <Typography variant="caption" color="text.secondary" aria-live="polite">{filtered.length} de {favorites.length} Pokémon</Typography>
          </Stack>
        )}
        <Box role="status" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>{announcement}</Box>
        {favorites.length === 0 ? (
          <Stack alignItems="center" spacing={2} sx={{ textAlign: "center", py: { xs: 5, sm: 8 } }}>
            <CatchingPokemonRounded sx={{ fontSize: 100, color: "#cfdcc5" }} />
            <Typography variant="overline" color="primary">Haz sitio para tus favoritos</Typography>
            <Typography variant="h2" component="h2">Una colección llena de posibilidades</Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={440}>Explora la Pokédex y añade los Pokémon que más te gusten. Aquí tendrás a todos tus favoritos, siempre a mano.</Typography>
            <Button component={RouterLink} to="/pokemons" variant="contained" endIcon={<ArrowForwardRounded />}>Explorar la Pokédex</Button>
          </Stack>
        ) : filtered.length === 0 ? (
          <Stack alignItems="center" spacing={2} py={7} textAlign="center">
            <SearchRounded color="disabled" sx={{ fontSize: 48 }} />
            <Typography component="h2" variant="h2">No encontramos ese Pokémon</Typography>
            <Typography color="text.secondary">Prueba con otro nombre, número o tipo.</Typography>
            <Button variant="contained" onClick={resetFilters}>Limpiar filtros</Button>
          </Stack>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }, gap: { xs: 1.5, sm: 3 }, my: 3 }}>
            {filtered.map(pokemon => <Pokemon key={pokemon.id} {...pokemon} onFavoriteChange={() => setAnnouncement(`${pokemon.name} se ha quitado de tus favoritos.`)} />)}
          </Box>
        )}
        {favorites.length > 0 && <><Divider /><Stack direction="row" justifyContent="space-between" alignItems="center" mt={2} gap={1}><Typography variant="caption" color="text.secondary">Un equipo muy tuyo.</Typography><Button component={RouterLink} to="/pokemons" endIcon={<ArrowForwardRounded />} size="small">Seguir explorando</Button></Stack></>}
      </Paper>
    </Box>
  );
}
