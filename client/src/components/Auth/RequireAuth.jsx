import { Alert, Button, Paper, Stack } from "@mui/material";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { authStore } from "../../auth/store";

export default function RequireAuth() {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  if (loading) return <Paper component="section" role="status" sx={{ width: "min(440px, calc(100% - 40px))", mx: "auto", my: 4, p: 4 }}>Comprobando sesión…</Paper>;
  if (error) return <Stack component="section" spacing={2} sx={{ width: "min(440px, calc(100% - 40px))", mx: "auto", my: 4 }}><Alert severity="error">{error}</Alert><Button variant="contained" onClick={() => authStore.retry()}>Reintentar</Button></Stack>;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
