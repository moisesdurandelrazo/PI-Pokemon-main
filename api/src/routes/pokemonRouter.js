const axios = require("axios");
const { Router } = require("express");

const { Pokemon, Type } = require("../db.js");

const pokemonRouter = Router();

const getFullPokemons = (incompletePokemons) => {
  return Promise.all(
    incompletePokemons.map(async (pokemon) => {
      const { data } = await axios.get(pokemon.url);
      console.log({ t: JSON.stringify(data.types, null, 2) });
      console.log({ m: JSON.stringify(data.moves, null, 2) });
      console.log({ stats: data.stats });
      return {
        id: data.id,
        name: data.name,
        img: data.sprites.versions["generation-v"]["black-white"].animated
          .front_default,
        attack: data.stats[1].base_stat,
        types: data.types.map((t, idx) => ({ id: idx, name: t.type.name })),
        moves: data.moves.map((m) => ({ name: m.move.name })),
      };
    })
  );
};

const getPokemonByName = async (pokemonName) => {
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
        attack: db.attack,
        img: "https://media.giphy.com/media/DRfu7BT8ZK1uo/giphy.gif",
      },
    ];
  } else {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    // console.log({ data });
    return [
      {
        id: data.id,
        name: data.name,
        type: data.types.map((t, idx) => ({ id: idx, name: t.type.name })),
        img: data.sprites.versions["generation-v"]["black-white"].animated
          .front_default,
        moves: data.moves.map((m) => ({ name: m.move.name })),
      },
    ];
  }
};

// pokemonRouter.get("/", async (req, res) => {
//   const { name,currentcurrentPage, perPage} = req.query;

//   if (name) {
//     try {
//       const pokemon = await getPokemonByName(name.toLocaleLowerCase());
//       console.log({ pokemon });
//       return res.json(200, pokemon);
//     } catch (e) {
//       return res.json(401, []);
//     }
//   }

  

//   try {
//     const dbPokemons = await Pokemon.findAll({ include: Type });
//     const { data } = await axios.get(
//       "https://pokeapi.co/api/v2/pokemon?limit=200"
//     );
//     const apiPokemons = await getFullPokemons(data.results);
//     const combinedPokemons = [...dbPokemons, ...apiPokemons];
//     const startIndex = (currentPage - 1) * perPage;
//     const endIndex = currentPage * perPage;
//     const paginatedPokemons = combinedPokemons.slice(startIndex, endIndex);

//     return res.status(200).json({
//       total: combinedPokemons.length,
//       page: parseInt(currentPage),
//       limit: parseInt(perPage),
//       data: paginatedPokemons,});
    
//   } catch (e) {
//     return res.status(500).json( { msg: "hubo un error" });
//   }
// });


pokemonRouter.get("/", async (req, res) => {
  const { currentPage = 1, perPage = 12 } = req.query;

  const offset = (currentPage - 1) * perPage; 

  try {
    const dbPokemons = await Pokemon.findAll({
  
      perPage: Number(perPage),
      offset: Number(offset),
    });

    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${perPage}`
    );

    const apiPokemons = await getFullPokemons(data.results);

   
    const combinedPokemons = [...dbPokemons, ...apiPokemons];

    const totalPokemons = 1302; 
    return res.status(200).json({
      total: totalPokemons,
      data: combinedPokemons});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Error al obtener los Pokémon" });
  }
});



pokemonRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  // console.log({ isNan: isNaN(id), id });
  if (isNaN(id)) {
    const db = await Pokemon.findOne({
      where: {
        id: id,
      },
      include: Type,
    });

    if (db) {
      return res.json(200, [
        {
          ...db,
          img: "https://media.giphy.com/media/DRfu7BT8ZK1uo/giphy.gif",
        },
      ]);
    }
  }
  try {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    console.log({ data });
    const formattedPokemon = {
      id: data.id,
      name: data.name,
      types: data.types.map((t, idx) => ({ id: idx, name: t.type.name })),
      moves: data.moves.map((m) => ({ name: m.move.name })),
      img: data.sprites.other["official-artwork"].front_default,
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      speed: data.stats[5].base_stat,
      height: data.height,
      weigth: data.weight,
    };
    return res.json(201, formattedPokemon);
  } catch (e) {
    return res.json(401, { msg: "Pokemon no encontrado" });
  }
});
pokemonRouter.post("/", async (req, res) => {
  const { name, hp, attack, defense, speed, height, weigth, types } = req.body;
  // console.log({ types });

  if (
    !name ||
    !hp ||
    !attack ||
    !defense ||
    !speed ||
    !height ||
    !weigth ||
    !types
  )
    return res.status(404).send("Falta enviar datos obligatorios");

  const existe = await Pokemon.findOne({ where: { name: name } });
  if (existe) return res.json({ info: "El pokemon ya existe" });
  await Pokemon.findAll({ include: Type });
  try {
    const pokemon = await Pokemon.create(req.body); //, { include: Type }

    let allTypes = await Type.findAll({
      where: { name: types },
    });
    pokemon.addTypes(allTypes);

    res.status(201).json(pokemon);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = pokemonRouter;
