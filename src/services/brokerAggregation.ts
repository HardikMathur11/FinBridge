import { Asset, ConnectedBroker } from "../types";

export interface BrokerMeta {
  id: string;
  name: string;
  logoCode: string;
  color: string;
  description: string;
}

export const SUPPORTED_BROKERS: BrokerMeta[] = [
  {
    id: "zerodha",
    name: "Zerodha",
    logoCode: "zerodha",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    description: "Kite platform, India's largest discount broker."
  },
  {
    id: "groww",
    name: "Groww",
    logoCode: "groww",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    description: "Intuitive zero-maintenance investing application."
  },
  {
    id: "upstox",
    name: "Upstox",
    logoCode: "upstox",
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    description: "Pro-level high-performance trading platform."
  },
  {
    id: "angel",
    name: "Angel One",
    logoCode: "angel",
    color: "bg-orange-50 text-orange-600 border-orange-200",
    description: "Full-service trusted digital investment advisor."
  },
  {
    id: "icici",
    name: "ICICI Direct",
    logoCode: "icici",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    description: "Premium banking integrated trading portal."
  },
  {
    id: "hdfc",
    name: "HDFC Sky",
    logoCode: "hdfc",
    color: "bg-sky-50 text-sky-600 border-sky-200",
    description: "One-tap multi-asset bank-backed brokerage."
  },
  {
    id: "kotak",
    name: "Kotak Securities",
    logoCode: "kotak",
    color: "bg-red-50 text-red-600 border-red-200",
    description: "Established institutional and retail broker."
  }
];

// Sample modular holdings data by broker
export const SAMPLE_HOLDINGS_BY_BROKER: Record<string, Asset[]> = {
  zerodha: [
    {
      id: "z1",
      name: "Reliance Industries Ltd.",
      ticker: "RELIANCE",
      assetClass: "Stocks",
      value: 12400,
      costBasis: 10500,
      change24h: 1.82,
      sector: "Energy & Conglomerate",
      broker: "Zerodha"
    },
    {
      id: "z2",
      name: "HDFC Bank Ltd.",
      ticker: "HDFCBANK",
      assetClass: "Stocks",
      value: 9800,
      costBasis: 9200,
      change24h: -0.45,
      sector: "Financials",
      broker: "Zerodha"
    },
    {
      id: "z3",
      name: "Vanguard S&P 500 ETF",
      ticker: "VOO",
      assetClass: "Stocks",
      value: 18500,
      costBasis: 15200,
      change24h: 0.85,
      sector: "Diversified Index",
      broker: "Zerodha"
    }
  ],
  groww: [
    {
      id: "gr1",
      name: "Tata Consultancy Services",
      ticker: "TCS",
      assetClass: "Stocks",
      value: 8500,
      costBasis: 8000,
      change24h: 0.54,
      sector: "Technology",
      broker: "Groww"
    },
    {
      id: "gr2",
      name: "Parag Parikh Flexi Cap Fund",
      ticker: "PPFCF",
      assetClass: "Mutual Funds",
      value: 14200,
      costBasis: 12000,
      change24h: 1.15,
      sector: "Diversified Equity",
      broker: "Groww"
    }
  ],
  upstox: [
    {
      id: "up1",
      name: "Infosys Ltd.",
      ticker: "INFY",
      assetClass: "Stocks",
      value: 6200,
      costBasis: 5900,
      change24h: -1.24,
      sector: "Technology",
      broker: "Upstox"
    },
    {
      id: "up2",
      name: "Sovereign Gold Bond Series",
      ticker: "SGBGOLD",
      assetClass: "Gold",
      value: 7500,
      costBasis: 7500,
      change24h: 0.0,
      sector: "Commodities & Precious Metals",
      broker: "Upstox"
    }
  ],
  angel: [
    {
      id: "an1",
      name: "Larsen & Toubro Ltd.",
      ticker: "LT",
      assetClass: "Stocks",
      value: 5400,
      costBasis: 4800,
      change24h: 2.1,
      sector: "Infrastructure",
      broker: "Angel One"
    },
    {
      id: "an2",
      name: "ICICI Prudential Bluechip Fund",
      ticker: "ICICIBLUE",
      assetClass: "Mutual Funds",
      value: 9500,
      costBasis: 8500,
      change24h: 0.32,
      sector: "Diversified Bluechip",
      broker: "Angel One"
    }
  ],
  icici: [
    {
      id: "ic1",
      name: "State Bank of India",
      ticker: "SBIN",
      assetClass: "Stocks",
      value: 4800,
      costBasis: 4500,
      change24h: 0.95,
      sector: "Financials",
      broker: "ICICI Direct"
    },
    {
      id: "ic2",
      name: "Axis Midcap Direct Fund",
      ticker: "AXISMID",
      assetClass: "Mutual Funds",
      value: 11000,
      costBasis: 9800,
      change24h: 1.4,
      sector: "Mid Cap Equity",
      broker: "ICICI Direct"
    }
  ],
  hdfc: [
    {
      id: "hd1",
      name: "HDFC Top 100 Fund",
      ticker: "HDFCTOP",
      assetClass: "Mutual Funds",
      value: 8200,
      costBasis: 7500,
      change24h: 0.12,
      sector: "Large Cap Equity",
      broker: "HDFC Sky"
    },
    {
      id: "hd2",
      name: "Liquid Treasury Direct Cash",
      ticker: "CASH_HDFC",
      assetClass: "Cash Equivalents",
      value: 5000,
      costBasis: 5000,
      change24h: 0.01,
      sector: "Liquid Cash equivalents",
      broker: "HDFC Sky"
    }
  ],
  kotak: [
    {
      id: "ko1",
      name: "Kotak Mahindra Bank",
      ticker: "KOTAKBANK",
      assetClass: "Stocks",
      value: 6500,
      costBasis: 6800,
      change24h: -0.65,
      sector: "Financials",
      broker: "Kotak Securities"
    },
    {
      id: "ko2",
      name: "Kotak Gold ETF",
      ticker: "KOTAKGOLD",
      assetClass: "Gold",
      value: 4000,
      costBasis: 3600,
      change24h: 0.58,
      sector: "Commodities & Precious Metals",
      broker: "Kotak Securities"
    }
  ]
};

