// API Configuration
const isProduction = import.meta.env.PROD;

// Use different URLs for development and production
export const API_URL = import.meta.env.PROD 
  ? 'https://ai-spend-audit.onrender.com'
  : 'http://localhost:3001'

export default API_URL;