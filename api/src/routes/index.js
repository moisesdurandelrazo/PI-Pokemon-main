const { Router } = require('express');
const axios = require('axios')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const { Pokemon,Type } = require('../db.js')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get('/pokemons', async(req, res)=> {
    const numeroDePokemons = 5
    const {name, hp, defense, speed, height, weigth } = req.params
    try{
    // 1. Hacer el fetch -> Lista de pokemons existentes
        let respuestaApi = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=20&limit=${numeroDePokemons}`)
        // 2. Transformar la data a json (variable.data)
        let pokemonsIncompletos = respuestaApi.data.results
        let pokemonsCompletos = await Promise.all(
            pokemonsIncompletos.map(async(pokemon) => {
                let {data} = await axios.get(pokemon.url)

                // Formatear la data
                return {
                    name: data.name,
                    height: data.height,
                    weigth: data.weigth,
                    types: data.types,
                    img: data.sprites.front_default
                }
            })
        )        

        const pokemonsDB = await Pokemon.findAll()
        const todosLosPokemons = [...pokemonsCompletos, ...pokemonsDB]
    // 4. Juntarlas en una sola lista. [...todosLosPokemonsDeLaApi] - [...todosLosPokesDeTuBase] // merge two arrays
    // 5. Regresar el nuevo arreglo.
    return res.json(200, todosLosPokemons)
    }
    catch (e) {
        res.send ({err: e.message})
    }
})


// const pokemons = fetch('localghosra3000/pokemons')


// pokemons.map(pokemon => <PokemonCard {...pokemon} />)


router.get('/pokemons/{idPokemon}', async(req, res)=> {
    const {idPokemon} = req.query
})

router.get('/pokemons', async(req, res)=> {
    const {name}= req.query
})

router.post('/pokemons', async(req, res)=> {
    const {name, hp, defense, speed, height, weigth } = req.body
})

router.get('/types', async(req, res)=> {})




// - [ ] __GET /pokemons__:
//   - Obtener un listado de los pokemons desde pokeapi.
//   - Debe devolver solo los datos necesarios para la ruta principal
//
// - [ ] __GET /pokemons/{idPokemon}__:
//   - Obtener el detalle de un pokemon en particular
//   - Debe traer solo los datos pedidos en la ruta de detalle de pokemon
//   - Tener en cuenta que tiene que funcionar tanto para un id de un pokemon existente en pokeapi o uno creado por ustedes
// - [ ] __GET /pokemons?name="..."__:
//   - Obtener el pokemon que coincida exactamente con el nombre pasado como query parameter (Puede ser de pokeapi o creado por nosotros)
//   - Si no existe ningún pokemon mostrar un mensaje adecuado
// - [ ] __POST /pokemons__:
//   - Recibe los datos recolectados desde el formulario controlado de la ruta de creación de pokemons por body
//   - Crea un pokemon en la base de datos relacionado con sus tipos.
// - [ ] __GET /types__:
//   - Obtener todos los tipos de pokemons posibles
//   - En una primera instancia deberán traerlos desde pokeapi y guardarlos en su propia base de datos y luego ya utilizarlos desde allí


module.exports = router;
