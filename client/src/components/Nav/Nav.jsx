import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { authStore } from "../../auth/store";
import "./Nav.css";
import "../Auth/Auth.css";

const Nav = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function logout() {
    setPending(true); setError("");
    try { await authStore.logout(); navigate("/pokemons"); }
    catch { setError("No se pudo cerrar sesión. Inténtalo de nuevo."); }
    finally { setPending(false); }
  }
  return <header><nav><ul><li>
    <Link className="active" to="/">inicio</Link>
    <Link to="/pokemons">Pokemons</Link>
    <Link to="/create">Crea tu pokemon</Link>
    <Link to="/favorites">Pokemons Favoritos</Link>
    {!loading && (user ? <>
      <span className="session-email">{user.email}</span>
      <button className="session-logout" disabled={pending} onClick={logout}>{pending ? "Cerrando…" : "Cerrar sesión"}</button>
    </> : <Link to="/login">Iniciar sesión</Link>)}
    {error && <span className="session-error" role="alert">{error}</span>}
  </li></ul></nav></header>;
};
export default Nav;
