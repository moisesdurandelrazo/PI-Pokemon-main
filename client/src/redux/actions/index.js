import axios from "axios";
import { baseUrl } from "../../utils";
export const GET_ALL_POKEMONS = "GET_ALL_POKEMONS";
export const GET_POKEMON = "GET_POKEMON";
export const GET_SINGLE_POKEMON = "GET_SINGLE_POKEMON";
export const CREATE_POKEMON = "CREATE_POKEMON";
export const GET_TYPES = "GET_TYPES";
export const SORT_POKEMON = "SORT_POKEMON";
export const FILTER_TYPES = "FILTER_TYPES";
export const ADD_FAVORITE = "ADD_FAVORITE";
export const REMOVE_FAVORITE = "REMOVE_FAVORITE";

// console.log({ baseUrl });

// Usar ruta 'http://localhost:3001/pokemons' para buscar todas los pokemons en nuestro back
export const getAllpokemons = (currentPage, perPage) => async (dispatch) => {
  try {
    const {data} = await axios.get(`${baseUrl}/pokemons`, {
      params: { currentPage, perPage },
    });
    dispatch({ type: GET_ALL_POKEMONS, payload: data });
  } catch (error) {
    console.error("Error en getAllpokemons:", error.message);
  }
};


// Usar ruta 'http://localhost:3001/pokemons?name=' para buscar todas los pokemons en nuestro back

// export const getpokemon = (name) => (dispatch) => {
//   const sufix = name ? `?name=${name}` : "";
//   return fetch(`${baseUrl}/pokemons${sufix}`)
//     .then((response) => {
//       return response.json();
//     })
//     .then((json) => {
//       dispatch({ type: GET_ALL_POKEMONS, payload: json });
//     });
// };

export const getpokemon = (name) => async (dispatch) => {
  console.log({aquinoes:name})
  try {
    const response = await axios.get(`${baseUrl}/pokemons`, {
      params: { name },
    });
    dispatch({ type: GET_POKEMON, payload: response.data });
  } catch (error) {
    console.error("Error en getpokemon:", error.message);
  }
};

//Usar ruta par traer un pokemon http://localhost:3001/pokemons/id

// export const getSinglePokemon = (id) => (dispatch) => {
//   return fetch(`${baseUrl}/pokemons/${id}`)
//     .then((response) => {
//       return response.json();
//     })
//     .then((json) => {
//       dispatch({ type: GET_SINGLE_POKEMON, payload: json });
//     });
// };

export const getSinglePokemon = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${baseUrl}/pokemons/${id}`);
    dispatch({ type: GET_SINGLE_POKEMON, payload: response.data });
  } catch (error) {
    console.error("Error en getSinglePokemon:", error.message);
  }
};

//creacion de pokemons

// export const createPokemon = (pokemon) => (dispatch) => {
//   return fetch(`${baseUrl}/pokemons`, {
//     method: "POST",
//     headers: { Accept: "applcation/json", "Content-Type": "application/json" },
//     body: JSON.stringify(pokemon),
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .then((json) => {
//       dispatch({ type: CREATE_POKEMON, payload: pokemon });
//     });
// };

export const createPokemon = (pokemon) => async (dispatch) => {
  try {
    const response = await axios.post(`${baseUrl}/pokemons`, pokemon, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch({ type: CREATE_POKEMON, payload: response.data });
  } catch (error) {
    console.error("Error en createPokemon:", error.message);
  }
};

// creacion de tipos

// export const getTypes = () => (dispatch) => {
//   return fetch(`${baseUrl}/types`)
//     .then((response) => {
//       return response.json();
//     })
//     .then((json) => {
//       dispatch({ type: GET_TYPES, payload: json });
//     });
// };
export const getTypes = () => async (dispatch) => {
  try {
    const response = await axios.get(`${baseUrl}/types`);
    dispatch({ type: GET_TYPES, payload: response.data });
  } catch (error) {
    console.error("Error en getTypes:", error.message);
  }
};


//action sort

export const sortPokemon = (sortType) => (dispatch) => {
  // console.log({ sortType });
  return dispatch({ type: SORT_POKEMON, payload: sortType });
};

//action filter

export const typesFilters = (filterType) => (dispatch) => {
  // console.log({ filterType });
  return dispatch({ type: FILTER_TYPES, payload: filterType });
};

//favourites

export const addFav = (id) => (dispatch) => {
  return dispatch({
    type: ADD_FAVORITE,
    payload: id,
  });
};

export const removeFavorite = (id) => (dispatch) => {
  return dispatch({
    type: REMOVE_FAVORITE,
    payload: id,
  });
};
