// API
import axios from "axios"

// App
const api_url = import.meta.env.VITE_API_URL

// Components here


// Custom instance defaults
const api = axios.create({
  baseURL: api_url || "http://127.0.0.1:8000/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api