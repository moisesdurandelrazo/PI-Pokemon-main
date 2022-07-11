import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Pokemons from "./components/Pokemons";
import PokemonsDetail from "./components/PokemonDetail";
import CreatePokemon from "./components/CreatePokemon"
// import Nav from "./components/Nav";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={()=> 'Pantalla principal'} />
        <Route exact path="/pokemons" component={Pokemons} />
        <Route exact path="/pokemons/create" component={CreatePokemon}/>
        <Route exact path="/pokemons/:id" component={PokemonsDetail}/>
      </Switch>
    </div>
  );
}

export default App;
