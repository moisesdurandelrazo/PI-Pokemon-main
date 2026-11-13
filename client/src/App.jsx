import { lazy, Suspense } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import theme from "./theme";
import Loading from "./components/Loading";
import Nav from "./components/Nav/Nav";
import RequireAuth from "./components/Auth/RequireAuth";
import "./App.css";

const Pokemons = lazy(() => import("./components/Pokemons"));
const PokemonsDetail = lazy(() => import("./components/PokemonDetail"));
const CreatePokemon = lazy(() => import("./components/CreatePokemon/CreatePokemon"));
const PokeHome = lazy(() => import("./components/PokeHome"));
const Favorites = lazy(() => import("./components/Favorites"));
const Auth = lazy(() => import("./components/Auth/Auth"));

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-main">
        <Nav />
        <div className="App">
          <Suspense fallback={<Loading message="Cargando página…" />}>
            <Routes>
              <Route path="/" element={<PokeHome />} />
              <Route path="/pokemons" element={<Pokemons />} />
              <Route path="/pokemons/:id" element={<PokemonsDetail />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              <Route element={<RequireAuth />}>
                <Route path="/create" element={<CreatePokemon />} />
              </Route>
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </ThemeProvider>
  );
}
