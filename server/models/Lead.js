// server/models/Lead.js (Updated)
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  companyName: String,
  role: String,
  teamSize: Number,
  auditData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  totalMonthlySavings: Number,
  totalAnnualSavings: Number,
  isHighSavings: Boolean,
  shareableId: String,
  emailSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for email lookups
leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: 1 });

export default mongoose.model('Lead', leadSchema);