import { CREATE_POKEMON, GET_ALL_POKEMONS, GET_POKEMON, GET_SINGLE_POKEMON, GET_TYPES } from "../actions";



// setear los parametros iniciales

const initialState= {
    pokemons: null,
    pokemon: null,
    types: null,
};

const rootReducer= (state = initialState, action)=>{ 
    switch(action.type){
        
        case GET_ALL_POKEMONS:
            return{
                ...state,
                pokemons: [...action.payload]
            }
            
      case GET_POKEMON:
        return{
            ...state,
            pokemon: action.payload
        }
        case GET_SINGLE_POKEMON:
        return{
            ...state,
            pokemon: action.payload
        }
        case CREATE_POKEMON:
            return state
        case GET_TYPES:
            return{
                 ...state,
                 types: action.payload
            }
        default:
        return state;

    }
 }

export default rootReducer;