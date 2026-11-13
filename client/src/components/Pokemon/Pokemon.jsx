import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Tooltip, Typography } from "@mui/material";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import CatchingPokemonRounded from "@mui/icons-material/CatchingPokemonRounded";
import PropTypes from "prop-types";
import { addFav, removeFavorite } from "../../redux/actions";
import PokemonTypes from "../PokemonTypes/PokemonTypes";
import { pokemonNumber } from "../PokemonTypes/utils.mjs";
import fallback from "../../images/poke.png";

export default function Pokemon({ name, img, types, type, id, onFavoriteChange }) {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites || []);
  const isFavorite = favorites.some(pokemon => pokemon?.id === id);
  const favoriteLabel = `${isFavorite ? "Quitar a" : "Añadir a"} ${name} ${isFavorite ? "de" : "a"} favoritos`;

  function toggleFavorite() {
    dispatch(isFavorite ? removeFavorite(id) : addFav(id));
    onFavoriteChange?.(!isFavorite);
  }

  return (
    <Card component="article" sx={{ height: "100%", position: "relative", overflow: "visible" }}>
      <CardActionArea component={RouterLink} to={`/pokemons/${encodeURIComponent(id)}`} aria-label={`Ver detalles de ${name}`} sx={{ borderRadius: "inherit" }}>
        <Box sx={{ position: "relative", aspectRatio: "1", bgcolor: "#f2f3f0", overflow: "hidden", borderRadius: "8px 8px 0 0", display: "grid", placeItems: "center" }}>
          <CatchingPokemonRounded aria-hidden="true" sx={{ position: "absolute", width: "80%", height: "80%", color: "#e3e8dc", transform: "rotate(-25deg)" }} />
          <CardMedia component="img" image={img || fallback} alt={name} loading="lazy" width="240" height="240" onError={event => { if (event.currentTarget.getAttribute("src") !== fallback) event.currentTarget.src = fallback; }} sx={{ position: "relative", width: "85%", height: "85%", objectFit: "contain" }} />
        </Box>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>{pokemonNumber(id)}</Typography>
          <Typography variant="h3" component="h2" sx={{ textTransform: "capitalize", overflowWrap: "anywhere", my: 1, fontSize: { xs: 19, sm: 23 } }}>{name}</Typography>
          <PokemonTypes types={types || type} />
        </CardContent>
      </CardActionArea>
      <Tooltip title={favoriteLabel}>
        <IconButton aria-label={favoriteLabel} aria-pressed={isFavorite} onClick={toggleFavorite} size="small" sx={{ position: "absolute", top: 9, right: 9, bgcolor: "background.paper", color: isFavorite ? "secondary.main" : "text.secondary", border: 1, borderColor: "divider", "&:hover": { bgcolor: "#fff0ed" } }}>
          {isFavorite ? <FavoriteRounded fontSize="small" /> : <FavoriteBorderRounded fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Card>
  );
}

Pokemon.propTypes = {
  name: PropTypes.string.isRequired,
  img: PropTypes.string,
  types: PropTypes.array,
  type: PropTypes.array,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onFavoriteChange: PropTypes.func,
};
