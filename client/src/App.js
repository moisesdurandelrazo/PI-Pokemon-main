import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Pokemons from "./components/Pokemons";
import PokemonsDetail from "./components/PokemonDetail";
import CreatePokemon from "./components/CreatePokemon/CreatePokemon";
import PokeHome from "./components/PokeHome";
import Nav from "./components/Nav/Nav";
import Favorites from "./components/Favorites";

function App() {
  return (
    <div>
      <Nav />
      <div className="App">
        <Switch>
          <Route exact path="/" component={PokeHome} />
          <Route exact path="/pokemons" component={Pokemons} />
          <Route path="/pokemons/:id" component={PokemonsDetail} />
          <Route exact path="/create" component={CreatePokemon} />
          <Route path="/favorites" component={Favorites} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
