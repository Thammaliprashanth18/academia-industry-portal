const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const pool = require('./config/db');
const { initDatabase } = require('./config/initDb');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Verify database connection and auto-initialize if empty
    await pool.query('SELECT 1');
    console.log('📦 Database connection verified.');

    try {
      await initDatabase(false);
    } catch (dbErr) {
      console.warn('⚠️ Note on DB Auto-Init:', dbErr.message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
