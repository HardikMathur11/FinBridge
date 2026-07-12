import React, { useState } from "react";
import { 
  Building, 
  HelpCircle, 
  Sparkles, 
  ShieldAlert, 
  ChevronRight, 
  BookOpen, 
  Coins, 
  TrendingUp, 
  Percent, 
  Clock, 
  UserCheck 
} from "lucide-react";

interface Profile {
  age: string;
  income: string;
  horizon: string;
  riskAppetite: string;
  goal: string;
}

interface AlternateAsset {
  id: string;
  name: string;
  symbol: string;
  category: "REIT" | "InvIT" | "Bond" | "Gold";
  expectedYield: string;
  riskLevel: "Low" | "Moderate" | "Aggressive";
  description: string;
  taxation: string;
  liquidity: string;
  underlying: string;
}

const ALTERNATIVE_ASSETS: AlternateAsset[] = [
  {
    id: "embassy_reit",
    name: "Embassy Office Parks REIT",
    symbol: "EMBASSY.RR",
    category: "REIT",
    expectedYield: "7.8% Dividend Yield + 4-6% Capital Growth",
    riskLevel: "Moderate",
    description: "Real Estate Investment Trust owning premium commercial office spaces in Bangalore, Mumbai, Pune, and Noida, tenanted by blue-chip multinational corporations.",
    taxation: "Dividends are taxable at your individual slab rate. Interest components are also taxable. Long-term capital gains (LTCG) are taxed at 12.5% for holding periods longer than 36 months (exceeding ₹1.25L profits).",
    liquidity: "High. Traded on NSE & BSE like standard equities, allowing you to buy or sell instantly with no exit loads.",
    underlying: "Grade-A commercial office parks, including infrastructure like power plants and hotels located within the business parks."
  },
  {
    id: "pg_invit",
    name: "PowerGrid Infrastructure Investment Trust",
    symbol: "PGINVIT.RR",
    category: "InvIT",
    expectedYield: "8.5% Annual Cash Distribution",
    riskLevel: "Low",
    description: "Infrastructure Investment Trust sponsored by Power Grid Corp of India. Owns and operates critical inter-state power transmission networks.",
    taxation: "Cash distributions consist of dividend, interest, and capital repayment components. Interest is taxed at slab rates; dividend is generally tax-exempt or taxed depending on SPV tax status. LTCG is 12.5% after 36 months.",
    liquidity: "High. Daily trading on major secondary exchanges with stable trading volumes.",
    underlying: "Inter-state power transmission lines and grid substations with long-term (35-year) power transmission agreements."
  },
  {
    id: "nhai_bond",
    name: "NHAI 8.75% Tax-Free Bonds",
    symbol: "NHAIBONDS",
    category: "Bond",
    expectedYield: "5.75% Net Tax-Free Interest",
    riskLevel: "Low",
    description: "Secured, non-convertible tax-free bonds issued by the National Highways Authority of India (NHAI). Excellent fixed-income substitute for high-tax brackets.",
    taxation: "100% Tax-Free! Interest earned is completely exempt from income tax under Section 10(15)(iv)(h). No TDS is applicable, making it highly lucrative for individuals in the 30%+ tax slabs.",
    liquidity: "Moderate. Traded on the NSE/BSE debt segments, but trading volumes are lower, meaning sell orders can take time to execute at fair value.",
    underlying: "Federal highway development and national expressway corridor expansion projects."
  },
  {
    id: "sgb_gold",
    name: "Sovereign Gold Bonds (SGB)",
    symbol: "SGBGOLD",
    category: "Gold",
    expectedYield: "2.5% Fixed Interest + Gold Price Appreciation",
    riskLevel: "Low",
    description: "Government securities denominated in grams of gold. They are a substitute for holding physical gold, issued by the RBI on behalf of the Government.",
    taxation: "The 2.5% annual interest is taxed at your income slab. However, capital gains tax is 100% exempt if you hold the bond until maturity (8 years). If sold on secondary markets, LTCG applies.",
    liquidity: "Moderate. 8-year maturity with early redemption options at RBI from year 5. Also tradeable on exchanges (often at a discount to spot gold prices).",
    underlying: "Sovereign guarantee linked directly to the market price of 999 purity gold."
  }
];