/**
 * Account Discovery Engine interface abstraction layer.
 * Simulates the secure API discovery flow linked with user credentials (email/phone)
 * upon receiving explicit consent.
 */
export class BrokerAggregationService {
  /**
   * Discovers linked accounts automatically based on consent & credentials
   * Runs an asynchronous scan mapping to UPI-like bank account aggregation.
   */
  static async autoDiscoverLinkedBrokers(
    userPhoneOrEmail: string,
    consentApproved: boolean
  ): Promise<{ discovered: ConnectedBroker[]; assets: Asset[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!consentApproved || !userPhoneOrEmail) {
          resolve({ discovered: [], assets: [] });
          return;
        }

        // Standard auto-discovery resolves Zerodha, Groww, and Upstox as immediately found
        // if the user has a normal sandbox profile. ICICI and others can be linked manually.
        const defaultDiscoveredIds = ["zerodha", "groww", "upstox"];
        const discovered: ConnectedBroker[] = [];
        const assets: Asset[] = [];

        SUPPORTED_BROKERS.forEach((b) => {
          if (defaultDiscoveredIds.includes(b.id)) {
            const brokerAssets = SAMPLE_HOLDINGS_BY_BROKER[b.id] || [];
            const totalValue = brokerAssets.reduce((sum, a) => sum + a.value, 0);

            discovered.push({
              id: b.id,
              name: b.name,
              logoCode: b.logoCode,
              status: "connected",
              lastSyncTime: new Date().toLocaleTimeString(),
              linkedAccountsCount: 1,
              holdingsValue: totalValue
            });

            assets.push(...brokerAssets);
          }
        });

        resolve({ discovered, assets });
      }, 1500); // 1.5s scanning animation delay
    });
  }

  /**
   * Synchronizes an individual broker connection
   */
  static async syncBroker(brokerId: string, currentAssets: Asset[]): Promise<{ status: "connected" | "error"; lastSyncTime: string; updatedAssets: Asset[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find existing holdings for this broker
        const brokerMeta = SUPPORTED_BROKERS.find((b) => b.id === brokerId);
        if (!brokerMeta) {
          resolve({ status: "error", lastSyncTime: new Date().toLocaleTimeString(), updatedAssets: currentAssets });
          return;
        }

        const brokerName = brokerMeta.name;
        // Regenerate or update holdings with minor 24h market fluctuations
        const sampleBase = SAMPLE_HOLDINGS_BY_BROKER[brokerId] || [];
        const updatedBrokerAssets = sampleBase.map((asset) => {
          const delta24h = (Math.random() * 4 - 2); // Random daily change -2% to +2%
          const newValue = Math.round(asset.value * (1 + delta24h / 100));
          return {
            ...asset,
            change24h: Number(delta24h.toFixed(2)),
            value: newValue
          };
        });

        // Filter out old positions for this broker and append updated ones
        const filtered = currentAssets.filter((a) => a.broker !== brokerName);
        const nextAssets = [...filtered, ...updatedBrokerAssets];

        resolve({
          status: "connected",
          lastSyncTime: new Date().toLocaleTimeString(),
          updatedAssets: nextAssets
        });
      }, 1000);
    });
  }

  /**
   * Manually adds/links a broker account if automatic discovery was missed
   */
  static async manuallyLinkBroker(brokerId: string, currentAssets: Asset[]): Promise<{ connectedBroker: ConnectedBroker; updatedAssets: Asset[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const b = SUPPORTED_BROKERS.find((item) => item.id === brokerId);
        if (!b) {
          throw new Error("Invalid broker selection");
        }

        const brokerAssets = SAMPLE_HOLDINGS_BY_BROKER[b.id] || [];
        const totalValue = brokerAssets.reduce((sum, a) => sum + a.value, 0);

        const connectedBroker: ConnectedBroker = {
          id: b.id,
          name: b.name,
          logoCode: b.logoCode,
          status: "connected",
          lastSyncTime: new Date().toLocaleTimeString(),
          linkedAccountsCount: 1,
          holdingsValue: totalValue
        };

        const updatedAssets = [...currentAssets, ...brokerAssets];
        resolve({ connectedBroker, updatedAssets });
      }, 800);
    });
  }
}
