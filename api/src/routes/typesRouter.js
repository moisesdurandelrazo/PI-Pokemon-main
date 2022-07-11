const axios = require('axios');
const { Router } = require('express');


const { Type } = require("../db.js");

const typesRouter = Router();

typesRouter.get('/', async (req, res) => {
    const {data: {results}} = await axios.get('https://pokeapi.co/api/v2/type');
  
    console.log({results})
    for( t of results ) {
        const existe = await Type.findOne({where: { name: t.name }})
        if(existe) return res.json(await Type.findAll())
        await Type.create({ name: t.name})
    }
    res.json(200, await Type.findAll());
})

module.exports = typesRouter;