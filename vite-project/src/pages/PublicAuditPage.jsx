// frontend/src/pages/PublicAuditPage.jsx - Without Helmet
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Share2, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

export default function PublicAuditPage() {
  const { shareableId } = useParams();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shareableId) {
      fetchAudit();
    }
  }, [shareableId]);

  const fetchAudit = async () => {
    try {
      setLoading(true);
      console.log('Fetching audit with ID:', shareableId);
      
      const response = await axios.get(`${API_BASE_URL}/api/audit/${shareableId}`);
      console.log('Response:', response.data);
      
      if (response.data.success) {
        setAudit(response.data.audit);
      } else {
        setError('Audit not found');
      }
    } catch (error) {
      console.error('Error details:', error);
      if (error.response) {
        setError(`Error ${error.response.status}: ${error.response.data?.error || 'Audit not found'}`);
      } else {
        setError('Cannot connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading audit results...</div>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Audit Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This audit may have expired or doesn\'t exist.'}</p>
          <Link to="/" className="text-purple-600 hover:underline">
            Run a new audit →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} /> New Audit
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1 border rounded-lg hover:bg-gray-100"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
        
        {/* Savings Hero */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white p-8 mb-8 text-center">
          <h1 className="text-2xl font-bold mb-4">AI Spend Audit Results</h1>
          <div className="text-5xl font-bold mb-2">
            ${audit.totalMonthlySavings}/month
          </div>
          <div className="text-xl mb-4">Potential Savings Found</div>
          <div className="text-2xl font-semibold">
            ${audit.totalAnnualSavings}/year
          </div>
        </div>
        
        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3">Analysis</h2>
          <p className="text-gray-700">{audit.summary}</p>
        </div>
        
        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          {audit.recommendations && audit.recommendations.length > 0 ? (
            <div className="space-y-4">
              {audit.recommendations.map((rec, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 pl-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{rec.toolDisplayName || rec.tool}</h3>
                    <div className="text-green-600 font-bold">${rec.potentialSavings}/month</div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {rec.recommendedAction}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{rec.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-green-600 text-5xl mb-3">✓</div>
              <h3 className="text-xl font-semibold mb-2">No optimizations needed!</h3>
              <p className="text-gray-600">Your AI tool setup is already well-optimized.</p>
            </div>
          )}
        </div>
        
        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            to="/audit"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Run Your Own Free Audit →
          </Link>
        </div>
      </div>
    </div>
  );
}