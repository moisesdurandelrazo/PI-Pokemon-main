/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Pokemon, conn } = require("../../src/db.js");

const agent = session(app);
const pokemon = {
  name: "Pikachu",
};

describe("Pokemon routes", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() =>
    Pokemon.sync({ force: true }).then(() => Pokemon.create(pokemon))
  );
  describe("GET /pokemons", () => {
    it("should get 200", () =>
      agent
        .get("/pokemons")
        .expect(200)
        .then(() => done(new Error("It requires a valid name")))
        .catch(() => done()));
  });
  describe("GET /type", () => {
    it("should get 200", () =>
      agent
        .get("/type")
        .expect(200)
        .then(() => new Error("Error with types"))
        .catch(() => done()));
  });
});
