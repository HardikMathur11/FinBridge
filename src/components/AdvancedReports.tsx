import React, { useState } from "react";
import { 
  ShieldAlert, 
  Smile, 
  TrendingUp, 
  Percent, 
  CheckCircle, 
  HelpCircle, 
  Briefcase, 
  BadgeCheck, 
  Sparkles,
  ArrowRightLeft
} from "lucide-react";
import { Asset } from "../types";

interface AdvancedReportsProps {
  assets: Asset[];
  targetRisk: "Conservative" | "Moderate" | "Aggressive";
}

export const AdvancedReports: React.FC<AdvancedReportsProps> = ({ assets, targetRisk }) => {
  const [activeReportTab, setActiveReportTab] = useState<"overlap" | "emotional" | "rebalance" | "tax">("overlap");
  
  // States for emotional simulation
  const [marketDipScenario, setMarketDipScenario] = useState<number>(15); // -15% market drop
  const [userCorrectionReaction, setUserCorrectionReaction] = useState<string>("hold"); // 'hold' | 'panic' | 'buy'

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);

  // 1. Cross Broker Overlaps Computation
  // Group same tickers across different brokers
  const tickerMap: Record<string, { brokers: string[]; totalVal: number; name: string }> = {};
  assets.forEach((a) => {
    if (a.ticker) {
      if (!tickerMap[a.ticker]) {
        tickerMap[a.ticker] = { brokers: [], totalVal: 0, name: a.name };
      }
      if (!tickerMap[a.ticker].brokers.includes(a.broker)) {
        tickerMap[a.ticker].brokers.push(a.broker);
      }
      tickerMap[a.ticker].totalVal += a.value;
    }
  });

  const overlappingTickers = Object.keys(tickerMap)
    .filter((tick) => tickerMap[tick].brokers.length > 1)
    .map((tick) => ({
      ticker: tick,
      name: tickerMap[tick].name,
      brokers: tickerMap[tick].brokers,
      value: tickerMap[tick].totalVal
    }));

  // 2. Ideal Allocations Based on Risk Plan
  const targetAllocations: Record<string, Record<string, number>> = {
    Conservative: { "Stocks": 30, "Mutual Funds": 40, "Cash Equivalents": 20, "Gold": 10, "Alternatives": 0 },
    Moderate: { "Stocks": 50, "Mutual Funds": 30, "Cash Equivalents": 10, "Gold": 5, "Alternatives": 5 },
    Aggressive: { "Stocks": 70, "Mutual Funds": 10, "Cash Equivalents": 5, "Gold": 5, "Alternatives": 10 }
  };

  const selectedTargetMap = targetAllocations[targetRisk];

  // Actual Asset class distributions
  const actualClassVal: Record<string, number> = {
    "Stocks": 0, "Mutual Funds": 0, "Cash Equivalents": 0, "Gold": 0, "Alternatives": 0
  };
  assets.forEach((a) => {
    if (actualClassVal[a.assetClass] !== undefined) {
      actualClassVal[a.assetClass] += a.value;
    } else {
      actualClassVal["Alternatives"] += a.value; // Fallback
    }
  });

  const rebalanceRows = Object.keys(selectedTargetMap).map((cat) => {
    const actualVal = actualClassVal[cat] || 0;
    const actualPct = totalValue > 0 ? (actualVal / totalValue) * 100 : 0;
    const targetPct = selectedTargetMap[cat];
    const targetVal = totalValue * (targetPct / 100);
    const deviationVal = targetVal - actualVal;

    return {
      category: cat,
      actualVal,
      actualPct,
      targetPct,
      targetVal,
      deviationVal
    };
  });

  // 3. Tax Loss Harvesting Opportunities
  const harvestablePositions = assets
    .filter((a) => a.value < a.costBasis)
    .map((a) => ({
      ...a,
      unrealizedLoss: a.costBasis - a.value,
      possibleTaxShield: (a.costBasis - a.value) * 0.25 // Assumed capital gain offset rate
    }))
    .sort((a, b) => b.unrealizedLoss - a.unrealizedLoss);

  const totalPossibleTaxShield = harvestablePositions.reduce((sum, p) => sum + p.possibleTaxShield, 0);

  // 4. Emotional Score computation
  const getEmotionalScore = () => {
    let score = 95; // Default Zen
    let title = "Zen Portfolio Custodian";
    let desc = "You exhibit optimal long-term behaviors. Portfolio is stable and holds diversified index buffers.";

    if (userCorrectionReaction === "panic") {
      score -= 35;
      title = "Reactive Reactor";
      desc = "Selling positions during market downturns locks in absolute losses. DCA outperforms panic-sellers by 3.2% CAGR annually.";
    } else if (userCorrectionReaction === "buy") {
      score = 100;
      title = "Opportunistic Value Accumulator";
      desc = "A drop of 15% is viewed as an accumulation window. Your cash positions (SPAXX) provide the dry powder required.";
    }

    const hasCrypto = assets.some(a => a.assetClass === "Alternatives" && a.sector === "Cryptocurrencies");
    if (hasCrypto && score > 90) {
      score -= 5; // crypto volatility deduction
      desc += " Slight emotional exposure to high-beta crypto swings.";
    }

    return { score, title, desc };
  };

  const emotionalScoreData = getEmotionalScore();

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col h-full animate-fadeIn" id="advanced-analytics-container">
      {/* Title block */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight font-display flex items-center gap-1.5">
            <BadgeCheck className="w-4.5 h-4.5 text-blue-600" />
            Fintech Intelligence Reports
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Advanced analytics hidden cleanly via progressive disclosure
          </p>
        </div>
      </div>

      {/* Internal Navigation Subtabs */}
      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 mb-5 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveReportTab("overlap")}
          className={`flex-1 text-center py-2 px-3.5 text-xs font-semibold rounded-lg transition-all ${
            activeReportTab === "overlap"
              ? "bg-white text-blue-600 shadow-xs border border-slate-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
          aria-pressed={activeReportTab === "overlap"}
        >
          Cross-Broker Risk
        </button>
        <button
          onClick={() => setActiveReportTab("rebalance")}
          className={`flex-1 text-center py-2 px-3.5 text-xs font-semibold rounded-lg transition-all ${
            activeReportTab === "rebalance"
              ? "bg-white text-blue-600 shadow-xs border border-slate-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
          aria-pressed={activeReportTab === "rebalance"}
        >
          Dynamic Rebalancer
        </button>
        <button
          onClick={() => setActiveReportTab("emotional")}
          className={`flex-1 text-center py-2 px-3.5 text-xs font-semibold rounded-lg transition-all ${
            activeReportTab === "emotional"
              ? "bg-white text-blue-600 shadow-xs border border-slate-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
          aria-pressed={activeReportTab === "emotional"}
        >
          Emotional Scorecard
        </button>
        <button
          onClick={() => setActiveReportTab("tax")}
          className={`flex-1 text-center py-2 px-3.5 text-xs font-semibold rounded-lg transition-all ${
            activeReportTab === "tax"
              ? "bg-white text-blue-600 shadow-xs border border-slate-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
          aria-pressed={activeReportTab === "tax"}
        >
          Tax Loss Harvesting
        </button>
      </div>

      {/* REPORT CONTENT BODY */}
      <div className="flex-1">
        
        {/* TAB 1: CROSS-BROKER OVERLAP */}
        {activeReportTab === "overlap" && (
          <div className="flex flex-col gap-4 animate-fadeIn" id="report-overlap">
            <div className="p-3.5 bg-blue-50/55 border border-blue-50 rounded-xl text-xs leading-relaxed">
              <strong className="text-blue-900 block font-bold mb-0.5">Overlap Analyzer</strong>
              Holding the identical security in multiple accounts makes portfolio weight evaluation harder. We scanned your Charles Schwab, Fidelity, Robinhood, and Groww positions for overlaps.
            </div>

            {overlappingTickers.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-150 rounded-xl bg-slate-50/20">
                <CheckCircle className="w-7 h-7 text-emerald-500 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-700 block">No Cross-Broker Overlaps</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Each of your stocks is clean and localized to a single broker.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Identified Overlapping Positions</div>
                {overlappingTickers.map((ov, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-3xs hover:border-slate-200 transition-colors">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-1.5 py-0.25 rounded-md">{ov.ticker}</span>
                        <strong className="text-xs font-bold text-slate-800">{ov.name}</strong>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Exposed in: <span className="font-semibold text-slate-600">{ov.brokers.join(", ")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-slate-800">${ov.value.toLocaleString()}</span>
                      <p className="text-[10px] text-rose-500 font-semibold mt-0.5 flex items-center gap-0.5 justify-end">
                        <ShieldAlert className="w-3 h-3" />
                        Spread Overlap Risk
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DYNAMIC REBALANCING CALCULATOR */}
        {activeReportTab === "rebalance" && (
          <div className="flex flex-col gap-4 animate-fadeIn" id="report-rebalance">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Portfolio Plan</span>
                <strong className="text-xs font-bold text-blue-700 uppercase tracking-tight">{targetRisk} Risk Strategy</strong>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
                AUTO CALC ACTIVE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2 px-1">Asset Class</th>
                    <th className="py-2 text-right">Actual %</th>
                    <th className="py-2 text-right">Target %</th>
                    <th className="py-2 text-right">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rebalanceRows.map((row) => {
                    const absDev = Math.abs(row.deviationVal);
                    const isOver = row.deviationVal < 0;

                    return (
                      <tr key={row.category} className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-bold text-slate-800">{row.category}</td>
                        <td className="py-2.5 text-right font-mono">{row.actualPct.toFixed(1)}%</td>
                        <td className="py-2.5 text-right font-mono text-slate-500">{row.targetPct}%</td>
                        <td className="py-2.5 text-right">
                          {absDev < totalValue * 0.02 ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Balanced</span>
                          ) : (
                            <div className="inline-flex flex-col items-end">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isOver ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                                {isOver ? `Sell ₹${Math.round(absDev).toLocaleString()}` : `Buy ₹${Math.round(absDev).toLocaleString()}`}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EMOTIONAL INVESTING SCORECARD */}
        {activeReportTab === "emotional" && (
          <div className="flex flex-col gap-4 animate-fadeIn" id="report-emotional">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-8">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Investment Behavior Persona</span>
                <strong className="text-sm font-bold text-slate-900 mt-1 block">{emotionalScoreData.title}</strong>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{emotionalScoreData.desc}</p>
              </div>
              <div className="sm:col-span-4 flex justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 bg-blue-50/10 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-xl font-black text-slate-800">{emotionalScoreData.score}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">IQ SCORE</span>
                </div>
              </div>
            </div>

            {/* Simulated Correction test */}
            <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/55 flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-200 pb-1.5">
                Stress Test Your Mental Discipline
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="dip-scenario-select" className="text-[10px] font-semibold text-slate-500 block mb-1">Simulated Stock Correction Dip</label>
                  <select
                    id="dip-scenario-select"
                    value={marketDipScenario}
                    onChange={(e) => setMarketDipScenario(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-medium focus:outline-hidden"
                  >
                    <option value={10}>-10% Minor Correction</option>
                    <option value={20}>-20% Bear Market Slide</option>
                    <option value={35}>-35% Systemic Financial Panic</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reaction-scenario-select" className="text-[10px] font-semibold text-slate-500 block mb-1">Your Emotional Action Reaction</label>
                  <select
                    id="reaction-scenario-select"
                    value={userCorrectionReaction}
                    onChange={(e) => setUserCorrectionReaction(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-bold text-blue-700 focus:outline-hidden"
                  >
                    <option value="hold">DCA & Hold Steady (Recommended)</option>
                    <option value="panic">Sell All Assets to Liquid Cash</option>
                    <option value="buy">Aggressively Buy the Valuation Dip</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TAX LOSS HARVESTING OPPORTUNITIES */}
        {activeReportTab === "tax" && (
          <div className="flex flex-col gap-4 animate-fadeIn" id="report-tax">
            <div className="p-3.5 bg-emerald-50/55 border border-emerald-50 rounded-xl flex justify-between items-center text-xs leading-relaxed">
              <div>
                <strong className="text-emerald-950 block font-bold mb-0.5">Tax Shields Harvest Available</strong>
                Realize losses to offset short-term capital gains tax. Maximize standard tax write-offs securely.
              </div>
              <div className="text-right pl-3 flex-shrink-0">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">EST SHIELD</span>
                <span className="font-mono text-sm font-extrabold text-emerald-700">${Math.round(totalPossibleTaxShield).toLocaleString()}</span>
              </div>
            </div>

            {harvestablePositions.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-150 rounded-xl bg-slate-50/10 text-slate-400 text-xs">
                All holdings are currently trading above cost basis. No harvest shields needed.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Eligible Positions for Selling</span>
                {harvestablePositions.slice(0, 3).map((p, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between text-xs font-sans">
                    <div>
                      <span className="font-bold text-slate-800">{p.name}</span>
                      <p className="text-[9px] text-slate-400 mt-0.5">{p.broker} • Cost: ${p.costBasis.toLocaleString()} • Value: ${p.value.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-rose-600 block font-bold">-${p.unrealizedLoss.toLocaleString()}</span>
                      <span className="text-[9px] text-emerald-600 font-semibold block">Shield: +${Math.round(p.possibleTaxShield)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
