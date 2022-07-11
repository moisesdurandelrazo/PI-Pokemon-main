const axios = require('axios');
const { Router } = require('express');

const { Pokemon, Type } = require("../db.js");

const pokemonRouter = Router();

const getFullPokemons = incompletePokemons => {
  return Promise.all(
    incompletePokemons.map(async pokemon => {
      const { data } = await axios.get(pokemon.url);
      console.log({t: JSON.stringify(data.types, null, 2) })
      return {
        id: data.id,
        name: data.name,
        img: data.sprites.front_default,
        types: data.types.map((t, idx) => ({id: idx, name: t.type.name})),
      };
    })
  );
};

const getPokemonByName = async pokemonName => {
   const db = await Pokemon.findOne({
     where: {
       name: pokemonName,
     },
     include: Type,
   });


  if (db) {
    return [
      {
        id: db.id,
        name: db.name,
        type: db.types,
        img: 'https://media.giphy.com/media/DRfu7BT8ZK1uo/giphy.gif',
      },
    ];
  } else {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    console.log({data})
    return [
      {
        id: data.id,
        name: data.name,
        type: data.types.map((t, idx) => ({id: idx, name: t.type.name})),
        img: data.sprites.front_default,
      },
    ];
  }
};

pokemonRouter.get('/', async (req, res) => {
  const { name } = req.query;
  
  if (name) {
    try {
      const pokemon = await getPokemonByName(name.toLocaleLowerCase());
      console.log({ pokemon });
      return res.json(200, pokemon);
    } catch (e) {
      return res.json(401, []);
    }
  }

   const dbPokemons = await Pokemon.findAll({ include: Type });

  try {
    const { data } = await axios.get(
      'https://pokeapi.co/api/v2/pokemon?limit=5'
    );
    const apiPokemons = await getFullPokemons(data.results);
    const combinedPokemons = [...dbPokemons, ...apiPokemons];
    return res.json(200, combinedPokemons);
  } catch (e) {
    return res.json(401, { msg: 'hubo un error' });
  }
});

pokemonRouter.get('/:id', async (req, res)=> {
  const { id } = req.params
  console.log({isNan: isNaN(id)})
  if(isNaN(id)){
    const db = await Pokemon.findOne({
      where: {
        id: id,
      },
      include: Type,
    });

    if(db) {
      return res.json(200, [
        {
          ...db,
          img: 'https://media.giphy.com/media/DRfu7BT8ZK1uo/giphy.gif',
        },
      ]
      )
    }

  }
  try {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    );
    console.log({data})
    const formattedPokemon = {
      id: data.id,
      name: data.name,
      types: data.types.map((t, idx) => ({id: idx, name: t.type.name})),
      img: data.sprites.versions["generation-v"]["black-white"].animated
        .front_default,
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      speed: data.stats[5].base_stat,
      height: data.height,
      weigth: data.weight,
    };
    return res.json(201, formattedPokemon)
  } catch(e) {
    return  res.send(401, {msg: 'Pokemon no encontrado'})
  }
})



module.exports = pokemonRouter;