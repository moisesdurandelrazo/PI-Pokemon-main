import { Link } from "react-router-dom";
import "./PokeHome.css";
import logo from "../../assets/Pokémon-emblema.jpg"

export const PokeHome = () => {
  return (
    <div className="principal">
      <h1>Encuentra tus pokemons!</h1>
      <h2 className="description">
        Podras ver sus ataques, fuerza, vida, entre otras cosas..
      </h2>
      <Link className="button-choose" to="/Pokemons">
        <img className="img-logo" src={logo} alt="" />
        <p>Busca tu pokemon</p>
      </Link>
    </div>
  );
};

export default PokeHome;
