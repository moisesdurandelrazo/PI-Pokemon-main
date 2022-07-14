import React, { useState } from "react";
import {
  getAllpokemons,
  sortPokemon,
  getTypes,
  typesFilters,
} from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Pokemon from "../Pokemon";
import SearchInput from "../SearchInput";

export const Pokemons = (props) => {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.pokemons);
  const types = useSelector((store) => store.types);
  const [sort, setSort] = useState("0");
  const [typeFilter, setTypeFilter] = useState("0");
  const [sourceFilter, setSourceFilter] = useState("0");

  React.useEffect(() => {
    dispatch(getAllpokemons());
  }, []);

  React.useEffect(() => {
    if (!types) dispatch(getTypes());
  }, []);

  if (!pokemons) return <h2>Buscando pokemons...</h2>;

  console.log({ pokemons });

  const resetFilters = () => {
    setSort(0);
    setTypeFilter(0);
    setSourceFilter(0);
  };

  const handleFilters = (pokemon) => {
    if (typeFilter && typeFilter !== "0") {
      const pokemonTypeNames = pokemon?.types.map((typesInfo) => {
        return typesInfo.name;
      });
      return pokemonTypeNames.includes(typeFilter);
    }
    if (sourceFilter === "DB") {
      return isNaN(pokemon.id);
    }
    if (sourceFilter === "API") {
      return !isNaN(pokemon.id);
    }
    return pokemon;
  };

  return (
    <div>
      <SearchInput resetFilters={resetFilters} />
      <h1>Encuentra tu Pokemon</h1>
      <select
        value={sort}
        className="selectOrder"
        onChange={(e) => {
          resetFilters();
          setSort(e.target.value);
          dispatch(sortPokemon(e.target.value));
        }}
      >
        <option value="0">Seleccione una opcion</option>
        <option value="A-Z">Ordenar A-Z</option>
        <option value="Z-A">Ordenar Z-A</option>
        <option value="attack+">Ordenar MAYOR ATAQUE</option>
        <option value="attack-">Ordenar MENOR ATAQUE</option>
      </select>

      <select
        value={typeFilter}
        className="selectFilter"
        onChange={(e) => {
          resetFilters();
          setTypeFilter(e.target.value);
          // dispatch(typesFilters(e.target.value));
        }}
      >
        <option value="0">Tipos</option>
        {types &&
          types.map((t) => {
            return (
              <option value={t.name} key={t.slot}>
                {t.name}
              </option>
            );
          })}
      </select>

      <select
        value={sourceFilter}
        className="createBy"
        onChange={(e) => {
          resetFilters();
          setSourceFilter(e.target.value);
        }}
      >
        <option value="0">Creado en:</option>
        <option value="API">API</option>
        <option value="DB">Base de datos</option>
      </select>

      {pokemons.filter(handleFilters).map((pokemon) => (
        <Pokemon {...pokemon} key={pokemon.name} />
      ))}
    </div>
  );
};

export default Pokemons;
