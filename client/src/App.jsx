

import { Routes, Route } from "react-router-dom";
import Pokemons from "./components/Pokemons";
import PokemonsDetail from "./components/PokemonDetail";
import CreatePokemon from "./components/CreatePokemon/CreatePokemon";
import PokeHome from "./components/PokeHome";
import Nav from "./components/Nav/Nav";
import Favorites from "./components/Favorites";
import Auth from "./components/Auth/Auth";
import RequireAuth from "./components/Auth/RequireAuth";
import "./App.css"

function App() {
  return (
    <div className="app-main">
      <Nav />
      <div className="App">
        <Routes>
          <Route exact path="/" element={<PokeHome/>} />
          <Route exact path="/pokemons" element={<Pokemons/>} />
          <Route path="/pokemons/:id" element={<PokemonsDetail/>} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route element={<RequireAuth />}>
            <Route path="/create" element={<CreatePokemon />} />
          </Route>
          <Route path="/favorites" element={<Favorites/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
