import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Pokemons from "./components/Pokemons";
import PokemonsDetail from "./components/PokemonDetail";
import CreatePokemon from "./components/CreatePokemon"
import PokeHome from "./components/PokeHome"
// import Nav from "./components/Nav";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={PokeHome} />
        <Route exact path="/pokemons" component={Pokemons} />
        <Route path="/pokemons/:id" component={PokemonsDetail}/>
        <Route exact path="/create" component={CreatePokemon}/>
      </Switch>
    </div>
  );
}

export default App;
