import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { authStore } from "../../auth/store";
import "./Auth.css";

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
  if (loading) return <section className="auth-panel" role="status">Comprobando sesión…</section>;
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
  return <section className="auth-panel">
    <h1>{register ? "Crea tu cuenta" : "Inicia sesión"}</h1>
    <p>Necesitas una cuenta para crear Pokémon.</p>
    <form onSubmit={submit}>
      <label htmlFor="auth-email">Correo electrónico</label>
      <input id="auth-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} required disabled={pending} />
      <label htmlFor="auth-password">Contraseña</label>
      <input id="auth-password" type="password" autoComplete={register ? "new-password" : "current-password"} minLength={12} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} required disabled={pending} />
      <p>Al menos 12 caracteres.</p>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Espera…" : register ? "Registrarme" : "Entrar"}</button>
    </form>
    <Link to={register ? "/login" : "/register"} state={{ from: destination }} onClick={() => { setError(""); setPassword(""); }}>
      {register ? "Ya tengo cuenta" : "Crear una cuenta"}
    </Link>
  </section>;
}
