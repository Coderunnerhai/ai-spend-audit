import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ========== MAIN AUDIT ENDPOINT ==========
app.post('/api/audit/create', async (req, res) => {
  console.log('✅ Audit endpoint called!');
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
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Spend Audit API is running',
    endpoints: {
      audit_create: 'POST /api/audit/create',
      health: 'GET /api/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ POST /api/audit/create is ready`);
  console.log(`✅ GET /api/health is ready`);
});