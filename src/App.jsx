import React, { useState } from "react";
import "./App.css";
import weatherService from "./services/forms";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import WeatherHistory from './components/WeatherHistory';
import Header from './components/Header';
import dbService from "./services/dbService";

function App() {
  const [selectedRange, setSelectedRange] = useState({ from: undefined, to: undefined });
  const [formData, setFormData] = useState({
    city: "",
    country: "",
  });
  const [currLoc, setCurrLoc] = useState({
    city: "",
    country: "",
  });
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchWeatherData = async (city, country, selectedRange) => {
    try {
      
      const response = await dbService.createWeatherRequest(
        city, 
        country,
        {
          start: selectedRange.from.toISOString().split('T')[0],
          end: selectedRange.to.toISOString().split('T')[0]
        }
      );
      
      setResultData(response.data.weather);
      setCurrLoc({ city, country });
      setError(null);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
        "Invalid city name, or city is not in country. Please check your input.";
      setError(errorMessage);
      console.error("Error details:", {
        message: err.response?.data?.error,
        status: err.response?.status,
        data: err.response?.data
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchWeatherData(formData.city, formData.country, {
      from: selectedRange?.from || new Date(),
      to: selectedRange?.to || new Date()
    });
  };

  const renderWeatherData = () => {
    if (!resultData) {
      return <p>No weather data available. Enter a city and country to get started, or check your input.</p>;
    }

    const { current, daily } = resultData;

    // Check if a valid date range is selected
    if (!selectedRange || !selectedRange.from || !selectedRange.to) {
      return <p>Please select a valid date range to view weather data.</p>;
    }

    // Filter daily weather data by selected date range
    const filteredData = daily.filter(
      (day) =>
        new Date(day.dt * 1000) >= new Date(selectedRange.from) &&
        new Date(day.dt * 1000) <= new Date(selectedRange.to)
    );

    return (
      <div>
        <h2>
          Weather Data for {currLoc.city}, {currLoc.country}
        </h2>
        <p>
          <strong>Current Temperature:</strong> {current.temp}°C
        </p>
        <p>
          <strong>Weather Condition:</strong> {current.weather[0].main} - {current.weather[0].description}
        </p>
        <img
          src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}
          alt={current.weather[0].description}
        />

        <h3>Daily Forecast</h3>
        {filteredData.length > 0 ? (
          filteredData.map((day, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <p>
                <strong>Date:</strong> {new Date(day.dt * 1000).toLocaleDateString()}
              </p>
              <p>
                <strong>Temperature:</strong> Day: {day.temp.day}°C, Night: {day.temp.night}°C
              </p>
              <p>
                <strong>Weather Condition:</strong> {day.weather[0].main} - {day.weather[0].description}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
              />
            </div>
          ))
        ) : (
          <p>No weather data available for the selected date range.</p>
        )}
      </div>
    );
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit}>
        <label>
          City
          <input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            type="text"
          />
        </label>
        <br />
        <label>
          Country
          <input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            type="text"
          />
        </label>
        <br />
        <label> Date Range</label>
        <DayPicker
          mode="range"
          selected={selectedRange || { from: undefined, to: undefined }}
          onSelect={setSelectedRange}
          footer={
            selectedRange && selectedRange.from && selectedRange.to
              ? `Selected from ${selectedRange.from.toLocaleDateString()} to ${selectedRange.to.toLocaleDateString()}`
              : "Pick a range of dates."
          }
        />
        <br />
        <button type="submit">Search</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {renderWeatherData()}
      
      <WeatherHistory />
    </div>
  );
}

export default App;