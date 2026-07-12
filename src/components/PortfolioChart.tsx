import React, { useState, useEffect, useRef } from "react";
import { Asset } from "../types";

interface PortfolioChartProps {
  assets: Asset[];
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ assets }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 350, height: 300 });
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"allocation" | "sector">("allocation");

  // Dynamically track sizes
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      // Keep it responsive but bounded
      setDimensions({
        width: Math.max(280, width),
        height: 260
      });
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const totalVal = assets.reduce((sum, a) => sum + a.value, 0);

  // Group by Asset Class
  const classGroups: Record<string, number> = {};
  assets.forEach((a) => {
    classGroups[a.assetClass] = (classGroups[a.assetClass] || 0) + a.value;
  });

  const classData = Object.keys(classGroups).map((key) => ({
    name: key,
    value: classGroups[key],
    percentage: totalVal > 0 ? (classGroups[key] / totalVal) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  // Group by Sector
  const sectorGroups: Record<string, number> = {};
  assets.forEach((a) => {
    const sec = a.sector || "Unassigned";
    sectorGroups[sec] = (sectorGroups[sec] || 0) + a.value;
  });

  const sectorData = Object.keys(sectorGroups).map((key) => ({
    name: key,
    value: sectorGroups[key],
    percentage: totalVal > 0 ? (sectorGroups[key] / totalVal) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  // Palette map
  const colorPalette: Record<string, string> = {
    "Stocks": "#2563eb", // Primary Professional Blue
    "Mutual Funds": "#06b6d4", // Light Blue/Cyan
    "Cash Equivalents": "#10b981", // Green
    "Gold": "#f59e0b", // Gold / Amber
    "Alternatives": "#8b5cf6", // Purple
    // Sectors
    "Technology": "#3b82f6",
    "Financials": "#0f172a",
    "Healthcare": "#ec4899",
    "Energy & Conglomerate": "#f59e0b",
    "Fixed Income": "#64748b",
    "Diversified Index": "#10b981",
    "Diversified Balanced": "#14b8a6",
    "Commodities & Precious Metals": "#eab308",
    "Cryptocurrencies": "#8b5cf6",
    "Liquid Cash equivalents": "#22c55e",
    "Default": "#cbd5e1"
  };

  const getSlices = () => {
    let accumulatedPercent = 0;
    const radius = 70;
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

    return classData.map((slice, index) => {
      const percentage = slice.percentage;
      const startAngle = (accumulatedPercent / 100) * 360 - 90;
      accumulatedPercent += percentage;
      const endAngle = (accumulatedPercent / 100) * 360 - 90;

      // Radian conversion
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArcFlag = percentage > 50 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const color = colorPalette[slice.name] || colorPalette["Default"];

      return {
        ...slice,
        pathData,
        color,
        index
      };
    });
  };

  const slices = getSlices();

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col h-full">
      <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
        <h3 className="font-semibold text-slate-800 text-sm tracking-tight flex items-center gap-1.5 font-display">
          Portfolio Allocation Metrics
        </h3>
        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
          <button
            onClick={() => setActiveTab("allocation")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "allocation"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
            aria-pressed={activeTab === "allocation"}
          >
            Asset Class
          </button>
          <button
            onClick={() => setActiveTab("sector")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "sector"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
            aria-pressed={activeTab === "sector"}
          >
            Sectors
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 flex flex-col justify-center min-h-[220px] relative">
        {activeTab === "allocation" ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Pie Chart SVG Area */}
            <div className="md:col-span-7 flex justify-center relative">
              <svg 
                width={dimensions.width} 
                height={dimensions.height}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                className="overflow-visible"
                role="img"
                aria-label="Interactive Asset Allocation Donut Chart"
              >
                {slices.map((slice) => {
                  const isHovered = hoveredSlice === slice.name;
                  return (
                    <g key={slice.name}>
                      <path
                        d={slice.pathData}
                        fill={slice.color}
                        opacity={hoveredSlice && !isHovered ? 0.35 : 1}
                        className="cursor-pointer transition-all duration-200"
                        stroke="#ffffff"
                        strokeWidth={isHovered ? 3 : 1.5}
                        transform={isHovered ? "scale(1.05)" : "scale(1)"}
                        style={{ transformOrigin: `${dimensions.width / 2}px ${dimensions.height / 2}px` }}
                        onMouseEnter={() => setHoveredSlice(slice.name)}
                        onMouseLeave={() => setHoveredSlice(null)}
                        tabIndex={0}
                        aria-label={`${slice.name}: ₹${slice.value.toLocaleString()} (${slice.percentage.toFixed(1)}%)`}
                        onFocus={() => setHoveredSlice(slice.name)}
                        onBlur={() => setHoveredSlice(null)}
                      />
                    </g>
                  );
                })}

                {/* Donut Mask Center circle */}
                <circle
                  cx={dimensions.width / 2}
                  cy={dimensions.height / 2}
                  r="45"
                  fill="#ffffff"
                />

                {/* Core Total Portfolio Text */}
                <text
                  x={dimensions.width / 2}
                  y={dimensions.height / 2 - 4}
                  textAnchor="middle"
                  className="fill-slate-400 font-medium font-sans"
                  style={{ fontSize: "10px", letterSpacing: "0.05em" }}
                >
                  TOTAL PORTFOLIO
                </text>
                <text
                  x={dimensions.width / 2}
                  y={dimensions.height / 2 + 15}
                  textAnchor="middle"
                  className="fill-slate-800 font-bold font-display"
                  style={{ fontSize: "16px" }}
                >
                  ₹{totalVal.toLocaleString()}
                </text>
              </svg>

              {/* Float Tooltip Details */}
              {hoveredSlice && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center bg-slate-900 text-white rounded-lg px-2.5 py-1.5 shadow-md border border-slate-800 text-[11px] font-sans z-10 w-28">
                  <div className="font-semibold truncate">{hoveredSlice}</div>
                  <div className="font-mono text-emerald-400">
                    ₹{classGroups[hoveredSlice]?.toLocaleString()}
                  </div>
                  <div className="text-slate-400">
                    {((classGroups[hoveredSlice] / (totalVal || 1)) * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>

            {/* Grid interactive Legend */}
            <div className="md:col-span-5 flex flex-col gap-2.5">
              {classData.map((slice) => {
                const color = colorPalette[slice.name] || colorPalette["Default"];
                const isHovered = hoveredSlice === slice.name;
                return (
                  <button
                    key={slice.name}
                    onMouseEnter={() => setHoveredSlice(slice.name)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => setHoveredSlice(isHovered ? null : slice.name)}
                    className={`flex items-center justify-between text-left p-1.5 rounded-lg border transition-all ${
                      isHovered 
                        ? "bg-slate-50 border-slate-200 shadow-xs" 
                        : "border-transparent hover:bg-slate-50/55"
                    }`}
                    aria-label={`Highlight ${slice.name}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-3.5 h-3.5 rounded-md flex-shrink-0" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-semibold text-slate-700 font-sans truncate">
                        {slice.name}
                      </span>
                    </div>
                    <div className="text-right font-mono text-xs pl-2">
                      <span className="font-bold text-slate-800">
                        {slice.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Sector Exposure Horizontal Bar chart with clean bars */
          <div className="flex flex-col gap-3 py-2 px-1 max-h-[220px] overflow-y-auto pr-2">
            {sectorData.map((sec) => {
              const color = colorPalette[sec.name] || colorPalette[sec.name.split(" ")[0]] || colorPalette["Default"];
              return (
                <div key={sec.name} className="group flex flex-col gap-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-semibold text-slate-700 truncate max-w-[190px] font-sans">
                      {sec.name}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      ₹{sec.value.toLocaleString()} ({sec.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative" aria-hidden="true">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${sec.percentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
