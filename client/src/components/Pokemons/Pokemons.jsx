import { useState, useEffect } from "react";
import { getAllpokemons, sortPokemon, getTypes } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Pokemon from "../Pokemon";
import SearchInput from "../SearchInput";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "./Pokemons.css";
import Grid from "@mui/material/Grid";

const perPage = 12;

export const Pokemons = () => {
  const dispatch = useDispatch();

  // Redux states
  const pokemons = useSelector((state) => state.pokemons || []);
  const totalPokemons = useSelector((state) => state.totalPokemons || 0);
  const types = useSelector((state) => state.types || []);

  // Local states
  const [sort, setSort] = useState("0");
  const [typeFilter, setTypeFilter] = useState("0");
  const [sourceFilter, setSourceFilter] = useState("0");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Pokémon data when the page changes
  useEffect(() => {
    dispatch(getAllpokemons(currentPage, perPage));
  }, [dispatch, currentPage]);

  // Fetch types if not already fetched
  useEffect(() => {
    if (!types || types.length === 0) {
      dispatch(getTypes());
    }
  }, [dispatch, types]);

  // Loading state
  if (!pokemons) return <h2>Buscando pokemons...</h2>;

  // Filter Pokémon by type and source
  const handleFilters = (pokemon) => {
    let valid = true;

    const pokemonTypes =
    pokemon.types || 
    (Array.isArray(pokemon.type) ? pokemon.type : []);

    if (typeFilter && typeFilter !== "0") {
    const pokemonTypeNames = pokemonTypes.map((typeInfo) => typeInfo.name);
    valid = pokemonTypeNames.includes(typeFilter);
  }

    if (sourceFilter === "DB") {
      valid = valid && isNaN(pokemon.id);
    }

    if (sourceFilter === "API") {
      console.log(valid)
      valid = valid && !isNaN(pokemon.id);
    }

    return valid;
  };

  // Apply filters to Pokémon
  const filteredPokemons = pokemons.filter(handleFilters);

  // Generate pagination numbers based on totalPokemons

  // Reset filters
  const resetFilters = () => {
    setSort("0");
    setTypeFilter("0");
    setSourceFilter("0");
    setCurrentPage(1);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
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
            setSort(e.target.value);
            dispatch(sortPokemon(e.target.value));
          }}
        >
          <option value="0">Ordenar por:</option>
          <option value="A-Z">Ordenar A-Z</option>
          <option value="Z-A">Ordenar Z-A</option>
          <option value="attack+">Mayor Ataque</option>
          <option value="attack-">Menor Ataque</option>
        </select>

        <select
          value={typeFilter}
          className="select-filter"
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="0">Tipos</option>
          {Array.isArray(types) &&
            types.map((type) => (
              <option value={type.name} key={type.name}>
                {type.name}
              </option>
            ))}
        </select>

        <select
          value={sourceFilter}
          className="create-by"
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="0">Creado en:</option>
          <option value="API">API</option>
          <option value="DB">Base de datos</option>
        </select>
      </div>

      <div className="pokemon-list">
        <Grid container spacing={3} justifyContent="center">
          {filteredPokemons.map((pokemon) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
              <Pokemon {...pokemon} key={pokemon.id} />
            </Grid>
          ))}
        </Grid>
      </div>

      <Stack spacing={2} className="pagination-container">
        <Pagination
          count={Math.ceil(totalPokemons / perPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              color: "white", // Cambia el color del texto
              backgroundColor: "transparent", // Elimina fondo negro
              border: "1px solid white", // Bordes blancos
            },
            "& .Mui-selected": {
              backgroundColor: "#3f51b5", // Color de selección
              color: "white",
            },
          }}
        />
      </Stack>
    </div>
  );
};

export default Pokemons;
