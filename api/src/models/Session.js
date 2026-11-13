const { DataTypes } = require("sequelize");
module.exports = sequelize => sequelize.define("session", {
  id: { type: DataTypes.STRING(64), primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  csrfToken: { type: DataTypes.STRING(64), allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
});
