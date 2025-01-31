import axios from "axios"
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const apiKey = import.meta.env.VITE_API_KEY;
const weatherURL = "https://api.openweathermap.org/data/3.0/onecall?"
const locURL = "https://api.openweathermap.org/geo/1.0/direct?"


const getCoordsWeather = (lat, long) => {
    return (
        axios.get(`${weatherURL}lat=${lat}&lon=${long}&appid=${apiKey}&exclude=minutely&units=metric`)
    )
}

const getCityCountryCoords = (city, country) => {
    return (
        axios.get(`${locURL}q=${city},${country}&limit=5&appid=${apiKey}`)
    )

}


const getCountryCode = (countryName) => {
  const countryCode = countries.getAlpha2Code(countryName, "en");
  if (!countryCode) {
    console.error(`Country code not found for ${countryName}`);
    return null;
  }
  return countryCode;
};


export default {getCityCountryCoords, getCoordsWeather, getCountryCode}