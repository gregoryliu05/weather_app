const dotenv = require("dotenv");
const app = require("./app"); // Import the app instance from app.js
const initializeDatabase = require("./config/initDb");

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
