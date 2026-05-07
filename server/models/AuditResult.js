// server/models/AuditResult.js (Updated)
import mongoose from 'mongoose';

const auditResultSchema = new mongoose.Schema({
  shareableId: {
    type: String,
    required: true,
    unique: true
  },
  input: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  recommendations: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  totalMonthlySavings: {
    type: Number,
    default: 0
  },
  totalAnnualSavings: {
    type: Number,
    default: 0
  },
  isHighSavings: {
    type: Boolean,
    default: false
  },
  isOptimal: {
    type: Boolean,
    default: false
  },
  summary: String,
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for auto-deletion after 90 days
auditResultSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
auditResultSchema.index({ shareableId: 1 });

export default mongoose.model('AuditResult', auditResultSchema);