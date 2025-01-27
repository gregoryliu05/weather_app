import { useState, useEffect } from 'react'
import './App.css'
import weatherService from './services/forms'


function App() {
  const [formData, setFormData] = useState({
    city: "",
    country: ""
  })

  const [currLoc, setCurrLoc] = useState({
    city: "",
    country: ""
  })

  const [resultData, setResultData] = useState(null)


  const handleChange = (event) => {
    const {name , value} = event.target
    setFormData({...formData, 
      [name]: value
    })
  }

  const handleSubmit = (event) => {
      event.preventDefault()

      const { city, country } = formData;

      const countryCode = weatherService.getCountryCode(country);
      if (!countryCode) {
      alert("Invalid country name. Please check your input.");
      return;
      }

      weatherService.getCityCountryCoords(city, countryCode)
      .then(response => {
        weatherService.getCoordsWeather(response.data[0].lat, response.data[0].lon)
        .then(response1 => { 
          console.log(response1.data)
          setResultData(response1.data)
          setCurrLoc({city, country})
        }
      ).catch((error) => {
        console.error("Error Fetching", error)
      })
      }).catch((error) => {
        alert("Invalid city name, or city is not in country. Please check your input")
      })
  }

  return (
    <>
      <div>
        <form onSubmit = {handleSubmit}>
          <label>City</label>
          <input 
          id = "city"
          name = "city"
          value ={formData.city} 
          onChange = {handleChange} 
          required
          type = 'text'
          ></input>
          
          <br>
          </br>

          <label>Country</label>
          <input 
          id = "country"
          name = "country"
          value ={formData.country} 
          onChange = {handleChange} 
          required
          type = 'text'
          ></input> 
          <br></br>
        <button type = "submit"> Search</button>
        </form>
        <>
        {resultData? 
       <div>
       
       <h2>Weather Data for {currLoc.city}, {currLoc.country}</h2>
       <p><strong>Temperature:</strong> {resultData.current.temp}°C</p>
       <p><strong>Feels Like:</strong> {resultData.current.feels_like}°C</p>
       <p><strong>Pressure:</strong> {resultData.current.pressure} hPa</p>
       <p><strong>Humidity:</strong> {resultData.current.humidity}%</p>
       <p><strong>Visibility:</strong> {resultData.current.visibility / 1000} km</p>
       <p><strong>Wind Speed:</strong> {resultData.current.wind_speed} m/s</p>
       <p><strong>Wind Direction:</strong> {resultData.current.wind_deg}°</p>
       {resultData.current.wind_gust && (
         <p><strong>Wind Gust:</strong> {resultData.current.wind_gust} m/s</p>
       )}
       <p><strong>Weather Condition:</strong> {resultData.current.weather[0].main}</p>
       <p><strong>Description:</strong> {resultData.current.weather[0].description}</p>
       <img
         src={`https://openweathermap.org/img/wn/${resultData.current.weather[0].icon}@2x.png`}
         alt={resultData.current.weather[0].description}
       />
       <p><strong>Cloud Coverage:</strong> {resultData.current.clouds}%</p>
       <p><strong>Sunrise:</strong> {new Date(resultData.current.sunrise * 1000).toLocaleTimeString()}</p>
       <p><strong>Sunset:</strong> {new Date(resultData.current.sunset * 1000).toLocaleTimeString()}</p>
     
       
       <h3>Daily Forecast</h3>
       <div>
         {resultData.daily.map((day, index) => (
           <div key={index} style={{ marginBottom: "1rem" }}>
             <p><strong>Date:</strong> {new Date(day.dt * 1000).toLocaleDateString()}</p>
             <p><strong>Summary:</strong> {day.summary || "No summary available"}</p>
             <p><strong>Temperature:</strong> Day: {day.temp.day}°C, Night: {day.temp.night}°C</p>
             <p><strong>Feels Like:</strong> Day: {day.feels_like.day}°C, Night: {day.feels_like.night}°C</p>
             <p><strong>Pressure:</strong> {day.pressure} hPa</p>
             <p><strong>Humidity:</strong> {day.humidity}%</p>
             <p><strong>Wind Speed:</strong> {day.wind_speed} m/s</p>
             <p><strong>Weather Condition:</strong> {day.weather[0].main}</p>
             <p><strong>Description:</strong> {day.weather[0].description}</p>
             <img
               src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
               alt={day.weather[0].description}
             />
             <p><strong>Cloud Coverage:</strong> {day.clouds}%</p>
             <p><strong>UV Index:</strong> {day.uvi}</p>
           </div>
         ))}
       </div>
     </div>
          :  <p>No weather data available. Enter a City or Country to get Started, or Check your input.</p>}
          </>
      </div>
    </>
  )
}

export default App
