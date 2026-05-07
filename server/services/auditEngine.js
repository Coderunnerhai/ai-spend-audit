// backend/services/auditEngine.js
import { TOOL_CONFIGS } from '../config/pricingData.js';

export function auditEngine(formData) {
  const recommendations = [];
  let totalMonthlySavings = 0;
  
  for (const [toolName, toolData] of Object.entries(formData.tools)) {
    if (!toolData.enabled) continue;
    
    const config = TOOL_CONFIGS[toolName];
    const currentPlan = toolData.plan;
    const currentSpend = toolData.monthlySpend;
    const seats = toolData.seats || 1;
    
    let recommendedAction = null;
    let potentialSavings = 0;
    let reason = '';
    
    // Logic for each tool
    switch(toolName) {
      case 'cursor':
        if (currentPlan === 'business' && seats < 20) {
          recommendedAction = 'Switch to Pro plan';
          potentialSavings = (40 * seats) - (20 * seats);
          reason = `Business plan requires minimum 20 seats. With ${seats} seats, Pro plan saves $${potentialSavings}/month.`;
        }
        break;
        
      case 'copilot':
        if (currentPlan === 'business' && seats < 10) {
          recommendedAction = 'Switch to Individual plan';
          potentialSavings = (19 * seats) - (10 * seats);
          reason = `Business plan at $19/seat is overkill for ${seats} seats. Individual at $10/seat saves $${
            (19 - 10) * seats
          }/month.`;
        }
        break;
        
      case 'claude':
        if (currentPlan === 'team' && seats < 5) {
          recommendedAction = 'Switch to Pro plan';
          potentialSavings = currentSpend - (20 * seats);
          reason = `Team plan at $30/seat requires minimum 5 seats. Pro at $20/seat saves $${potentialSavings}/month.`;
        } else if (currentPlan === 'pro' && formData.primaryUseCase === 'coding') {
          recommendedAction = 'Consider API access';
          potentialSavings = currentSpend * 0.3;
          reason = `For coding tasks, API access is often 30% cheaper than Pro subscription.`;
        }
        break;
        
      case 'chatgpt':
        if (currentPlan === 'team' && seats < 3) {
          recommendedAction = 'Downgrade to Plus';
          potentialSavings = currentSpend - (20 * seats);
          reason = `Team plan at $30/seat is for 3+ users. Plus at $20/seat saves $${potentialSavings}/month.`;
        }
        break;
        
      case 'anthropic-api':
        if (currentSpend > 100 && formData.teamSize > 5) {
          recommendedAction = 'Switch to Claude Team plan';
          const teamCost = 30 * formData.teamSize;
          if (teamCost < currentSpend) {
            potentialSavings = currentSpend - teamCost;
            reason = `With ${formData.teamSize} users and $${currentSpend}/month API spend, Team plan at $${teamCost}/month saves $${potentialSavings}/month.`;
          }
        }
        break;
        
      case 'openai-api':
        if (currentSpend > 200 && formData.primaryUseCase === 'coding') {
          const alternativeCost = currentSpend * 0.7;
          potentialSavings = currentSpend - alternativeCost;
          recommendedAction = 'Consider Claude API for coding';
          reason = `For coding tasks, Claude API is often 30% cheaper and has better code understanding.`;
        }
        break;
        
      default:
        // Generic optimization for other tools
        if (currentSpend > 500 && formData.teamSize > 10) {
          recommendedAction = 'Contact Credex for enterprise pricing';
          potentialSavings = currentSpend * 0.2;
          reason = `Enterprise volume discounts through Credex could save ~20% on your $${currentSpend}/month spend.`;
        }
    }
    
    if (recommendedAction && potentialSavings > 0) {
      recommendations.push({
        tool: toolName,
        toolDisplayName: TOOL_CONFIGS[toolName]?.name || toolName,
        currentPlan,
        currentSpend,
        recommendedAction,
        potentialSavings,
        reason
      });
      totalMonthlySavings += potentialSavings;
    }
  }
  
  const totalAnnualSavings = totalMonthlySavings * 12;
  const isHighSavings = totalMonthlySavings > 500;
  const isOptimal = recommendations.length === 0 || totalMonthlySavings < 100;
  
  // Fallback summary
  let summary = '';
  if (isOptimal) {
    summary = `Great news! Your current AI setup is well-optimized. With $${totalMonthlySavings}/month in potential optimizations, you're spending efficiently. We'll monitor for new savings opportunities as the AI landscape evolves.`;
  } else if (isHighSavings) {
    summary = `You're leaving $${totalMonthlySavings}/month on the table! Your team could save $${totalAnnualSavings}/year by optimizing ${recommendations.length} tools. Credex can help you capture these savings through discounted enterprise credits.`;
  } else {
    summary = `We found ${recommendations.length} optimization opportunities that could save you $${totalMonthlySavings}/month ($${totalAnnualSavings}/year). These small changes add up to meaningful savings for your startup.`;
  }
  
  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    isHighSavings,
    isOptimal,
    summary
  };
}