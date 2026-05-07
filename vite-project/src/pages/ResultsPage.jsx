// frontend/src/pages/ResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download, Share2, Calendar, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

export default function ResultsPage() {
  const navigate = useNavigate();
  const [auditResults, setAuditResults] = useState(null);
  const [shareableId, setShareableId] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    email: '',
    companyName: '',
    role: '',
    teamSize: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Load audit results from sessionStorage
    const results = sessionStorage.getItem('auditResults');
    const id = sessionStorage.getItem('shareableId');
    
    if (!results) {
      navigate('/');
      return;
    }
    
    setAuditResults(JSON.parse(results));
    setShareableId(id);
  }, [navigate]);

  const handleExportPDF = () => {
    // PDF export functionality
    window.print();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/audit/${shareableId}`;
    navigator.clipboard.writeText(url);
    alert('Shareable link copied to clipboard!');
  };

  // frontend/src/pages/ResultsPage.jsx - Updated handleSubmitEmail
// frontend/src/pages/ResultsPage.jsx
const handleSubmitEmail = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  
  try {
    // ✅ DIRECTLY HARDCODE THE RENDER URL
    const response = await axios.post('https://ai-spend-audit.onrender.com/api/leads/capture', {
      email: emailForm.email,
      companyName: emailForm.companyName,
      role: emailForm.role,
      auditData: auditResults,
      shareableId: shareableId,
      honeypot: e.target.honeypot?.value || ''
    });
    
    if (response.data.success) {
      setSubmitted(true);
      setTimeout(() => {
        setShowEmailModal(false);
      }, 2000);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + (error.response?.data?.error || error.message));
  } finally {
    setSubmitting(false);
  }
};

  if (!auditResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} /> New Audit
        </button>
        
        {/* Hero Savings */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white p-8 mb-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Your AI Spend Audit Results</h1>
          <div className="text-5xl font-bold mb-2">
            ${auditResults.totalMonthlySavings}/month
          </div>
          <div className="text-xl mb-4">
            Potential Monthly Savings
          </div>
          <div className="text-2xl font-semibold">
            ${auditResults.totalAnnualSavings}/year
          </div>
          {auditResults.isHighSavings && (
            <div className="mt-4 inline-block bg-yellow-500 text-white px-4 py-2 rounded-full text-sm">
              🎯 High Savings Opportunity!
            </div>
          )}
        </div>
        
        {/* AI Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3">AI Analysis</h2>
          <p className="text-gray-700 leading-relaxed">{auditResults.summary}</p>
        </div>
        
        {/* Per-Tool Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tool-by-Tool Breakdown</h2>
          <div className="space-y-4">
            {auditResults.recommendations.map((rec, idx) => (
              <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{rec.toolDisplayName}</h3>
                  <div className="text-green-600 font-bold">${rec.potentialSavings}/month</div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Current: {rec.currentPlan} (${rec.currentSpend}/month)
                </p>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  → {rec.recommendedAction}
                </p>
                <p className="text-sm text-gray-500">{rec.reason}</p>
              </div>
            ))}
          </div>
          
          {auditResults.recommendations.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">You're spending well!</h3>
              <p className="text-gray-600">
                Your current AI tool setup is already optimized. We'll notify you when new opportunities arise.
              </p>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
          >
            <Download size={20} /> Export PDF
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
          >
            <Share2 size={20} /> Share Results
          </button>
          {!submitted && (
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Get Full Report →
            </button>
          )}
        </div>
        
        {/* Credex CTA for high savings */}
        {auditResults.isHighSavings && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">🚀 Ready to capture these savings?</h3>
            <p className="mb-4">
              Credex offers discounted AI infrastructure credits that could save you even more.
            </p>
            <button
              onClick={() => window.location.href = 'https://credex.ai/consultation'}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Book Free Consultation
            </button>
          </div>
        )}
        
        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              {!submitted ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">Get Your Full Report</h2>
                  <p className="mb-4 text-gray-600">
                    Enter your email to receive a detailed breakdown and savings recommendations.
                  </p>
                  <form onSubmit={handleSubmitEmail}>
                    {/* Honeypot field */}
                    <input
                      type="text"
                      name="honeypot"
                      style={{ display: 'none' }}
                      tabIndex="-1"
                      autoComplete="off"
                    />
                    
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Email address *"
                        required
                        value={emailForm.email}
                        onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Company name"
                        value={emailForm.companyName}
                        onChange={(e) => setEmailForm({...emailForm, companyName: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Your role"
                        value={emailForm.role}
                        onChange={(e) => setEmailForm({...emailForm, role: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowEmailModal(false)}
                        className="flex-1 px-4 py-2 border rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
                      >
                        {submitting ? 'Sending...' : 'Send Report'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Report Sent!</h3>
                  <p className="text-gray-600">Check your email for the full audit report.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}