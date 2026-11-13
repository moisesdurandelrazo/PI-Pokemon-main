const axios = require("axios");
const { Router } = require("express");

const { Type } = require("../db.js");

const typesRouter = Router();
const { wrap } = require("../auth");

typesRouter.get("/", wrap(async (req, res) => {
  const {
    data: { results },
  } = await axios.get("https://pokeapi.co/api/v2/type", { timeout: 10000, maxContentLength: 100000, maxRedirects: 0 });

  // console.log({results})
  for (const t of results) {
    const existe = await Type.findOne({ where: { name: t.name } });
    if (existe) return res.json(await Type.findAll());
    await Type.create({ name: t.name });
  }
  res.status(200).json(await Type.findAll());
}));

module.exports = typesRouter;
