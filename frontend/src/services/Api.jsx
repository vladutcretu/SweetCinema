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

// Interceptor for JWT access
let currentAccessToken = null

export const setAuthToken = (token) => {
  currentAccessToken = token
}

api.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`
  }
  return config
})

export default api