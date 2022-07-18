import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <header className="navbar">
      <nav>
        <ul className="list">
          <li className="list-item">
            <Link to="/">Home</Link>
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
