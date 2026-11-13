require('dotenv').config();
const { conn } = require('./src/db');
(async () => {
  try {
    // Create new auth tables without deleting existing application data.
    await conn.sync();
    const query = conn.getQueryInterface();
    const columns = await query.describeTable('pokemons');
    if (!columns.attack) await query.addColumn('pokemons', 'attack', {
      type: require('sequelize').DataTypes.INTEGER, allowNull: false, defaultValue: 0,
    });
  } finally { await conn.close(); }
})().catch(error => { console.error('No se pudo completar la migración:', error.name); process.exitCode = 1; });
