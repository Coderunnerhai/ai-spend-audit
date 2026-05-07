import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ========== POST - CREATE AUDIT ==========
app.post('/api/audit/create', async (req, res) => {
  console.log('✅ POST /api/audit/create called');
  
  try {
    const { formData } = req.body;
    const shareableId = uuidv4();
    
    // Calculate savings (simplified)
    let totalSavings = 0;
    const recommendations = [];
    
    if (formData?.tools?.cursor?.enabled && 
        formData.tools.cursor.plan === 'Business' && 
        formData.tools.cursor.seats < 20) {
      const savings = (40 - 20) * formData.tools.cursor.seats;
      totalSavings += savings;
      recommendations.push({
        tool: 'cursor',
        toolDisplayName: 'Cursor',
        recommendedAction: 'Switch to Pro plan',
        potentialSavings: savings,
        reason: `Business plan requires 20+ seats. You have ${formData.tools.cursor.seats} seats.`
      });
    }
    
    res.json({
      success: true,
      shareableId: shareableId,
      auditResult: {
        recommendations: recommendations,
        totalMonthlySavings: totalSavings,
        totalAnnualSavings: totalSavings * 12,
        isHighSavings: totalSavings > 500,
        isOptimal: totalSavings === 0,
        summary: totalSavings === 0 ? "Great news! Your AI setup is optimized." : `You could save $${totalSavings}/month.`
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== GET - RETRIEVE AUDIT BY ID ==========
app.get('/api/audit/:shareableId', async (req, res) => {
  console.log('✅ GET /api/audit/:id called for:', req.params.shareableId);
  
  try {
    const { shareableId } = req.params;
    
    // Return mock data for now
    // Later, fetch from MongoDB using shareableId
    res.json({
      success: true,
      audit: {
        recommendations: [],
        totalMonthlySavings: 0,
        totalAnnualSavings: 0,
        isHighSavings: false,
        isOptimal: true,
        summary: `Shareable audit results for ID: ${shareableId}`,
        createdAt: new Date()
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== POST - CAPTURE LEAD ==========
app.post('/api/leads/capture', async (req, res) => {
  console.log('✅ POST /api/leads/capture called');
  
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
  console.log(`✅ POST /api/audit/create`);
  console.log(`✅ GET /api/audit/:shareableId`);
  console.log(`✅ POST /api/leads/capture`);
});