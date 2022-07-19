const { Router } = require("express");
const axios = require("axios");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const pokemonRouter = require("./pokemonRouter");
const typesRouter = require("./typesRouter");

const { Pokemon, Type } = require("../db.js");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/types", typesRouter);
router.use("/pokemons", pokemonRouter);

module.exports = router;
