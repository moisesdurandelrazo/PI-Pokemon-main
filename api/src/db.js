const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { userInfo } = require("os");
const { ENV, DEV_POSTGRES_URL, DATABASE_URL } = process.env;

const postgresUrl = ENV === "dev" ? DEV_POSTGRES_URL : DATABASE_URL;
// console.log({ env: process.env });

const sequelize = new Sequelize(postgresUrl, {
  dialectOptions: {
    dialect: 'postgres',
    ssl:false,
    // ssl: {
    //   require: false,
    //   rejectUnauthorized: false,
    // },
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("DB conectada");
  })
  .catch((e) => {
    console.log("tenemos un problema", e);
  });

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Pokemon, Type } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

Pokemon.belongsToMany(Type, { through: "TypePokemon" });
Type.belongsToMany(Pokemon, { through: "TypePokemon" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
