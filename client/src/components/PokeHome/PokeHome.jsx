import React from "react";
import { Link } from "react-router-dom";

export const PokeHome = (props) => {
  return (
    <div>
      <h1>Pantalla principal</h1>
      <Link to="/Pokemons">Pokemons</Link>
    </div>
  );
};

export default PokeHome;
