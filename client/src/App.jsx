
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Pokemons from "./components/Pokemons";
import PokemonsDetail from "./components/PokemonDetail";
import CreatePokemon from "./components/CreatePokemon/CreatePokemon";
import PokeHome from "./components/PokeHome";
import Nav from "./components/Nav/Nav";
import Favorites from "./components/Favorites";

function App() {
  return (
    <div className="app-main">
      <Nav />
      <div className="App">
        <Routes>
          <Route exact path="/" element={<PokeHome/>} />
          <Route exact path="/pokemons" element={<Pokemons/>} />
          <Route path="/pokemons/:id" element={<PokemonsDetail/>} />
          <Route exact path="/create" element={<CreatePokemon/>} />
          <Route path="/favorites" element={<Favorites/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
