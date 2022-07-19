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
              Home
            </Link>
            <Link to="/Pokemons">Pokemons</Link>
            <Link to="/create">Create Pokemon</Link>
            <Link to="/favorites">Favorites</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
