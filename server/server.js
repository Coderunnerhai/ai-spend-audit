import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Simple audit endpoint
app.post('/api/audit/create', (req, res) => {
  console.log('✅ Audit endpoint called');
  console.log('Request body:', req.body);
  
  const shareableId = uuidv4();
  
  res.json({
    success: true,
    shareableId: shareableId,
    auditResult: {
      recommendations: [],
      totalMonthlySavings: 0,
      totalAnnualSavings: 0,
      isHighSavings: false,
      isOptimal: true,
      summary: "Your backend is working! This is a test response."
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ POST /api/audit/create ready`);
});