const express = require('express')
const cors = require('cors')
const weatherRoutes = require("./routes/weather");

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Use weather routes
app.use("/api", weatherRoutes);

module.exports = app
