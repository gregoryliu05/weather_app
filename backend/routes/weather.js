const express = require('express')
const axios = require('axios')
const countries = require("i18n-iso-countries");
const enLocale = require("i18n-iso-countries/langs/en.json");
const pool = require('../config/db');

countries.registerLocale(enLocale);

const router = express.Router();

const apiKey = process.env.VITE_API_KEY;
const weatherURL = "https://api.openweathermap.org/data/3.0/onecall";
const locURL = "https://api.openweathermap.org/geo/1.0/direct";

// Helper functions
const getCountryCode = (countryName) => {
  const countryCode = countries.getAlpha2Code(countryName, "en");
  if (!countryCode) {
    console.error(`Country code not found for ${countryName}`);
    return null;
  }
  return countryCode;
};

const getCoordsWeather = async (lat, lon) => {
  const response = await axios.get(
    `${weatherURL}?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=minutely&units=metric`
  );
  return response.data;
};

const getCityCountryCoords = async (city, countryCode) => {
  const response = await axios.get(
    `${locURL}?q=${city},${countryCode}&limit=1&appid=${apiKey}`
  );
  return response.data[0];
};

// POST /api/weather
router.post("/weather", async (req, res) => {
    const { city, country, selectedRange } = req.body;
  
    if (!city || !country) {
      return res.status(400).json({ error: "City and country name are required." });
    }
  
    try {
      console.log("Received city:", city);
      console.log("Received country:", country);
  
      // Convert country name to country code
      const countryCode = getCountryCode(country);
      console.log("Country code:", countryCode);
  
      
      if (!countryCode) {
        return res.status(400).json({ error: "Invalid country name. Please check your input." });
      }
  
      // Get coordinates from city and country code
      const locationData = await getCityCountryCoords(city, countryCode);
      console.log("Location data:", locationData);
  
      if (!locationData) {
        return res.status(404).json({ error: "Location not found." });
      }
  
      const { lat, lon } = locationData;
      console.log("Coordinates:", lat, lon);
  
      // Fetch weather data
      const weatherData = await getCoordsWeather(lat, lon);
      console.log("Weather data:", weatherData);
  
      // Assuming selectedRange has start and end dates
      const startDate = selectedRange?.start || new Date();
      const endDate = selectedRange?.end || new Date();

      const query = `
        INSERT INTO weather_requests (location, start_date, end_date, weather_data)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      
      await pool.query(query, [
        `${city}, ${country}`,
        startDate,
        endDate,
        weatherData
      ]);
  
      res.status(200).json({
        location: `${city}, ${country}`,
        weather: weatherData,
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ 
        error: "Error saving weather data.",
        details: error.message 
      });
    }
  });
  

// READ
router.get("/weather/:location", async (req, res) => {
  const { location } = req.params;

  try {
    const result = await pool.query("SELECT * FROM weather_requests WHERE location = $1;", [location]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data." });
  }
});

// UPDATE
router.put("/weather/:id", async (req, res) => {
  const { id } = req.params;
  const { location, start_date, end_date } = req.body;

  try {
    const query = `
      UPDATE weather_requests
      SET location = $1, start_date = $2, end_date = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [location, start_date, end_date, id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error updating record." });
  }
});

// DELETE
router.delete("/weather/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM weather_requests WHERE id = $1;", [id]);
    res.json({ message: "Record deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting record." });
  }
});

module.exports = router; // Export the router

