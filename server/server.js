import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import auditRoutes from './routes/auditRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - NO wildcards
app.use(cors({
  origin: [
    'https://ai-spend-audit-olive.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// Routes - NO wildcards, just specific paths
app.use('/api/audit', auditRoutes);
app.use('/api/leads', leadRoutes);

// Health check - specific path
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Root route - specific path
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Spend Audit API is running',
    endpoints: {
      health: '/api/health',
      createAudit: 'POST /api/audit/create',
      getAudit: 'GET /api/audit/:shareableId',
      captureLead: 'POST /api/leads/capture'
    }
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});