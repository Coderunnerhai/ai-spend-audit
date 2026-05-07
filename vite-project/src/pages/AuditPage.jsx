// frontend/src/pages/AuditPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ToolForm from '../components/ToolForm';
import { TOOLS } from '../constants/tools';

export default function AuditPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tools: {},
    teamSize: 1,
    primaryUseCase: 'coding'
  });
  const [loading, setLoading] = useState(false);

  // Load saved form data from localStorage
  // In AuditPage.jsx, update the initialTools initialization
useEffect(() => {
  const saved = localStorage.getItem('auditFormData');
  if (saved) {
    setFormData(JSON.parse(saved));
  } else {
    // Initialize tools with test values for easier testing
    const initialTools = {};
    TOOLS.forEach(tool => {
      initialTools[tool.id] = {
        enabled: tool.id === 'cursor', // Enable Cursor by default for testing
        plan: tool.id === 'cursor' ? 'Pro' : tool.plans[0],
        monthlySpend: tool.id === 'cursor' ? 40 : 0, // $40/month for Cursor
        seats: 1
      };
    });
    setFormData({ 
      tools: initialTools, 
      teamSize: 1, 
      primaryUseCase: 'coding' 
    });
  }
}, []);

  // Save to localStorage on change
  useEffect(() => {
    if (formData.tools && Object.keys(formData.tools).length > 0) {
      localStorage.setItem('auditFormData', JSON.stringify(formData));
    }
  }, [formData]);

  const handleToolChange = (toolId, field, value) => {
    setFormData(prev => ({
      ...prev,
      tools: {
        ...prev.tools,
        [toolId]: {
          ...prev.tools[toolId],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Filter out disabled tools before sending
    const enabledTools = {};
    Object.keys(formData.tools).forEach(toolId => {
      if (formData.tools[toolId].enabled) {
        enabledTools[toolId] = formData.tools[toolId];
      }
    });
    
    const payload = {
      ...formData,
      tools: enabledTools
    };
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      console.log('API_URL being used:', API_URL);
console.log('Full URL:', `${API_URL}/api/audit/create`);

const response = await axios.post(`${API_URL}/api/audit/create`, {
        formData: payload
      });
      
      if (response.data.success) {
        sessionStorage.setItem('auditResults', JSON.stringify(response.data.auditResult));
        sessionStorage.setItem('shareableId', response.data.shareableId);
        navigate('/results');
      }
    } catch (error) {
      console.error('Error creating audit:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!formData.tools || Object.keys(formData.tools).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">AI Spend Audit</h1>
        <p className="text-center text-gray-600 mb-8">
          Tell us what AI tools you're using and we'll find savings opportunities
        </p>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Team Size</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Primary Use Case</label>
            <select
              value={formData.primaryUseCase}
              onChange={(e) => setFormData({ ...formData, primaryUseCase: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="coding">Coding / Development</option>
              <option value="writing">Writing / Content</option>
              <option value="data">Data Analysis</option>
              <option value="research">Research</option>
              <option value="mixed">Mixed / General</option>
            </select>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">AI Tools You Use</h2>
            {TOOLS.map(tool => (
              <ToolForm
                key={tool.id}
                tool={tool}
                data={formData.tools[tool.id] || {
                  enabled: false,
                  plan: tool.plans[0],
                  monthlySpend: 0,
                  seats: 1
                }}
                onChange={(field, value) => handleToolChange(tool.id, field, value)}
              />
            ))}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Run Audit →'}
          </button>
        </form>
      </div>
    </div>
  );
}