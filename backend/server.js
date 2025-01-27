const dotenv = require("dotenv");
const app = require("./app"); // Import the app instance from app.js

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
