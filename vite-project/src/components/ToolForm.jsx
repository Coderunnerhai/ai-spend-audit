// frontend/src/components/ToolForm.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, Users, DollarSign } from 'lucide-react';

export default function ToolForm({ tool, data, onChange }) {
  const [expanded, setExpanded] = useState(false);
  
  const safeData = data || {
    enabled: false,
    plan: tool?.plans?.[0] || '',
    monthlySpend: 0,
    seats: 1
  };
  
  const handleSpendChange = (e) => {
    const value = e.target.value;
    // Remove leading zeros and convert to number
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      onChange('monthlySpend', 0);
    } else {
      onChange('monthlySpend', numValue);
    }
  };
  
  const handleSeatsChange = (e) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) {
      onChange('seats', 1);
    } else {
      onChange('seats', numValue);
    }
  };
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={safeData.enabled || false}
            onChange={(e) => onChange('enabled', e.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="font-semibold text-lg">{tool?.name || 'Tool'}</span>
          {safeData.enabled && !expanded && (
            <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded">
              Click ▼ to enter spend
            </span>
          )}
        </div>
        {safeData.enabled && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-purple-600 transition"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>
      
      {expanded && safeData.enabled && (
        <div className="mt-4 space-y-3 ml-8 p-4 bg-gray-50 rounded-lg">
          {/* Plan Selection */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Settings size={14} /> Plan
            </label>
            <select
              value={safeData.plan || tool?.plans?.[0] || ''}
              onChange={(e) => onChange('plan', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {tool?.plans?.map(plan => (
                <option key={plan} value={plan}>{plan}</option>
              ))}
            </select>
          </div>
          
          {/* Monthly Spend - FIXED */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <DollarSign size={14} /> Monthly Spend ($)
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={safeData.monthlySpend || 0}
              onChange={handleSpendChange}
              placeholder="Enter amount e.g., 40"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: 40 (for $40/month)
            </p>
          </div>
          
          {/* Number of Seats - FIXED */}
          {tool?.hasSeats && (
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Users size={14} /> Number of Seats
              </label>
              <input
                type="number"
                min="1"
                value={safeData.seats || 1}
                onChange={handleSeatsChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}