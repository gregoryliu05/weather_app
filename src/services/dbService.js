import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const dbService = {
  // CREATE
  createWeatherRequest: async (city, country, selectedRange) => {
    return axios.post(`${BASE_URL}/weather`, {
      city,
      country,
      selectedRange
    });
  },

  // READ
  getAllWeatherRequests: async () => {
    return axios.get(`${BASE_URL}/weather`);
  },

  // UPDATE
  updateWeatherRequest: async (id, updatedData) => {
    return axios.put(`${BASE_URL}/weather/${id}`, updatedData);
  },

  // DELETE
  deleteWeatherRequest: async (id) => {
    return axios.delete(`${BASE_URL}/weather/${id}`);
  }
};

export default dbService; 