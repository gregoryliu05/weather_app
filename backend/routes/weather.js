const express = require('express')
const axios = require('axios')
const countries = require("i18n-iso-countries");
const enLocale = require("i18n-iso-countries/langs/en.json");
const pool = require('../config/db');

countries.registerLocale(enLocale);

const router = express.Router();

const apiKey = process.env.VITE_API_KEY;
const weatherURL = "https://api.openweathermap.org/data/3.0/onecall?";
const locURL = "https://api.openweathermap.org/geo/1.0/direct?";

// Helper functions
const getCountryCode = (countryName) => {
  return countries.getAlpha2Code(countryName, "en");
};

const getCoordsWeather = async (lat, lon) => {
  const response = await axios.get(
    `${weatherURL}lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=minutely&units=metric`
  );
  return response.data;
};

const getCityCountryCoords = async (city, country) => {
  const response = await axios.get(
    `${locURL}q=${city},${country}&limit=1&appid=${apiKey}`
  );
  return response.data[0];
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// POST /api/weather
router.post("/weather", async (req, res) => {
  const { city, country, selectedRange } = req.body;
  
  if (!city || !country) {
    return res.status(400).json({ error: "City and country name are required." });
  }

  try {
    const countryCode = getCountryCode(country);
    if (!countryCode) {
      return res.status(400).json({ error: "Invalid country name" });
    }

    const locationData = await getCityCountryCoords(city, countryCode);

    if (!locationData) {
      return res.status(404).json({ error: "Location not found" });
    }

    const weatherData = await getCoordsWeather(locationData.lat, locationData.lon);

    const start_date =  formatDate(selectedRange.start) 
    const end_date =  formatDate(selectedRange.end)

    const query = `
      INSERT INTO weather_requests (location, start_date, end_date, weather_data)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      `${city}, ${country}`,
      start_date,
      end_date,
      weatherData
    ];
    const dbResponse = await pool.query(query, values);

    res.status(200).json({
      location: `${city}, ${country}`,
      weather: weatherData,
      saved: dbResponse.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      error: "Error processing weather request",
      details: error.message
    });
  }
});
  

// GET - Get all weather requests
router.get("/weather", async (req, res) => {
  try {
    const query = "SELECT * FROM weather_requests ORDER BY start_date DESC";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ 
      error: "Error fetching weather history",
      details: error.message 
    });
  }
});

// UPDATE a weather request
router.put("/weather/:id", async (req, res) => {
  const { id } = req.params;
  const { location, start_date, end_date } = req.body;

  try {
    const existingRecord = await pool.query(
      "SELECT weather_data FROM weather_requests WHERE id = $1",
      [id]
    );

    if (existingRecord.rows.length === 0) {
      return res.status(404).json({ error: "Weather request not found" });
    }

    const weather_data = existingRecord.rows[0].weather_data;

    const query = `
      UPDATE weather_requests 
      SET location = $1, 
          start_date = $2, 
          end_date = $3, 
          weather_data = $4
      WHERE id = $5 
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      location, 
      start_date, 
      end_date, 
      weather_data,  
      id
    ]);
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ 
      error: "Error updating weather request",
      details: error.message 
    });
  }
});

// DELETE a weather request
router.delete("/weather/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM weather_requests WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Weather request not found" });
    }
    
    res.json({ message: "Weather request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting weather request" });
  }
});

module.exports = router; 

