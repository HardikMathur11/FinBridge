export interface Asset {
  id: string;
  name: string;
  ticker?: string;
  assetClass: "Stocks" | "Mutual Funds" | "Cash Equivalents" | "Gold" | "Alternatives";
  value: number;
  costBasis: number;
  shares?: number;
  price?: number;
  change24h: number; // e.g. +1.2 or -3.4
  sector: string; // e.g. Technology, Financials, Healthcare, Consumer Cyclical, Energy, Alternatives
  broker: "Zerodha" | "Groww" | "Upstox" | "Angel One" | "ICICI Direct" | "HDFC Sky" | "Kotak Securities" | "Charles Schwab" | "Fidelity" | "Robinhood" | "Manual Entry" | string;
}

export interface ConnectedBroker {
  id: string;
  name: string;
  logoCode: string; // 'zerodha' | 'groww' | 'upstox' | 'angel' | 'icici' | 'hdfc' | 'kotak' | 'schwab' | 'fidelity' | 'robinhood'
  status: "connected" | "disconnected" | "syncing" | "error";
  lastSyncTime?: string;
  linkedAccountsCount: number;
  holdingsValue: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadlineYears: number;
  category: "retirement" | "house" | "general";
}

export interface AIInsight {
  category: string; // 'allocation' | 'risk' | 'tax' | 'cost'
  title: string;
  description: string;
  impact: "positive" | "neutral" | "negative";
  actionableTip: string;
}

export interface AIAlert {
  type: "warning" | "info" | "success";
  title: string;
  message: string;
}

export interface AISectorSuggestion {
  sector: string;
  suggestion: string;
  action: "reduce" | "maintain" | "increase";
}

export interface AnalysisResponse {
  diversificationScore: number;
  financialHealthScore: number;
  healthExplanation: string;
  insights: AIInsight[];
  alerts: AIAlert[];
  goalProgressAnalysis: string;
  sectorSuggestions: AISectorSuggestion[];
  _aiFailed?: boolean;
  _error?: string;
}

