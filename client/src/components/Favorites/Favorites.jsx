import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeFavorite } from "../../redux/actions";

const Favorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);

  console.log({ favorites });
  return (
    <div>
      <h2>Pokemons Favoritos</h2>
      <ul>
        {/* Aqui deberias poner tu lista de peliculas! */}
        {favorites?.map(({ name, id, img, ...rest }) => {
          return (
            <div key={id}>
              <Link to={`/pokemons/${id}`}>
                <h2>Pokemon</h2>
                <p>{id}</p>
                <p>{name}</p>

                <img src={img} alt={id} />
              </Link>
              <button onClick={() => dispatch(removeFavorite(id))}>X</button>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Favorites;
