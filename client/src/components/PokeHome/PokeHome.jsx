import React from "react";
import { Link } from "react-router-dom";
import "./PokeHome.css";
import logo from "../../Pokémon-emblema.jpg";

export const PokeHome = (props) => {
  return (
    <div>
      <h1>Encuentra tus pokemons</h1>
      <p>Podras ver sus ataques, fuerza, vida entre otras cosas</p>
      <Link className="button-choose" to="/Pokemons">
        <img className="img-logo" src={logo} alt="" />
        <p>Busca tu pokemon</p>
      </Link>
    </div>
  );
};

export default PokeHome;
