import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'https://ai-spend-audit-olive.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});
app.use(express.json());

// ========== AUDIT ENDPOINT ==========
app.post('/api/audit/create', async (req, res) => {
  console.log('✅ Audit endpoint called');
  console.log('Request body:', req.body);
  
  try {
    const { formData } = req.body;
    
    // Calculate savings
    let totalSavings = 0;
    const recommendations = [];
    
    // Check for Cursor Business plan (less than 20 seats)
    if (formData?.tools?.cursor?.enabled && 
        formData.tools.cursor.plan === 'Business' && 
        formData.tools.cursor.seats < 20) {
      const savings = (40 - 20) * formData.tools.cursor.seats;
      totalSavings += savings;
      recommendations.push({
        tool: 'cursor',
        toolDisplayName: 'Cursor',
        currentPlan: 'Business',
        currentSpend: formData.tools.cursor.monthlySpend,
        recommendedAction: 'Switch to Pro plan',
        potentialSavings: savings,
        reason: `Business plan requires 20+ seats. You have ${formData.tools.cursor.seats} seats. Switching to Pro saves $${savings}/month.`
      });
    }
    
    // Check for ChatGPT Team plan (less than 3 seats)
    if (formData?.tools?.chatgpt?.enabled && 
        formData.tools.chatgpt.plan === 'Team' && 
        formData.tools.chatgpt.seats < 3) {
      const savings = (30 - 20) * formData.tools.chatgpt.seats;
      totalSavings += savings;
      recommendations.push({
        tool: 'chatgpt',
        toolDisplayName: 'ChatGPT',
        currentPlan: 'Team',
        currentSpend: formData.tools.chatgpt.monthlySpend,
        recommendedAction: 'Switch to Plus plan',
        potentialSavings: savings,
        reason: `Team plan requires 3+ seats. You have ${formData.tools.chatgpt.seats} seats. Switching to Plus saves $${savings}/month.`
      });
    }
    
    const shareableId = uuidv4();
    
    const auditResult = {
      recommendations: recommendations,
      totalMonthlySavings: totalSavings,
      totalAnnualSavings: totalSavings * 12,
      isHighSavings: totalSavings > 500,
      isOptimal: totalSavings === 0,
      summary: totalSavings === 0 ? "Great news! Your AI tool setup is already optimized." : `We found ${recommendations.length} optimization opportunities that could save you $${totalSavings}/month.`
    };
    
    res.json({
      success: true,
      shareableId: shareableId,
      auditResult: auditResult
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== LEAD CAPTURE ENDPOINT ==========
app.post('/api/leads/capture', async (req, res) => {
  console.log('✅ Lead capture endpoint called');
  console.log('Lead data:', req.body);
  
  try {
    const { email, companyName, role, auditData, shareableId } = req.body;
    
    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email required' });
    }
    
    // Here you would save to MongoDB
    // For now, just log and return success
    console.log(`Lead captured: ${email} from ${companyName || 'Unknown company'}`);
    console.log(`Savings found: $${auditData?.totalMonthlySavings || 0}/month`);
    
    res.json({ 
      success: true, 
      message: 'Lead captured successfully',
      leadId: uuidv4()
    });
    
  } catch (error) {
    console.error('Error capturing lead:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== GET AUDIT ENDPOINT ==========
app.get('/api/audit/:shareableId', async (req, res) => {
  console.log('✅ Get audit endpoint called for ID:', req.params.shareableId);
  
  // For now, return a mock response
  res.json({
    success: true,
    audit: {
      recommendations: [],
      totalMonthlySavings: 0,
      totalAnnualSavings: 0,
      isHighSavings: false,
      isOptimal: true,
      summary: "Audit results would appear here. This is a test response.",
      createdAt: new Date()
    }
  });
});

// ========== HEALTH CHECK ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ========== ROOT ENDPOINT ==========
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Spend Audit API is running',
    endpoints: {
      audit_create: 'POST /api/audit/create',
      leads_capture: 'POST /api/leads/capture',
      get_audit: 'GET /api/audit/:shareableId',
      health: 'GET /api/health'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ POST /api/audit/create ready`);
  console.log(`✅ POST /api/leads/capture ready`);
  console.log(`✅ GET /api/audit/:shareableId ready`);
});