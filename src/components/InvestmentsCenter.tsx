import React, { useState } from "react";
import { TrendingUp, PieChart, LayoutGrid, Check, HelpCircle, Sparkles } from "lucide-react";
import { Asset } from "../types";

interface InvestmentsCenterProps {
  assets: Asset[];
  onAddPositionClick?: () => void;
}

export const InvestmentsCenter: React.FC<InvestmentsCenterProps> = ({ assets, onAddPositionClick }) => {
  const [allocationFilter, setAllocationFilter] = useState<string>("All");

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);

  // Group by sector
  const sectorsMap: Record<string, number> = {};
  assets.forEach((a) => {
    const sec = a.sector || "Unassigned";
    sectorsMap[sec] = (sectorsMap[sec] || 0) + a.value;
  });

  const sectorsList = Object.keys(sectorsMap).map((sec) => ({
    name: sec,
    value: sectorsMap[sec],
    percentage: totalValue > 0 ? (sectorsMap[sec] / totalValue) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  // Group by asset class
  const classMap: Record<string, number> = {};
  assets.forEach((a) => {
    classMap[a.assetClass] = (classMap[a.assetClass] || 0) + a.value;
  });

  const classList = Object.keys(classMap).map((cls) => ({
    name: cls,
    value: classMap[cls],
    percentage: totalValue > 0 ? (classMap[cls] / totalValue) * 100 : 0
  }));

  const filteredAssets = allocationFilter === "All"
    ? assets
    : assets.filter((a) => a.assetClass === allocationFilter);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col h-full animate-fadeIn" id="investments-center-container">
      {/* Tab Title */}
      <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight font-display flex items-center gap-2">
            <LayoutGrid className="w-4.5 h-4.5 text-blue-600" />
            Strategic Asset Heatmap & Sector Matrix
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Visual representations of portfolio weighting and macro sector distributions
          </p>
        </div>

        {onAddPositionClick && (
          <button
            onClick={onAddPositionClick}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            + Quick Add Holding
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Visual Treemap Heatmap */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Asset Weight Heatmap (Block size = Portfolio Value)
            </span>
            <select
              value={allocationFilter}
              onChange={(e) => setAllocationFilter(e.target.value)}
              className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-1 px-2 focus:outline-hidden"
            >
              <option value="All">All Asset Classes</option>
              <option value="Stocks">Stocks Only</option>
              <option value="Mutual Funds">Mutual Funds</option>
              <option value="Cash Equivalents">Cash Equivalents</option>
              <option value="Gold">Precious Metals</option>
            </select>
          </div>

          {/* Treemap Simulated Blocks Container */}
          <div className="grid grid-cols-12 gap-2 min-h-[260px] select-none">
            {filteredAssets.length === 0 ? (
              <div className="col-span-12 flex flex-col items-center justify-center border border-dashed border-slate-150 rounded-xl bg-slate-50 text-slate-400 text-xs">
                No matching asset class holdings.
              </div>
            ) : (
              filteredAssets.map((a, index) => {
                const wt = totalValue > 0 ? a.value / totalValue : 0;
                // Calculate grid column span based on weight
                let colSpan = 3;
                if (wt > 0.35) colSpan = 6;
                else if (wt > 0.15) colSpan = 4;
                else if (wt < 0.05) colSpan = 2;

                // Color based on asset class
                let bgClass = "bg-blue-50/70 text-blue-800 border-blue-100 hover:bg-blue-50 hover:border-blue-200";
                if (a.assetClass === "Mutual Funds") bgClass = "bg-indigo-50/70 text-indigo-800 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200";
                if (a.assetClass === "Cash Equivalents") bgClass = "bg-emerald-50/70 text-emerald-800 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200";
                if (a.assetClass === "Gold") bgClass = "bg-amber-50/70 text-amber-800 border-amber-100 hover:bg-amber-50 hover:border-amber-200";

                return (
                  <div
                    key={a.id || index}
                    style={{ gridColumn: `span ${colSpan}` }}
                    className={`p-3 border rounded-xl flex flex-col justify-between transition-all cursor-pointer shadow-3xs hover:shadow-2xs ${bgClass}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold tracking-tight">{a.ticker || "FUND"}</span>
                        <span className="text-[8px] font-bold opacity-75">{a.broker}</span>
                      </div>
                      <h4 className="text-[11px] font-bold truncate mt-1 leading-tight">{a.name}</h4>
                    </div>
                    <div className="mt-3">
                      <span className="text-[10px] font-black font-mono block">₹{a.value.toLocaleString()}</span>
                      <span className="text-[8px] font-semibold opacity-75 block mt-0.5">{(wt * 100).toFixed(1)}% weight</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Sector Distribution Matrix */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Macro Sector Breakdown
          </span>

          <div className="flex flex-col gap-2">
            {sectorsList.map((sec) => (
              <div key={sec.name} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">{sec.name}</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-800">₹{sec.value.toLocaleString()}</span>
                    <span className="text-[10px] font-semibold text-slate-400 ml-1.5">({sec.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                {/* Visual percentage loader */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${sec.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick diversification tip */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-blue-950 font-bold block">Macro Sector Insight</strong>
              <p className="text-slate-700 leading-relaxed mt-0.5">
                Maintaining sector exposure under **35%** preserves resilience against cyclic corrections in specific market segments (like Technology).
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
