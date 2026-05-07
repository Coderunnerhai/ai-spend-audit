import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - NO wildcard options needed
app.use(cors({
  origin: [
    'https://ai-spend-audit-olive.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ========== AUDIT ENDPOINT ==========
app.post('/api/audit/create', async (req, res) => {
  console.log('✅ Audit endpoint called');
  
  try {
    const { formData } = req.body;
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
        summary: "Your backend is working!"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== LEAD CAPTURE ENDPOINT ==========
app.post('/api/leads/capture', async (req, res) => {
  console.log('✅ Lead capture endpoint called');
  
  try {
    const { email, companyName, role } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email required' });
    }
    
    res.json({ 
      success: true, 
      message: 'Lead captured successfully',
      leadId: uuidv4()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== HEALTH CHECK ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});