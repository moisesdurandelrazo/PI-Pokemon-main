import { Alert, Button, Link as MuiLink, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { authStore } from "../../auth/store";

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const register = location.pathname === "/register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const requested = location.state?.from;
  const destination = typeof requested === "string" && /^\/(?!\/)/.test(requested) && !/[\\\s]/.test(requested) && [...requested].every(char => char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127) ? requested : "/create";
  if (loading) return <Paper component="section" role="status" sx={{ width: "min(440px, calc(100% - 40px))", mx: "auto", my: 4, p: 4 }}>Comprobando sesión…</Paper>;
  if (user) return <Navigate to={destination} replace />;
  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      if (new TextEncoder().encode(password).length > 128) throw new Error("La contraseña no puede superar 128 bytes.");
      await authStore[register ? "register" : "login"](email.trim(), password);
      setPassword("");
      navigate(destination, { replace: true });
    } catch (failure) { setError(failure.message || "No se pudo iniciar sesión."); }
    finally { setPending(false); }
  }
  return (
    <Paper component="section" variant="outlined" sx={{ width: "min(440px, calc(100% - 40px))", mx: "auto", my: 4, p: { xs: 3, sm: 4 }, borderTop: 5, borderTopColor: "primary.main" }}>
      <Typography component="h1" variant="h2" mb={1}>{register ? "Crea tu cuenta" : "Inicia sesión"}</Typography>
      <Typography color="text.secondary" variant="body2" mb={3}>Necesitas una cuenta para crear Pokémon.</Typography>
      <Stack component="form" spacing={2.5} onSubmit={submit}>
        <TextField id="auth-email" label="Correo electrónico" type="email" autoComplete="email" slotProps={{ htmlInput: { maxLength: 254 } }} value={email} onChange={event => setEmail(event.target.value)} required disabled={pending} />
        <TextField id="auth-password" label="Contraseña" type="password" autoComplete={register ? "new-password" : "current-password"} slotProps={{ htmlInput: { minLength: 12, maxLength: 128 } }} value={password} onChange={event => setPassword(event.target.value)} helperText="Al menos 12 caracteres." required disabled={pending} />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" disabled={pending}>{pending ? "Espera…" : register ? "Registrarme" : "Entrar"}</Button>
      </Stack>
      <MuiLink component={Link} to={register ? "/login" : "/register"} state={{ from: destination }} onClick={() => { setError(""); setPassword(""); }} sx={{ display: "inline-block", mt: 3, fontSize: 14 }}>
        {register ? "Ya tengo cuenta" : "Crear una cuenta"}
      </MuiLink>
    </Paper>
  );
}
