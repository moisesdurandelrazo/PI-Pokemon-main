import {
  CREATE_POKEMON,
  GET_ALL_POKEMONS,
  GET_POKEMON,
  GET_SINGLE_POKEMON,
  GET_TYPES,
  SORT_POKEMON,
  FILTER_TYPES,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
} from "../actions";

// setear los parametros iniciales

const initialState = {
  pokemons: null,
  pokemon: null,
  types: null,
  favorites: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_POKEMONS:
      
      return {
        ...state,
        pokemons: [...action.payload.data],
        totalPokemons: 1025, 


      };

    case GET_POKEMON:

      return {
        
        ...state,
        pokemons: action.payload.data,
        totalPokemons: action.payload.total,
      };
    case GET_SINGLE_POKEMON:
      return {
        ...state,
        pokemon: action.payload,
      };
    case CREATE_POKEMON:
      return state;
    case GET_TYPES:
      return {
        ...state,
        types: action.payload,
      };
    case SORT_POKEMON:
      if (action.payload === "A-Z") {
        const pokemonsOrder = state.pokemons.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        return { ...state, pokemons: pokemonsOrder };
      }
      if (action.payload === "Z-A") {
        const pokemonsOrder = state.pokemons.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        return { ...state, pokemons: pokemonsOrder };
      }
      if (action.payload === "attack+") {
        const pokemonsOrder = state.pokemons.sort(
          (a, b) => b.attack - a.attack
        );
        return { ...state, pokemons: pokemonsOrder };
      }
      if (action.payload === "attack-") {
        const pokemonsOrder = state.pokemons.sort(
          (a, b) => a.attack - b.attack
        );
        return { ...state, pokemons: pokemonsOrder };
      }
      return state;
    case FILTER_TYPES:
      const pokefilter = state.pokemons.filter((pokemon) => {
        const pokemonTypeNames = pokemon.types.map((typesInfo) => {
          return typesInfo.name;
        });
        return pokemonTypeNames.includes(action.payload);
      });
      // console.log({ pokefilter, state });
      return {
        ...state,
        pokemons: pokefilter,
      };
    case ADD_FAVORITE:
      const newFavorite = state.pokemons.filter(
        (pokemon) => pokemon.id === action.payload
      )[0];

      return {
        ...state,
        favorites: [...state.favorites, newFavorite],
      };
    case REMOVE_FAVORITE:
      const remFavourite = state.favorites.filter(
        (pokemon) => pokemon.id !== action.payload
      );
      return {
        ...state,
        favorites: remFavourite,
      };
    default:
      return state;
  }
};

export default rootReducer;
