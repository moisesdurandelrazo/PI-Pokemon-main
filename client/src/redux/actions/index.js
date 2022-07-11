export const GET_ALL_POKEMONS = "GET_ALL_POKEMONS";
export const GET_POKEMON = "GET_POKEMON"
export const GET_SINGLE_POKEMON = "GET_SINGLE_POKEMON"
export const CREATE_POKEMON = "CREATE_POKEMON"
export const GET_TYPES = "GET_TYPES"


// Usar ruta 'http://localhost:3001/pokemons' para buscar todas los pokemons en nuestro back


export const getAllpokemons = () => (dispatch) => {
    return fetch(`http://localhost:3001/pokemons`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        dispatch({ type: GET_ALL_POKEMONS, payload: json });
      });
  };
        
 // Usar ruta 'http://localhost:3001/pokemons?name=' para buscar todas los pokemons en nuestro back


export const getpokemon = (name) => (dispatch) => {
  const sufix = name ? `?name=${name}` : ''
    return fetch(`http://localhost:3001/pokemons${sufix}`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        dispatch({ type: GET_ALL_POKEMONS, payload: json });
      });
  };

  //Usar ruta par traer un pokemon http://localhost:3001/pokemons/id

  export const getSinglePokemon = (id) => (dispatch) => {
      return fetch(`http://localhost:3001/pokemons/${id}`)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          dispatch({ type: GET_SINGLE_POKEMON, payload: json });
        });
    };

    //creacion de pokemons

    export const createPokemon = (pokemon) => (dispatch)=>{
      return fetch(`http://localhost:3001/pokemons`,{method:'POST',body: pokemon})
        .then((response)=> {
          return response.json();
        })
        .then((json)=>{
          dispatch({type: CREATE_POKEMON, payload: pokemon })
        })
    }

    // creacion de tipos

    export const getTypes = () => (dispatch) => {
  
    return fetch(`http://localhost:3001/pokemons/types`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        dispatch({ type: GET_TYPES, payload: json });
      });
  };