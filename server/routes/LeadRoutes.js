// server/routes/leadRoutes.js (Complete working version)
import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();

// Capture lead - Simplified working version
router.post('/capture', async (req, res) => {
  try {
    const { email, companyName, role, auditData, shareableId, honeypot } = req.body;
    
    // Check for spam
    if (honeypot) {
      return res.status(400).json({ success: false, error: 'Spam detected' });
    }
    
    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email required' });
    }
    
    console.log('Saving lead:', { email, companyName, role, shareableId });
    
    // Create lead object with safe defaults
    const leadData = {
      email,
      companyName: companyName || '',
      role: role || '',
      teamSize: auditData?.teamSize || 1,
      auditData: auditData?.input || {},
      totalMonthlySavings: auditData?.totalMonthlySavings || 0,
      totalAnnualSavings: auditData?.totalAnnualSavings || 0,
      isHighSavings: auditData?.isHighSavings || false,
      shareableId: shareableId || '',
      emailSent: false
    };
    
    // Check if lead already exists
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      console.log('Lead already exists:', email);
      return res.json({ success: true, message: 'Lead already captured', existing: true });
    }
    
    // Save lead to database
    const lead = new Lead(leadData);
    await lead.save();
    
    console.log('Lead saved successfully:', lead._id);
    
    res.json({ 
      success: true, 
      message: 'Lead captured successfully',
      leadId: lead._id
    });
    
  } catch (error) {
    console.error('Error capturing lead:', error);
    // Send more detailed error for debugging
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.toString()
    });
  }
});

// Get all leads (for testing - optional)
router.get('/all', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: leads.length, leads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;