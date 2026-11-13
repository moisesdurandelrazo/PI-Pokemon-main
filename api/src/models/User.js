const { DataTypes } = require("sequelize");
module.exports = sequelize => sequelize.define("user", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING(254), allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
});
