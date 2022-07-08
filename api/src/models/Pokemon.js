const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    hp: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    defense:{
      type: DataTypes.INTEGER
    },
    speed: {
      type: DataTypes.INTEGER
    },
    height:{
      type: DataTypes.INTEGER
    },
    weigth: {
      type: DataTypes.INTEGER
    }
  })

};
