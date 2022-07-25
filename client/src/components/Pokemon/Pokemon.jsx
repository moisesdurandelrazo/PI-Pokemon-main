import React from "react";
import { Link } from "react-router-dom";
import { addFav } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import "./Pokemon.css";
import poke from "../../images/poke.png";

const Pokemon = ({ name, img, types, id, moves }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  console.log({ moves });
  const isFavorite = favorites.some((p) => {
    return p.id === id;
  });

  return (
    <div className="pokemon">
      <h2 className="name">{String(name).toUpperCase()}</h2>
      <Link to={`/pokemons/${id}`}>
        <img
          className="profile-img "
          src={
            img ? img : "https://media.giphy.com/media/DRfu7BT8ZK1uo/giphy.gif"
          }
          alt={id}
        />
        <div className="description">
          <h3 className="num">No.° {id.toString().padStart(3, "0")}</h3>
          <div className="type">
            <h4>
              Tipo:
              {types &&
                types.map((t) => {
                  return (
                    <p className={t.name} key={`${name}-${t.name}`}>
                      {t.name}
                    </p>
                  );
                })}
            </h4>
          </div>
        </div>
      </Link>
      {!isFavorite ? (
        <button className="btn" onClick={(e) => dispatch(addFav(id))}>
          Favoritos
        </button>
      ) : (
        <img className="favorite" src={poke} alt="" />
      )}
    </div>
  );
};

export default Pokemon;
