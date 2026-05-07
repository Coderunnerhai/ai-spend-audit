// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Zap, TrendingDown, Share2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop Overpaying for AI Tools
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get a free AI spend audit and discover hidden savings in minutes. 
            Most startups save $247/month on average.
          </p>
          <button
      onClick={() => navigate('/audit')}
      className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700"
    >
      Start My Audit →
    </button>
        </div>
        
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900">30s</div>
            <p className="text-gray-600">Average audit time</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <TrendingDown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900">$247</div>
            <p className="text-gray-600">Average monthly savings</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Share2 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900">8+</div>
            <p className="text-gray-600">AI tools analyzed</p>
          </div>
        </div>
        
        {/* Tools Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold mb-6">We analyze all major AI tools</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Cursor', 'Copilot', 'Claude', 'ChatGPT', 'Gemini', 'Windsurf', 'API Access'].map(tool => (
              <span key={tool} className="px-4 py-2 bg-white rounded-full shadow-sm text-gray-700">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}