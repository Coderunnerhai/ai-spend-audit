import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Allow all origins for testing (temporarily)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ Handle preflight requests
app.options('/api/audit/create', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

// Your POST endpoint
app.post('/api/audit/create', async (req, res) => {
  console.log('✅ POST /api/audit/create called');
  console.log('Request body:', req.body);
  
  try {
    const { formData } = req.body;
    
    // Your audit logic here
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
        summary: "Test success - backend is working!"
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check (GET)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});