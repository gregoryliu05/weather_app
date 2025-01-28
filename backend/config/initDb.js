const pool = require('./db');

const initializeDatabase = async () => {
  try {
    // Create the weather_requests table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS weather_requests (
        id SERIAL PRIMARY KEY,
        location VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        weather_data JSONB NOT NULL
      );
    `;

    await pool.query(createTableQuery);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Export the initialization function
module.exports = initializeDatabase; 