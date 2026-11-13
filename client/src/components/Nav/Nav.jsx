import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Alert, AppBar, Box, Button, Container, Stack, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import CatchingPokemonRounded from "@mui/icons-material/CatchingPokemonRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import AddCircleOutlineRounded from "@mui/icons-material/AddCircleOutlineRounded";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import { useAuth } from "../../auth/useAuth";
import { authStore } from "../../auth/store";

const links = [
  ["/", "Inicio", HomeRounded, "#777777"],
  ["/pokemons", "Pokédex", CatchingPokemonRounded, "#e3350d"],
  ["/favorites", "Mis favoritos", FavoriteRounded, "#388344"],
  ["/create", "Crear Pokémon", AddCircleOutlineRounded, "#248ab4"],
];

export default function Nav() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const current = links.find(([to]) => to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`))?.[0] || false;

  async function logout() {
    setPending(true);
    setError("");
    try { await authStore.logout(); navigate("/pokemons"); }
    catch { setError("No se pudo cerrar sesión. Inténtalo de nuevo."); }
    finally { setPending(false); }
  }

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1, gap: 2, justifyContent: "space-between" }}>
          <Stack component={RouterLink} to="/" direction="row" alignItems="center" spacing={1} aria-label="Pokémon Explorer, inicio" sx={{ textDecoration: "none", color: "text.primary" }}>
            <CatchingPokemonRounded color="secondary" sx={{ fontSize: 38 }} />
            <Box>
              <Typography component="span" variant="h3">Pokémon</Typography>
              <Typography component="span" variant="overline" display="block" color="text.secondary" sx={{ lineHeight: 1.3 }}>Explorer</Typography>
            </Box>
          </Stack>
          {!loading && (user ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" title={user.email} noWrap sx={{ maxWidth: 180, display: { xs: "none", sm: "block" } }}>{user.email}</Typography>
              <Button variant="outlined" size="small" disabled={pending} onClick={logout}>{pending ? "Cerrando…" : "Cerrar sesión"}</Button>
            </Stack>
          ) : (
            <Button component={RouterLink} to="/login" startIcon={<PersonOutlineRounded />} size="small">Iniciar sesión</Button>
          ))}
        </Toolbar>
        <Box component="nav" aria-label="Navegación principal" sx={{ maxWidth: 900, mx: "auto" }}>
          <Tabs value={current} variant="fullWidth" aria-label="Secciones" sx={{ "& .MuiTabs-indicator": { display: "none" } }}>
            {links.map(([to, label, Icon, color]) => (
              <Tab key={to} component={RouterLink} to={to} value={to} label={label} icon={<Icon />} sx={{ minWidth: 0, minHeight: 78, px: .5, fontSize: { xs: 10, sm: 13 }, textTransform: "none", borderBottom: `4px solid ${color}`, "&.Mui-selected": { bgcolor: color, color: "#fff" }, "&:hover": { bgcolor: color, color: "#fff" } }} />
            ))}
          </Tabs>
        </Box>
      </Container>
      {error && <Alert severity="error">{error}</Alert>}
    </AppBar>
  );
}
