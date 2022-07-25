import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSinglePokemon } from "../../redux/actions";
import "./PokemonDetail.css";

export const PokemonsDetail = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const pokemon = useSelector((state) => state.pokemon);

  useEffect(() => {
    dispatch(getSinglePokemon(params.id));
  }, []);

  // console.log({ pokemon });

  if (!pokemon) return <h2>Cargando</h2>;

  return (
    <div className="about-section">
      <h1 className="title">
        {pokemon.name} N.°{pokemon.id.toString().padStart(3, "0")}
      </h1>
      <img className="image" src={pokemon.img} alt={pokemon.id} />
      <div className="container">
        <h3>Experiencia Base:</h3>
        <p>{pokemon.base_experience}</p>
        <h3>Tipo:</h3>
        {pokemon.types &&
          pokemon.types.map((type) => {
            return <p key={type.id}>{String(type.name).toUpperCase()}</p>;
          })}
        <h3>Peso</h3>
        <p>{pokemon.weigth / 10} Kg</p>
        <h3>Altura</h3>
        <p>{pokemon.height / 10} m</p>
        <h3>Abilidades:</h3>
        {pokemon.abilities &&
          pokemon.abilities.map((ability) => {
            return (
              <p key={ability.name}>{String(ability.name).toUpperCase()}</p>
            );
          })}
        <div className="stats-container">
          <h3>Estadisticas</h3>

          <p>
            <b>Vida: </b> {pokemon.hp}
          </p>
          <p>
            <b>Ataque: </b> {pokemon.attack}
          </p>
          <p>
            <b>Defensa: </b> {pokemon.defense}
          </p>
          <p>
            <b>Velocidad: </b> {pokemon.speed}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PokemonsDetail;
