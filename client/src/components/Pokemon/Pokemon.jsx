import React from "react";
import { Link } from "react-router-dom";
import { addFav } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import "./Pokemon.css";

const Pokemon = ({ name, img, types, id }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  // console.log({ favorites });
  const isFavorite = favorites.some((p) => {
    return p.id === id;
  });

  return (
    <div className="pokemon">
      <h2>{String(name).toUpperCase()}</h2>

      <img
        className="profile-img "
        src={
          img ? img : "https://media.giphy.com/media/DRfu7BT8ZK1uo/giphy.gif"
        }
        alt={id}
      />

      <div className="description-bk"></div>

      <Link to={`/pokemons/${id}`}>
        <div className="description">
          <p>No. {id}</p>
          <h5 className="type">
            Tipo:
            {types &&
              types.map((t) => {
                return <p key={`${name}-${t.name}`}>{t.name}</p>;
              })}
          </h5>
        </div>
      </Link>
      {!isFavorite && (
        <button className="btn" onClick={(e) => dispatch(addFav(id))}>
          Agregar a Favoritos
        </button>
      )}
    </div>
  );
};

export default Pokemon;
