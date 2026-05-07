// server/routes/auditRoutes.js
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import AuditResult from '../models/AuditResult.js';
import { auditEngine } from '../services/auditEngine.js';

const router = express.Router();

// Create audit and get shareable URL
router.post('/create', async (req, res) => {
  try {
    const { formData } = req.body;
    
    console.log('Creating audit with data:', JSON.stringify(formData, null, 2));
    
    // Run audit engine
    const auditResult = auditEngine(formData);
    
    // Generate shareable ID
    const shareableId = uuidv4();
    
    // Create new audit document
    const newAudit = new AuditResult({
      shareableId: shareableId,
      input: formData,
      recommendations: auditResult.recommendations,
      totalMonthlySavings: auditResult.totalMonthlySavings,
      totalAnnualSavings: auditResult.totalAnnualSavings,
      isHighSavings: auditResult.isHighSavings,
      isOptimal: auditResult.isOptimal,
      summary: auditResult.summary,
      views: 0
    });
    
    // Save to database
    const savedAudit = await newAudit.save();
    console.log('✅ Audit saved with ID:', savedAudit.shareableId);
    console.log('✅ MongoDB ID:', savedAudit._id);
    
    // Send response
    res.status(200).json({
      success: true,
      shareableId: shareableId,
      auditResult: auditResult
    });
    
  } catch (error) {
    console.error('Error saving audit:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get public audit result
router.get('/:shareableId', async (req, res) => {
  try {
    const { shareableId } = req.params;
    console.log('Looking for audit with ID:', shareableId);
    
    const audit = await AuditResult.findOne({ shareableId: shareableId });
    
    if (!audit) {
      console.log('❌ No audit found with ID:', shareableId);
      return res.status(404).json({ 
        success: false, 
        error: 'Audit not found' 
      });
    }
    
    console.log('✅ Found audit:', audit.shareableId);
    
    // Increment view count
    audit.views += 1;
    await audit.save();
    
    // Return public data (no personal info)
    res.json({
      success: true,
      audit: {
        recommendations: audit.recommendations,
        totalMonthlySavings: audit.totalMonthlySavings,
        totalAnnualSavings: audit.totalAnnualSavings,
        isHighSavings: audit.isHighSavings,
        isOptimal: audit.isOptimal,
        summary: audit.summary,
        createdAt: audit.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error fetching audit:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Debug endpoint to see all audits
router.get('/debug/all', async (req, res) => {
  try {
    const audits = await AuditResult.find({}).sort({ createdAt: -1 }).limit(10);
    res.json({
      success: true,
      count: audits.length,
      audits: audits.map(a => ({
        shareableId: a.shareableId,
        savings: a.totalMonthlySavings,
        createdAt: a.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;