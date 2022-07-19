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
      <div>
        {favorites?.map(({ name, id, img }) => {
          return (
            <div className="pokemon" key={id}>
              <h2>Pokemon</h2>
              <img className="profile-img" src={img} alt={id} />
              <div className="description-bk"></div>
              <Link to={`/pokemons/${id}`}>
                <div className="description">
                  <p>No.{id}</p>
                  <p>Nombre: {name}</p>
                </div>
              </Link>
              <button
                className="btn"
                onClick={() => dispatch(removeFavorite(id))}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;
