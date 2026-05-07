import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// SIMPLE TEST ROUTE - NO DEPENDENCIES
app.post('/api/audit/create', (req, res) => {
  console.log('✅ Test endpoint hit!');
  res.json({
    success: true,
    message: 'Backend is working!',
    shareableId: 'test-123',
    auditResult: {
      totalMonthlySavings: 99,
      summary: 'Test response - your API is reachable!'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API is running', endpoints: ['POST /api/audit/create', 'GET /api/health'] });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Test endpoint: POST /api/audit/create`);
});