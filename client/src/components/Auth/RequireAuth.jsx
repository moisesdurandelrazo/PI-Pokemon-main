import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { authStore } from "../../auth/store";
import "./Auth.css";

export default function RequireAuth() {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  if (loading) return <section className="auth-panel" role="status">Comprobando sesión…</section>;
  if (error) return <section className="auth-panel"><p role="alert">{error}</p><button onClick={() => authStore.retry()}>Reintentar</button></section>;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
