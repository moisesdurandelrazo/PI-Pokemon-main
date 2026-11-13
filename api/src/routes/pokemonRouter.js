const axios = require("axios");
const { Router } = require("express");

const { Pokemon, Type } = require("../db.js");

const pokemonRouter = Router();
const { pagination, pokemonInput } = require("../security");
const { wrap, trustedWrite, requireSession, requireCsrf } = require("../auth");
const { conn } = require("../db");
const upstream = axios.create({ timeout: 10000, maxContentLength: 2 * 1024 * 1024, maxRedirects: 0 });

const getFullPokemons = (incompletePokemons) => {
  return Promise.all(
    incompletePokemons.map(async (pokemon) => {
      const url = new URL(pokemon.url);
      if (url.origin !== "https://pokeapi.co" || !/^\/api\/v2\/pokemon\/\d+\/?$/.test(url.pathname) || url.search || url.username || url.password) throw new Error("URL de proveedor inválida");
      const { data } = await upstream.get(url.href);
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
    const { data } = await upstream.get(
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
//     const { data } = await upstream.get(
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
  const paging = pagination(req.query);
  if (!paging) return res.status(400).json({ msg: "Paginación inválida (máximo 50 por página)" });
  const { perPage, offset } = paging; 

  try {
    const dbPokemons = await Pokemon.findAll({
  
      limit: Number(perPage),
      offset: Number(offset),
    });

    const { data } = await upstream.get(
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



pokemonRouter.get("/:id", wrap(async (req, res) => {
  const { id } = req.params;
  if (!/^(?:[1-9]\d{0,4}|[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/i.test(id)) return res.status(400).json({ msg: "Identificador inválido" });
  // console.log({ isNan: isNaN(id), id });
  if (isNaN(id)) {
    const db = await Pokemon.findOne({
      where: {
        id: id,
      },
      include: Type,
    });

    if (db) {
      return res.status(200).json([
        {
          ...db.toJSON(),
          img: "https://media.giphy.com/media/DRfu7BT8ZK1uo/giphy.gif",
        },
      ]);
    }
  }
  try {
    const { data } = await upstream.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
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
    return res.status(200).json(formattedPokemon);
  } catch (e) {
    return res.status(404).json({ msg: "Pokemon no encontrado" });
  }
}));
pokemonRouter.post("/", trustedWrite, requireSession, requireCsrf, wrap(async (req, res) => {
  const input = pokemonInput(req.body);
  if (!input) return res.status(400).json({ msg: "Datos del Pokémon inválidos" });
  try {
    const result = await conn.transaction(async transaction => {
      const types = await Type.findAll({ where: { name: input.types }, transaction });
      if (types.length !== input.types.length) throw Object.assign(new Error("Tipos inválidos"), { status: 400 });
      const pokemon = await Pokemon.create(input.values, { transaction });
      await pokemon.addTypes(types, { transaction });
      return pokemon;
    });
    return res.status(201).json(result);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") return res.status(409).json({ msg: "El Pokémon ya existe" });
    throw error;
  }
}));
module.exports = pokemonRouter;
