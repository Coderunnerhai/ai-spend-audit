// API Configuration
const isProduction = import.meta.env.PROD;

export const API_URL = isProduction 
  ? 'https://ai-spend-audit.onrender.com'
  : 'http://localhost:3001';

export default API_URL;