import React, { useState } from "react";
import { Info } from "lucide-react";

interface MetricCardProps {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  tooltipText?: string;
  colorType?: "blue" | "green" | "red" | "amber" | "slate";
  sparklineData?: number[];
  isLoading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  trend,
  tooltipText,
  colorType = "slate",
  sparklineData = [30, 45, 35, 50, 40, 60, 55, 70],
  isLoading = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (isLoading) {
    return (
      <div 
        id={`${id}-skeleton`}
        className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs animate-pulse"
        role="status"
        aria-label={`Loading ${title}`}
      >
        <div className="h-4 w-24 bg-slate-100 rounded-sm mb-3"></div>
        <div className="h-8 w-36 bg-slate-200 rounded-sm mb-2"></div>
        <div className="h-3 w-48 bg-slate-100 rounded-sm"></div>
      </div>
    );
  }

  // Set colors based on type
  const colorMap = {
    blue: "border-blue-100 bg-gradient-to-br from-white to-blue-50/20 text-blue-600",
    green: "border-emerald-100 bg-gradient-to-br from-white to-emerald-50/20 text-emerald-600",
    red: "border-rose-100 bg-gradient-to-br from-white to-rose-50/20 text-rose-600",
    amber: "border-amber-100 bg-gradient-to-br from-white to-amber-50/20 text-amber-600",
    slate: "border-slate-100 bg-white text-slate-700"
  };

  // Sparkline computation
  const svgWidth = 80;
  const svgHeight = 24;
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  const points = sparklineData
    .map((val, index) => {
      const x = (index / (sparklineData.length - 1)) * svgWidth;
      const y = svgHeight - 2 - ((val - min) / range) * (svgHeight - 4);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      id={id}
      className={`border rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-slate-200 relative group ${colorMap[colorType]}`}
      tabIndex={0}
      aria-label={`${title}: ${value} ${subtitle || ""}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans">
          {title}
        </span>
        
        {tooltipText && (
          <div className="relative">
            <button
              id={`${id}-info-btn`}
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-400 rounded-full"
              aria-label={`About ${title}`}
              aria-expanded={showTooltip}
            >
              <Info className="w-4 h-4" />
            </button>
            {showTooltip && (
              <div 
                id={`${id}-tooltip`}
                className="absolute z-20 bottom-full right-0 mb-2 w-64 bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-lg leading-relaxed border border-slate-800 transition-opacity duration-150"
                role="tooltip"
              >
                {tooltipText}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight font-display">
            {value}
          </span>
          
          {(trend || subtitle) && (
            <div className="flex items-center gap-1.5 mt-1">
              {trend && (
                <span 
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded-md font-mono ${
                    trend.isPositive 
                      ? "text-emerald-700 bg-emerald-50" 
                      : "text-rose-700 bg-rose-50"
                  }`}
                  aria-label={trend.isPositive ? "Upward trend" : "Downward trend"}
                >
                  {trend.value}
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-slate-500 font-sans">{subtitle}</span>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Sparkline SVG */}
        {!isLoading && sparklineData && (
          <div className="h-6 w-20 flex items-center" aria-hidden="true">
            <svg width={svgWidth} height={svgHeight} className="overflow-visible">
              <path
                d={`M ${points}`}
                fill="none"
                stroke={
                  trend 
                    ? trend.isPositive ? "#10b981" : "#f43f5e" 
                    : colorType === "blue" ? "#3b82f6" : "#64748b"
                }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
