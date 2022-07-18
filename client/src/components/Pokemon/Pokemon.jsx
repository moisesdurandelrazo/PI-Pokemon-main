import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addFav } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import "./Pokemon.css";

const Pokemon = ({ name, height, img, types, id }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  // console.log({ favorites });
  const isFavorite = favorites.some((p) => {
    return p.id === id;
  });

  return (
    <div className="pokemon">
      <h4>Pokemon</h4>
      <img className="profile-img " src={img} alt={id} />
      <div className="description-bk"></div>

      <Link to={`/pokemons/${id}`}>
        <div className="description">
          <p>No. {id}</p>
          <p>Nombre: {name}</p>
          <p>Altura:{height}</p>

          <p className="type">
            Tipo:
            {types &&
              types.map((t) => {
                return <div key={t.id}>{t.name}</div>;
              })}
          </p>
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
