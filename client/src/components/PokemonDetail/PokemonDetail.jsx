import { Box, Button, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import CatchingPokemonRounded from "@mui/icons-material/CatchingPokemonRounded";
import { baseUrl } from "../../utils";
import PokemonTypes from "../PokemonTypes/PokemonTypes";
import { pokemonNumber } from "../PokemonTypes/utils.mjs";
import fallback from "../../images/poke.png";
import "./PokemonDetail.css";

export default function PokemonsDetail() {
  const { id } = useParams();
  const [result, setResult] = useState({ id: null, pokemon: null, error: false });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${baseUrl || ""}/pokemons/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(({ data }) => { if (!controller.signal.aborted) setResult({ id, pokemon: Array.isArray(data) ? data[0] : data, error: false }); })
      .catch(() => { if (!controller.signal.aborted) setResult({ id, pokemon: null, error: true }); });
    return () => controller.abort();
  }, [id, retry]);
  const pokemon = result.id === id ? result.pokemon : null;
  const loading = result.id !== id;
  const stats = [["hp", "PS"], ["attack", "Ataque"], ["defense", "Defensa"], ["speed", "Velocidad"]];
  const metric = value => Number.isFinite(Number(value)) && value != null ? (Number(value) / 10).toLocaleString("es") : "—";
  return <main className="page-shell detail-page">
    <Button component={Link} to="/pokemons" startIcon={<ArrowBackRounded />} sx={{ mb: 3 }}>Volver a la Pokédex</Button>
    {loading ? <div className="page-empty" role="status"><CatchingPokemonRounded /><h1>Cargando Pokémon…</h1></div> : !pokemon || result.error ? <div className="page-empty" role="alert"><h1>No pudimos encontrar este Pokémon</h1><p>Comprueba tu conexión o vuelve a la Pokédex.</p><Button variant="contained" onClick={() => { setResult({ id: null, pokemon: null, error: false }); setRetry(value => value + 1); }}>Reintentar</Button></div> : <>
      <div className="detail-heading"><p className="page-eyebrow">CONOCE A TU POKÉMON</p><h1>{pokemon.name} <span>{pokemonNumber(pokemon.id)}</span></h1></div>
      <Paper elevation={0} className="detail-body"><div className="detail-art"><CatchingPokemonRounded aria-hidden="true" /><img src={pokemon.img || fallback} alt={pokemon.name} width="450" height="450" onError={event => { if (event.currentTarget.getAttribute("src") !== fallback) event.currentTarget.src = fallback; }} /></div><div className="detail-info"><h2>Todo lo que lo hace único.</h2><p className="detail-description">Descubre sus características y encuentra su lugar en tu equipo.</p><div className="detail-facts"><div><span>Altura</span><strong>{metric(pokemon.height)} m</strong></div><div><span>Peso</span><strong>{metric(pokemon.weigth ?? pokemon.weight)} kg</strong></div><div><span>Número</span><strong>{/^\d+$/.test(String(pokemon.id)) ? String(pokemon.id).padStart(4, "0") : "Personalizado"}</strong></div><div><span>Experiencia base</span><strong>{pokemon.base_experience ?? "—"}</strong></div></div><h3>Tipo</h3><PokemonTypes types={pokemon.types || pokemon.type} /><Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
              <Typography component="h3" variant="h3" mb={2}>Estadísticas</Typography>
              <Stack spacing={1.5}>
                {stats.map(([field, label]) => <Stack direction="row" alignItems="center" spacing={2} key={field}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>{label}</Typography>
                  <LinearProgress aria-label={label} variant="determinate" value={Math.min(100, Math.max(0, (Number(pokemon[field]) || 0) / 255 * 100))} sx={{ flex: 1, height: 8, borderRadius: 1 }} />
                  <Typography variant="caption" sx={{ minWidth: 30, textAlign: "right" }}>{pokemon[field] ?? "—"}</Typography>
                </Stack>)}
              </Stack>
            </Box></div></Paper>
      {!!pokemon.moves?.length && <Paper component="section" elevation={0} sx={{ mt: 3, p: { xs: 3, sm: 4 } }}>
        <Typography variant="overline" color="text.secondary">Listo para el combate</Typography>
        <Typography component="h2" variant="h2" mb={2}>Movimientos</Typography>
        <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
          {pokemon.moves.slice(0, 15).map(move => <Chip variant="outlined" key={move.name} label={move.name.replaceAll("-", " ")} sx={{ textTransform: "capitalize" }} />)}
        </Stack>
      </Paper>}
    </>}
  </main>;
}
