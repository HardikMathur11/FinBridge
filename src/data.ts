import { Asset, Goal } from "./types";

export const DEFAULT_ASSETS: Asset[] = [
  {
    id: "a1",
    name: "Apple Inc.",
    ticker: "AAPL",
    assetClass: "Stocks",
    value: 18500,
    costBasis: 14000,
    change24h: 1.45,
    sector: "Technology",
    broker: "Charles Schwab"
  },
  {
    id: "a2",
    name: "Microsoft Corp.",
    ticker: "MSFT",
    assetClass: "Stocks",
    value: 22400,
    costBasis: 18500,
    change24h: -0.82,
    sector: "Technology",
    broker: "Charles Schwab"
  },
  {
    id: "a3",
    name: "NVIDIA Corp.",
    ticker: "NVDA",
    assetClass: "Stocks",
    value: 15600,
    costBasis: 8200,
    change24h: 3.12,
    sector: "Technology",
    broker: "Robinhood"
  },
  {
    id: "a4",
    name: "Vanguard S&P 500 ETF",
    ticker: "VOO",
    assetClass: "Stocks",
    value: 31200,
    costBasis: 27000,
    change24h: 0.25,
    sector: "Diversified Index",
    broker: "Charles Schwab"
  },
  {
    id: "a5",
    name: "Vanguard Total Bond Market",
    ticker: "BND",
    assetClass: "Mutual Funds",
    value: 12500,
    costBasis: 13000,
    change24h: -0.15,
    sector: "Fixed Income",
    broker: "Fidelity"
  },
  {
    id: "a6",
    name: "Fidelity Balanced Fund",
    ticker: "FBALX",
    assetClass: "Mutual Funds",
    value: 18000,
    costBasis: 16500,
    change24h: 0.18,
    sector: "Diversified Balanced",
    broker: "Fidelity"
  },
  {
    id: "a7",
    name: "Reliance Industries Ltd.",
    ticker: "RELIANCE",
    assetClass: "Stocks",
    value: 8200,
    costBasis: 7000,
    change24h: 1.89,
    sector: "Energy & Conglomerate",
    broker: "Groww"
  },
  {
    id: "a8",
    name: "HDFC Bank Ltd.",
    ticker: "HDFCBANK",
    assetClass: "Stocks",
    value: 6400,
    costBasis: 5800,
    change24h: -1.05,
    sector: "Financials",
    broker: "Groww"
  },
  {
    id: "a9",
    name: "Fidelity Core Treasury High-Yield Savings",
    ticker: "SPAXX",
    assetClass: "Cash Equivalents",
    value: 15000,
    costBasis: 15000,
    change24h: 0.01,
    sector: "Liquid Cash equivalents",
    broker: "Fidelity"
  },
  {
    id: "a10",
    name: "SPDR Gold Shares ETF",
    ticker: "GLD",
    assetClass: "Gold",
    value: 9500,
    costBasis: 8100,
    change24h: 0.64,
    sector: "Commodities & Precious Metals",
    broker: "Charles Schwab"
  },
  {
    id: "a11",
    name: "Bitcoin",
    ticker: "BTC",
    assetClass: "Alternatives",
    value: 5800,
    costBasis: 4500,
    change24h: -4.15,
    sector: "Cryptocurrencies",
    broker: "Robinhood"
  }
];

export const DEFAULT_GOALS: Goal[] = [
  {
    id: "g1",
    name: "Retirement Reserve",
    targetAmount: 1500000,
    currentAmount: 245000,
    deadlineYears: 25,
    category: "retirement"
  },
  {
    id: "g2",
    name: "House Purchase Downpayment",
    targetAmount: 100000,
    currentAmount: 15000,
    deadlineYears: 3,
    category: "house"
  },
  {
    id: "g3",
    name: "Emergency Reserve Fund",
    targetAmount: 30000,
    currentAmount: 20000,
    deadlineYears: 1,
    category: "general"
  }
];
