import React, { useState, useMemo } from "react";
import { getAllpokemons, sortPokemon, getTypes } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Pokemon from "../Pokemon";
import SearchInput from "../SearchInput";
import "./Pokemons.css";

const perPage = 12;

export const Pokemons = (props) => {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.pokemons);
  const types = useSelector((store) => store.types);
  const [sort, setSort] = useState("0");
  const [typeFilter, setTypeFilter] = useState("0");
  const [sourceFilter, setSourceFilter] = useState("0");
  const [currentPage, setCurrentPage] = useState("1");

  const indexOfLastPost = currentPage * perPage;
  const indexOfFirstPost = indexOfLastPost - perPage;

  // console.log({ pokemons });
  const setPage = (pageNum) => {
    setCurrentPage({ currentPage: pageNum });
  };

  React.useEffect(() => {
    dispatch(getAllpokemons());
  }, []);

  React.useEffect(() => {
    if (!types) dispatch(getTypes());
  }, []);

  if (!pokemons) return <h2>Buscando pokemons...</h2>;

  const currentPokemons = pokemons.slice(indexOfFirstPost, indexOfLastPost);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(pokemons.length / perPage); i++) {
    pageNumbers.push(i);
  }

  // console.log({ currentPokemons });

  const resetFilters = () => {
    setSort(0);
    setTypeFilter(0);
    setSourceFilter(0);
    setCurrentPage(1);
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
    <div className="all-selects">
      <SearchInput resetFilters={resetFilters} />
      <h1 className="introduction">Encuentra tus pokemons!</h1>
      <div className="all-selects">
        <select
          value={sort}
          className="select-order"
          onChange={(e) => {
            resetFilters();
            setSort(e.target.value);
            dispatch(sortPokemon(e.target.value));
          }}
        >
          <option value="0">Ordenar por:</option>
          <option value="A-Z">Ordenar A-Z</option>
          <option value="Z-A">Ordenar Z-A</option>
          <option value="attack+">Ordenar MAYOR ATAQUE</option>
          <option value="attack-">Ordenar MENOR ATAQUE</option>
        </select>

        <select
          value={typeFilter}
          className="select-filter"
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
          className="create-by"
          onChange={(e) => {
            resetFilters();
            setSourceFilter(e.target.value);
          }}
        >
          <option value="0">Creado en:</option>
          <option value="API">API</option>
          <option value="DB">Base de datos</option>
        </select>
      </div>

      {currentPokemons.filter(handleFilters).map((pokemon) => (
        <Pokemon className="pokemon" {...pokemon} key={pokemon.name} />
      ))}

      <div className="pagination">
        {pageNumbers.map((pageNum, index) => (
          <span
            key={index}
            className={pageNum === currentPage ? "active" : ""}
            onClick={() => {
              setCurrentPage(pageNum);
            }}
          >
            {pageNum}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Pokemons;
