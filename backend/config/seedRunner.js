const { initDatabase } = require('./initDb');

(async () => {
  try {
    console.log('🚀 Running database schema and seeding...');
    await initDatabase(true);
    console.log('🎉 Database setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to setup database:', err);
    process.exit(1);
  }
})();
