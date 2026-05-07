// backend/config/pricingData.js
export const TOOL_CONFIGS = {
  cursor: {
    name: 'Cursor',
    plans: {
      hobby: { price: 0, seats: 1 },
      pro: { price: 20, seats: 1 },
      business: { price: 40, minSeats: 20 }
    }
  },
  copilot: {
    name: 'GitHub Copilot',
    plans: {
      individual: { price: 10, seats: 1 },
      business: { price: 19, minSeats: 1 },
      enterprise: { price: 39, minSeats: 10 }
    }
  },
  claude: {
    name: 'Claude',
    plans: {
      free: { price: 0, seats: 1 },
      pro: { price: 20, seats: 1 },
      max: { price: 30, seats: 1 },
      team: { price: 30, minSeats: 5 },
      enterprise: { price: 'custom', minSeats: 10 }
    }
  },
  chatgpt: {
    name: 'ChatGPT',
    plans: {
      plus: { price: 20, seats: 1 },
      team: { price: 30, minSeats: 3 },
      enterprise: { price: 'custom', minSeats: 10 }
    }
  },
  'anthropic-api': {
    name: 'Anthropic API',
    type: 'api',
    pricing: 'usage-based'
  },
  'openai-api': {
    name: 'OpenAI API',
    type: 'api',
    pricing: 'usage-based'
  },
  gemini: {
    name: 'Gemini',
    plans: {
      pro: { price: 0, seats: 1 },
      ultra: { price: 20, seats: 1 }
    }
  },
  windsurf: {
    name: 'Windsurf',
    plans: {
      free: { price: 0, seats: 1 },
      pro: { price: 15, seats: 1 }
    }
  }
};