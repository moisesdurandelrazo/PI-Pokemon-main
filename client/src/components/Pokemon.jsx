import React from "react";
import { Link } from "react-router-dom";

const Pokemon = ({ name, height, img, types, id }) => {
  return (
    <div>
      <Link to={`/pokemons/${id}`}>
        <h2>Poke</h2>
        <p>{name}</p>
        <p>{height}</p>
        <img src={img} alt={id} />
        <div>
          {types &&
            types.map((t) => {
              return <div key={t.id}>{t.name}</div>;
            })}
        </div>
      </Link>
    </div>
  );
};

export default Pokemon;
