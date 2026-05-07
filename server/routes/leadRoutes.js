import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();

router.post('/capture', async (req, res) => {
  try {
    const { email, companyName, role, auditData, shareableId, honeypot } = req.body;
    
    if (honeypot) {
      return res.status(400).json({ success: false, error: 'Spam detected' });
    }
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email required' });
    }
    
    const leadData = {
      email,
      companyName: companyName || '',
      role: role || '',
      auditData: auditData || {},
      totalMonthlySavings: auditData?.totalMonthlySavings || 0,
      shareableId: shareableId || ''
    };
    
    const lead = new Lead(leadData);
    await lead.save();
    
    res.json({ success: true, message: 'Lead captured successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
