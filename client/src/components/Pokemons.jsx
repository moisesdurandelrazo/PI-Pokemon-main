import React from "react";
import { getAllpokemons } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Pokemon from "./Pokemon";
import SearchInput from "./SearchInput";

export const Pokemons = (props) => {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.pokemons);
  //   console.log({ pokemons });
  React.useEffect(() => {
    dispatch(getAllpokemons());
  }, []);

  if (!pokemons) return <h2>Buscando pokemons...</h2>;

  return (
    <div>
      <SearchInput />
      <h1>Pokemons</h1>
      {pokemons.map((pokemon) => (
        <Pokemon {...pokemon} key={pokemon.name} />
      ))}
    </div>
  );
};

export default Pokemons;
