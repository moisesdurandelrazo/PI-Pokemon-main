const { Router } = require('express');
const axios = require('axios')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const pokemonRouter = require('./pokemonRouter');
const typesRouter = require('./typesRouter');

const { Pokemon,Type } = require('../db.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/pokemons', pokemonRouter);
router.use('/types', typesRouter);

router.get('/pokemons/{idPokemon}', async(req, res)=> {
    const {idPokemon} = req.query
})

router.get('/pokemons?name=:name', async(req, res)=> {
    const {name}= req.query

    res.json(200, 'ruta custom')
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
