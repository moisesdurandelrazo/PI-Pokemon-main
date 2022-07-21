import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

const Nav = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link className="active" to="/">
              inicio
            </Link>
            <Link to="/Pokemons">Pokemons</Link>
            <Link to="/create">Crea tu pokemon</Link>
            <Link to="/favorites">Pokemons Favoritos</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
