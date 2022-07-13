import { CREATE_POKEMON,
     GET_ALL_POKEMONS, 
     GET_POKEMON, 
     GET_SINGLE_POKEMON, 
     GET_TYPES, 
     SORT_ASC, 
     SORT_DEC,
    ORDER_MAY,
ORDER_MENOR, } from "../actions";



// setear los parametros iniciales

const initialState= {
    pokemons: null,
    pokemon: null,
    types: null,
};

const rootReducer= (state = initialState, action)=>{ 
    console.log({state})
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
            case SORT_ASC:
                return {
                    ...state,
                    pokemons: state.pokemons.sort((a,b)=>{ 
                        if (a.name < b.name){
                            return -1;
                        }
                        if (a.name > b.name){
                            return 1;
                        }
                        return 0
                    })
                }
                case SORT_DEC:
                return {
                    ...state,
                    pokemons: state.pokemons.sort((a,b)=>{ 
                        if (a.name > b.name){
                            return -1;
                        }
                        if (a.name < b.name){
                            return 1;
                        }
                        return 0
                    })
                }
                case ORDER_MAY:
                return {
                    ...state,
                    pokemons: state.pokemons.sort((a,b)=>{ 
                        if (a.attack < b.attack){
                            return -1;
                        }
                        if (a.attack > b.attack){
                            return 1;
                        }
                        return 0
                    })
                }
                case ORDER_MENOR:
                return {
                    ...state,
                    pokemons: state.pokemons.sort((a,b)=>{ 
                        if (a.attack > b.attack){
                            return -1;
                        }
                        if (a.attack < b.attack){
                            return 1;
                        }
                        return 0
                    })
                }
        default:
        return state;

    }
 }

export default rootReducer;