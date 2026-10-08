const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function initDatabase(forceSeed = false) {
  try {
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    const seedPath = path.resolve(__dirname, '../../database/seed.sql');

    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('✅ Database schema initialized successfully.');
    }

    // Check if users table already has records
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0 || forceSeed) {
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await pool.query(seedSql);
        console.log('✅ Database seed data inserted successfully.');
      }
    } else {
      console.log(`ℹ️ Database already populated (${rows[0].count} users). Skipping seed.`);
    }
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    throw error;
  }
}

module.exports = { initDatabase };
