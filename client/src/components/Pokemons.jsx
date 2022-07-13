import React, { useState } from "react";
import { getAllpokemons, actionSort, actionSortAttack } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Pokemon from "./Pokemon";
import SearchInput from "./SearchInput";

export const Pokemons = (props) => {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.pokemons);
  //   console.log({ pokemons });
  const [sort, setSort] = useState("ASC");
  const [sortAttack, setSortAttack] = useState("MAY");
  React.useEffect(() => {
    dispatch(getAllpokemons());
  }, []);

  if (!pokemons) return <h2>Buscando pokemons...</h2>;

  const onSort = () => {
    setSort((sort) => {
      if (sort === "ASC") {
        dispatch(actionSort("DESC"));
        return "DESC";
      }
      dispatch(actionSort("ASC"));
      return "ASC";
    });
  };
  const onSortAttack = () => {
    setSortAttack((sortAttack) => {
      if (sortAttack === "MAY") {
        dispatch(actionSortAttack("MEN"));
        return "MEN";
      }
      dispatch(actionSortAttack("MAY"));
      return "MAY";
    });
  };

  return (
    <div>
      <SearchInput />
      <h1>Encuentra tu Pokemon</h1>
      <select className="selectOrdenar" onClick={onSort}>
        <option>Ordenar {sort === "ASC" ? "A-Z" : "Z-A"}</option>
      </select>
      <div onClick={onSortAttack}>
        Ordenar {sortAttack === "MAY" ? "MAYOR ATAQUE" : "MENOR ATAQUE"}
      </div>
      {pokemons.map((pokemon) => (
        <Pokemon {...pokemon} key={pokemon.name} />
      ))}
    </div>
  );
};

export default Pokemons;
