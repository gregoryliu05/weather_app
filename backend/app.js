const express = require('express')
const weatherRoutes = require("./routes/weather");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Use weather routes
app.use("/api", weatherRoutes);

module.exports = app