export const AlternateAssetsDiscovery: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    age: "20-35",
    income: "5L-15L",
    horizon: "3-7",
    riskAppetite: "Moderate",
    goal: "Growth"
  });

  const [isProfileSubmitted, setIsProfileSubmitted] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<AlternateAsset | null>(null);

  // Dynamic Match Score Engine
  const calculateMatch = (asset: AlternateAsset): { score: number; reason: string; fit: "High Fit" | "Moderate Fit" | "Low Fit" } => {
    let score = 80; // base score
    let reasons: string[] = [];

    // Horizon check
    if (profile.horizon === "under-3") {
      if (asset.category === "Gold" || asset.category === "REIT") {
        score -= 25;
        reasons.push("Real estate and gold require longer holding periods to buffer volatility.");
      } else if (asset.category === "Bond") {
        score += 15;
        reasons.push("Fixed-coupon bonds provide stable yield alignment for short timelines.");
      }
    } else if (profile.horizon === "7plus") {
      if (asset.category === "REIT" || asset.category === "Gold") {
        score += 15;
        reasons.push("Long term aligns perfectly with compounding property rentals and gold price cycles.");
      }
    }

    // Risk alignment
    if (profile.riskAppetite === "Conservative") {
      if (asset.riskLevel === "Aggressive") {
        score -= 30;
        reasons.push("Asset risk profile exceeds your conservative risk tolerance.");
      } else if (asset.riskLevel === "Low") {
        score += 15;
        reasons.push("Sovereign and government backing matches your capital protection goal.");
      }
    } else if (profile.riskAppetite === "Aggressive") {
      if (asset.category === "Bond" || asset.category === "InvIT") {
        score -= 15;
        reasons.push("Fixed interest yields may underperform your aggressive capital growth target.");
      } else if (asset.category === "REIT") {
        score += 10;
        reasons.push("Commercial real estate offers equity-like growth upside.");
      }
    }

    // Goal matching
    if (profile.goal === "Income") {
      if (asset.category === "REIT" || asset.category === "InvIT") {
        score += 20;
        reasons.push("High cash distribution frequency matches your desire for regular cash payouts.");
      } else if (asset.category === "Gold") {
        score -= 20;
        reasons.push("Gold does not pay active rental dividends, only nominal interest.");
      }
    } else if (profile.goal === "TaxSaving") {
      if (asset.category === "Bond" && asset.id === "nhai_bond") {
        score += 25;
        reasons.push("100% tax-free interest payouts eliminate tax drags entirely.");
      } else if (asset.category === "Gold") {
        score += 15;
        reasons.push("Exemption of capital gains tax at maturity enhances post-tax yields.");
      }
    }

    // Cap score boundaries
    const finalScore = Math.max(20, Math.min(99, score));
    let fit: "High Fit" | "Moderate Fit" | "Low Fit" = "Moderate Fit";
    if (finalScore >= 85) fit = "High Fit";
    else if (finalScore < 60) fit = "Low Fit";

    const reasonSummary = reasons.length > 0 
      ? reasons[0] 
      : "Provides balanced income and asset class diversification matching your profile.";

    return { score: finalScore, reason: reasonSummary, fit };
  };

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-md flex flex-col h-full animate-fadeIn" id="discovery-center-workspace">
      
      {/* Brand Header */}
      <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight font-display flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Suitability-First Alternate Asset Discovery
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            SEBI-compliant educational screener matching your profile with Indian REITs, InvITs, and Bonds.
          </p>
        </div>
        <span className="text-[9px] bg-blue-50 text-blue-800 border border-blue-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Regulation 2013 Educational Screener
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: SUITABILITY PROFILER */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-150 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Investor Suitability Profiler</h4>
          </div>

          <div className="flex flex-col gap-3.5 text-xs font-sans">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Age Bracket</label>
              <select
                value={profile.age}
                onChange={(e) => handleProfileChange("age", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="20-35">Young Investor (20 - 35)</option>
                <option value="36-50">Mid-Career (36 - 50)</option>
                <option value="50plus">Retirement-Focused (50+)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Annual Income Bracket</label>
              <select
                value={profile.income}
                onChange={(e) => handleProfileChange("income", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="under-5L">Under ₹5 Lakhs</option>
                <option value="5L-15L">₹5 Lakhs - ₹15 Lakhs</option>
                <option value="15L-30L">₹15 Lakhs - ₹30 Lakhs</option>
                <option value="30Lplus">Over ₹30 Lakhs (Highest Bracket)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Investment Horizon</label>
              <select
                value={profile.horizon}
                onChange={(e) => handleProfileChange("horizon", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="under-3">Short-Term (&lt; 3 years)</option>
                <option value="3-7">Medium-Term (3 - 7 years)</option>
                <option value="7plus">Long-Term (7+ years)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Risk Tolerance Appetite</label>
              <select
                value={profile.riskAppetite}
                onChange={(e) => handleProfileChange("riskAppetite", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="Conservative">Conservative (Capital Shield)</option>
                <option value="Moderate">Moderate (Balanced Yield)</option>
                <option value="Aggressive">Aggressive (Maximum Returns)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Primary Goal Target</label>
              <select
                value={profile.goal}
                onChange={(e) => handleProfileChange("goal", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="Income">Stable Payouts / Rental Yield</option>
                <option value="Growth">Capital Appreciation</option>
                <option value="TaxSaving">Maximize Post-Tax Yields</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setIsProfileSubmitted(true);
              setSelectedAsset(null);
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Calculate Suitability Matches
          </button>
        </div>

        {/* RIGHT COLUMN: DISCOVERED ALTERNATIVE ASSETS CATALOGUE */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {!isProfileSubmitted ? (
            <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30 flex flex-col items-center justify-center p-6">
              <Building className="w-12 h-12 text-slate-300 stroke-[1.5] mb-3" />
              <strong className="text-sm font-bold text-slate-700 block">Awaiting Suitability Profile</strong>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Fill in your profile parameters in the Suitability Profiler on the left to discover matched REITs, InvITs, SGBs, and Bonds.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex justify-between items-center bg-blue-50/50 border border-blue-50/60 rounded-xl p-3 text-xs text-blue-900 leading-normal">
                <span>
                  <strong>Profile Score Match Active:</strong> Assets are rated and explanations structured for a <strong>{profile.riskAppetite}</strong> profile with a <strong>{profile.horizon} Year</strong> horizon.
                </span>
              </div>

              {/* Asset Catalog Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ALTERNATIVE_ASSETS.map((asset) => {
                  const matchResult = calculateMatch(asset);
                  
                  let badgeColor = "bg-rose-50 text-rose-700 border-rose-100";
                  if (matchResult.fit === "High Fit") badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  else if (matchResult.fit === "Moderate Fit") badgeColor = "bg-amber-50 text-amber-700 border-amber-100";

                  return (
                    <div 
                      key={asset.id} 
                      onClick={() => setSelectedAsset(asset)}
                      className={`p-4 border rounded-2xl flex flex-col justify-between cursor-pointer transition-all shadow-3xs hover:shadow-2xs ${
                        selectedAsset?.id === asset.id 
                          ? "border-blue-500 bg-blue-50/10 ring-2 ring-blue-100" 
                          : "border-slate-150 hover:border-slate-350 bg-white"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            {asset.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                            {matchResult.score}% Match
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 tracking-tight block">{asset.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">{asset.symbol}</span>
                      </div>

                      <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Est. Return</span>
                          <span className="text-xs font-bold text-slate-700 font-mono">{asset.expectedYield.split(" ")[0]}</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-0.5">
                          View details <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Asset Details Sheet */}
              {selectedAsset && (
                <div className="bg-slate-50/55 border border-slate-150 rounded-2xl p-5 flex flex-col gap-4 animate-fadeIn">
                  {(() => {
                    const matchResult = calculateMatch(selectedAsset);
                    return (
                      <>
                        <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                              {selectedAsset.category} • {selectedAsset.riskLevel} Risk
                            </span>
                            <h4 className="text-base font-bold text-slate-900 mt-2 font-display">
                              {selectedAsset.name} ({selectedAsset.symbol})
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Suitability Fit</span>
                            <span className="text-lg font-black text-blue-600 font-mono">{matchResult.score}%</span>
                          </div>
                        </div>

                        {/* Suitability explanation block */}
                        <div className="p-3 bg-blue-50/40 border-l-4 border-blue-500 rounded-r-xl">
                          <strong className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider block">Suitability-First Match Explanation:</strong>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5">
                            {matchResult.reason}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans mt-1">
                          <div className="p-3 bg-white border border-slate-100 rounded-xl">
                            <strong className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Concept Description</strong>
                            <p className="text-slate-600 leading-relaxed font-normal">{selectedAsset.description}</p>
                          </div>

                          <div className="p-3 bg-white border border-slate-100 rounded-xl">
                            <strong className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Underlying Projects & Assets</strong>
                            <p className="text-slate-600 leading-relaxed font-normal">{selectedAsset.underlying}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                          <div className="p-3 bg-white border border-slate-100 rounded-xl">
                            <strong className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Indian Taxation Analysis</strong>
                            <p className="text-slate-600 leading-relaxed font-normal">{selectedAsset.taxation}</p>
                          </div>

                          <div className="p-3 bg-white border border-slate-100 rounded-xl">
                            <strong className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Liquidity & Exit Details</strong>
                            <p className="text-slate-600 leading-relaxed font-normal">{selectedAsset.liquidity}</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
