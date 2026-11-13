import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CatchingPokemonRounded from "@mui/icons-material/CatchingPokemonRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import AddCircleOutlineRounded from "@mui/icons-material/AddCircleOutlineRounded";
import hero from "../../assets/hq720.jpg";

const features = [
  { to: "/pokemons", icon: CatchingPokemonRounded, color: "secondary.main", eyebrow: "Descubre", title: "Tu próxima gran captura", text: "Tipos, movimientos y estadísticas. Todo empieza en la Pokédex." },
  { to: "/favorites", icon: FavoriteRounded, color: "primary.main", eyebrow: "Colecciona", title: "Tus imprescindibles", text: "Reúne a los Pokémon que hacen especial a tu equipo." },
  { to: "/create", icon: AddCircleOutlineRounded, color: "info.main", eyebrow: "Imagina", title: "Dale vida a tu Pokémon", text: "Elige sus tipos y estadísticas. La creatividad la pones tú." },
];

export default function PokeHome() {
  return (
    <Box component="main" className="page-shell">
      <Typography variant="overline" color="text.secondary" display="block" mb={2}>El mundo Pokémon, a tu alcance</Typography>
      <Box component="section" sx={{ position: "relative", borderRadius: 2, overflow: "hidden", bgcolor: "#223c37" }}>
        <Box component="img" src={hero} alt="Ilustración del mundo Pokémon" sx={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
        <Stack spacing={2.5} alignItems="flex-start" justifyContent="center" sx={{ position: "relative", minHeight: 450, p: { xs: 3, sm: 6 }, color: "white", background: "linear-gradient(90deg, #122b2bf2, #132d2bbd 50%, #142b2910)" }}>
          <Stack direction="row" spacing={1} alignItems="center"><CatchingPokemonRounded /><Typography variant="overline">Explora · Descubre · Colecciona</Typography></Stack>
          <Typography component="h1" variant="h1" sx={{ fontSize: { xs: 32, sm: 48 }, lineHeight: 1.15 }}>Un mundo de Pokémon.<br />Una aventura muy tuya.</Typography>
          <Typography sx={{ maxWidth: 390, color: "#d5ded7", fontSize: 14, lineHeight: 1.8 }}>Conoce a cada Pokémon, descubre qué lo hace único y encuentra a tus próximos compañeros.</Typography>
          <Button component={RouterLink} to="/pokemons" variant="contained" endIcon={<ArrowForwardRounded />}>Explorar la Pokédex</Button>
        </Stack>
      </Box>
      <Box component="section" aria-label="Explora Pokémon Explorer" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.5, mt: 3 }}>
        {features.map(({ to, icon: Icon, color, eyebrow, title, text }) => (
          <Card key={to} sx={{ borderBottom: 4, borderBottomColor: color }}>
            <CardActionArea component={RouterLink} to={to} sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Icon sx={{ color, fontSize: 32, mb: 2 }} />
                <Typography color={color} variant="overline" display="block">{eyebrow}</Typography>
                <Typography variant="h3" component="h2" my={1}>{title}</Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{text}</Typography>
                <ArrowForwardRounded sx={{ display: "block", ml: "auto", mt: 2, color }} />
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} mt={3} gap={1}>
        <Typography variant="caption" color="text.secondary">Siempre hay un Pokémon más por descubrir.</Typography>
        <Button component={RouterLink} to="/pokemons" endIcon={<ArrowForwardRounded />}>Empezar a explorar</Button>
      </Stack>
    </Box>
  );
}
