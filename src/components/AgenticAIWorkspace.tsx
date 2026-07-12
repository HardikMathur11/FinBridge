import React, { useState, useEffect } from "react";
import { 
  BrainCircuit, 
  Target, 
  RotateCcw, 
  Play, 
  Pause, 
  ShieldCheck, 
  Terminal, 
  ArrowUpRight, 
  Activity, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  Info,
  DollarSign
} from "lucide-react";
import { Asset } from "../types";

interface AgenticAIWorkspaceProps {
  assets: Asset[];
  onUpdateAssets: (newAssets: Asset[]) => void;
  targetRisk: "Conservative" | "Moderate" | "Aggressive";
  onTriggerAnalysis: (updatedAssets: Asset[]) => void;
}

interface AgentLog {
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARNING";
  message: string;
}

interface GuardrailTask {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
  frequency: string;
}

export const AgenticAIWorkspace: React.FC<AgenticAIWorkspaceProps> = ({
  assets,
  onUpdateAssets,
  targetRisk,
  onTriggerAnalysis
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"rebalancer" | "taxHarvest" | "guardrails">("rebalancer");
  const [isRebalancing, setIsRebalancing] = useState<boolean>(false);
  const [rebalanceStep, setRebalanceStep] = useState<number>(0);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [isTaxHarvesting, setIsTaxHarvesting] = useState<boolean>(false);
  const [taxHarvestStep, setTaxHarvestStep] = useState<number>(0);
  const [showLogs, setShowLogs] = useState<boolean>(true);

  // Guardrail tasks state
  const [guardrails, setGuardrails] = useState<GuardrailTask[]>([
    {
      id: "guardrail_1",
      name: "Technology Sector Overexposure Guard",
      trigger: "Technology sector exceeds 35% portfolio weighting",
      action: "Automatically generate rebalancing alert and route 5% to Cash equivalents",
      isActive: true,
      frequency: "Every 24h"
    },
    {
      id: "guardrail_2",
      name: "Tactical Gold Buy-on-Dip Sweeper",
      trigger: "Gold index falls more than 4% in 48 hours",
      action: "Auto-sweep ₹40,000 from liquid cash reserves into Sovereign Gold Mutual Funds",
      isActive: true,
      frequency: "Continuous (Real-time)"
    },
    {
      id: "guardrail_3",
      name: "Systematic Expense Ratio Optimizer",
      trigger: "Mutual Fund expense ratio exceeds 1.75%",
      action: "Scan passive index-based substitutes and trigger automated swap suggestion",
      isActive: false,
      frequency: "Monthly Audit"
    }
  ]);

  const [newRulePrompt, setNewRulePrompt] = useState<string>("");
  const [isCreatingRule, setIsCreatingRule] = useState<boolean>(false);

  // Helper function to append log line
  const addLog = (message: string, level: "INFO" | "SUCCESS" | "WARNING" = "INFO") => {
    const time = new Date().toLocaleTimeString();
    setAgentLogs(prev => [...prev, { timestamp: time, level, message }]);
  };

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);

  // Target allocations based on selected risk profile
  const getTargetAllocation = (risk: "Conservative" | "Moderate" | "Aggressive") => {
    switch (risk) {
      case "Conservative":
        return { "Stocks": 0.30, "Mutual Funds": 0.20, "Cash Equivalents": 0.35, "Gold": 0.15, "Alternatives": 0.0 };
      case "Moderate":
        return { "Stocks": 0.50, "Mutual Funds": 0.20, "Cash Equivalents": 0.20, "Gold": 0.10, "Alternatives": 0.0 };
      case "Aggressive":
        return { "Stocks": 0.75, "Mutual Funds": 0.10, "Cash Equivalents": 0.05, "Gold": 0.10, "Alternatives": 0.0 };
    }
  };

  const targets = getTargetAllocation(targetRisk);

  // Current allocations
  const currentAllocationValues = {
    "Stocks": 0,
    "Mutual Funds": 0,
    "Cash Equivalents": 0,
    "Gold": 0,
    "Alternatives": 0
  };

  assets.forEach(a => {
    if (a.assetClass in currentAllocationValues) {
      currentAllocationValues[a.assetClass as keyof typeof currentAllocationValues] += a.value;
    }
  });

  const currentAllocationPct = {
    "Stocks": totalValue > 0 ? currentAllocationValues["Stocks"] / totalValue : 0,
    "Mutual Funds": totalValue > 0 ? currentAllocationValues["Mutual Funds"] / totalValue : 0,
    "Cash Equivalents": totalValue > 0 ? currentAllocationValues["Cash Equivalents"] / totalValue : 0,
    "Gold": totalValue > 0 ? currentAllocationValues["Gold"] / totalValue : 0,
    "Alternatives": totalValue > 0 ? currentAllocationValues["Alternatives"] / totalValue : 0
  };

  // Calculate trade deviations
  const requiredAdjustments = Object.keys(targets).map(key => {
    const assetClass = key as keyof typeof targets;
    const targetPct = targets[assetClass];
    const currentPct = currentAllocationPct[assetClass];
    const targetVal = totalValue * targetPct;
    const currentVal = currentAllocationValues[assetClass];
    const deviationVal = targetVal - currentVal; // Positive: Buy, Negative: Sell
    const deviationPct = (targetPct - currentPct) * 100;

    return {
      assetClass,
      targetPct,
      currentPct,
      targetVal,
      currentVal,
      deviationVal,
      deviationPct
    };
  }).filter(adj => Math.abs(adj.deviationVal) > 50); // Only show adjustments greater than ₹50

  // 1. Trigger Rebalancer Agent Loop
  const handleStartRebalanceAgent = async () => {
    if (assets.length === 0) return;
    setIsRebalancing(true);
    setRebalanceStep(1);
    setAgentLogs([]);

    addLog(`Agentic Portfolio Rebalancer initialized. Core profile active: ${targetRisk}.`, "INFO");
    addLog("Analyzing current demographic weight deviation against target benchmarks...", "INFO");

    const steps = [
      {
        message: "Initiating multi-demat registry link scan for transaction validation...",
        level: "INFO" as const,
        ms: 1000
      },
      {
        message: `Calculated total deviations: ${requiredAdjustments.map(a => `${a.assetClass}: ${a.deviationVal >= 0 ? 'BUY' : 'SELL'} ₹${Math.abs(Math.round(a.deviationVal))}`).join(", ")}`,
        level: "INFO" as const,
        ms: 1200
      },
      {
        message: "Securing read-only terminal handshakes with Zerodha Kite, Groww and Upstox...",
        level: "INFO" as const,
        ms: 1000
      },
      {
        message: "Simulating market execution: Routing trade requests via optimal block routers...",
        level: "INFO" as const,
        ms: 1200
      },
      {
        message: "Trades successfully executed on market gateways. Adjusting demat registry balances...",
        level: "SUCCESS" as const,
        ms: 1200
      },
      {
        message: "Rebalance operations finalized. All asset classes brought to target parameters. Refreshing system metrics...",
        level: "SUCCESS" as const,
        ms: 1000
      }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].ms));
      setRebalanceStep(i + 2);
      addLog(steps[i].message, steps[i].level);
    }

    // ACTUALLY ADJUST THE ASSETS
    // Distribute value according to the target percentages
    const adjustedAssets = assets.map(a => {
      // Find what proportion of its own asset class this asset holds
      const classTotal = currentAllocationValues[a.assetClass] || 1;
      const assetShareInClass = a.value / classTotal;
      const targetClassVal = totalValue * targets[a.assetClass];
      const targetValForAsset = targetClassVal * assetShareInClass;

      return {
        ...a,
        value: Math.round(targetValForAsset),
        costBasis: Math.round(targetValForAsset * 0.92) // Adjust cost basis slightly to match
      };
    });

    onUpdateAssets(adjustedAssets);
    onTriggerAnalysis(adjustedAssets);
    setIsRebalancing(false);
  };

  // 2. Trigger Tax Harvesting Agent Loop
  const taxLossHoldings = assets.filter(a => a.value < a.costBasis);
  const totalLossToHarvest = taxLossHoldings.reduce((sum, a) => sum + (a.costBasis - a.value), 0);
  const taxSavingsEstimate = totalLossToHarvest * 0.15; // Assuming 15% capital gains tax rate

  const handleStartTaxHarvestAgent = async () => {
    if (taxLossHoldings.length === 0) return;
    setIsTaxHarvesting(true);
    setTaxHarvestStep(1);
    setAgentLogs([]);

    addLog(`Tax-Loss Harvesting Agent active. Target loss: ₹${totalLossToHarvest.toLocaleString()}`, "INFO");
    addLog("Scanning portfolio for underperforming holdings below acquired cost basis...", "INFO");

    const steps = [
      {
        message: `Identified ${taxLossHoldings.length} holdings eligible for capital loss booking: ${taxLossHoldings.map(h => h.name).join(", ")}`,
        level: "WARNING" as const,
        ms: 1200
      },
      {
        message: "Locating identical tracker index funds & low-cost liquid alternatives for instant capital swap...",
        level: "INFO" as const,
        ms: 1000
      },
      {
        message: "Simulating sell execution on loss-making positions to lock-in capital loss offsets...",
        level: "INFO" as const,
        ms: 1200
      },
      {
        message: "Simulating auto-buy into low-cost substitute ETF track products (preventing market wash-sale violations)...",
        level: "INFO" as const,
        ms: 1200
      },
      {
        message: `Capital losses booked. Verified tax deduction estimate of ₹${Math.round(taxSavingsEstimate).toLocaleString()} logged into current fiscal cycle.`,
        level: "SUCCESS" as const,
        ms: 1000
      }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].ms));
      setTaxHarvestStep(i + 2);
      addLog(steps[i].message, steps[i].level);
    }

    // ACTUALLY ADJUST THE HARVESTED ASSETS
    // Update assets so their cost basis is reset to the current value, booking the loss, and simulate cost basis = value
    const harvestedAssets = assets.map(a => {
      if (a.value < a.costBasis) {
        return {
          ...a,
          costBasis: a.value, // reset cost basis to lock-in tax harvest loss
          name: a.name.includes("Swap") ? a.name : `${a.name} (Harvested Index Swap)`
        };
      }
      return a;
    });

    onUpdateAssets(harvestedAssets);
    onTriggerAnalysis(harvestedAssets);
    setIsTaxHarvesting(false);
  };

  // Create a custom natural language rule
  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRulePrompt.trim()) return;

    setIsCreatingRule(true);
    setTimeout(() => {
      const generatedRule: GuardrailTask = {
        id: "guardrail_" + Date.now(),
        name: `NLP Autonomous Guardrail (${newRulePrompt.slice(0, 24)}...)`,
        trigger: newRulePrompt,
        action: "Continuously audit telemetry and trigger automatic asset-rebalancer execution draft",
        isActive: true,
        frequency: "Continuous (Real-time)"
      };

      setGuardrails(prev => [...prev, generatedRule]);
      setNewRulePrompt("");
      setIsCreatingRule(false);
      addLog(`New NLP-driven guardrail agent deployed successfully: "${generatedRule.name}"`, "SUCCESS");
    }, 1200);
  };

  const toggleGuardrail = (id: string) => {
    setGuardrails(prev => prev.map(g => {
      if (g.id === id) {
        addLog(`Guardrail "${g.name}" turned ${!g.isActive ? 'ON (Armed)' : 'OFF (Disarmed)'}.`, !g.isActive ? "SUCCESS" : "WARNING");
        return { ...g, isActive: !g.isActive };
      }
      return g;
    }));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col h-full animate-fadeIn" id="agentic-ai-workspace">
      
      {/* Title block */}
      <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 bg-blue-100 rounded-lg text-blue-700">
              <BrainCircuit className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight font-display">
              Autonomous AI Agent Workspace
            </h3>
            <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
              <Activity className="w-2.5 h-2.5" /> AGENTS LIVE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Configure, deploy, and monitor self-acting agents that audit, balance, and tax-harvest portfolios instantly.
          </p>
        </div>

        {/* Workspace Quick Stats */}
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[9px] text-slate-400 font-bold uppercase block">Armed Audits</span>
            <span className="font-mono font-extrabold text-slate-800 block">
              {guardrails.filter(g => g.isActive).length} Active Loops
            </span>
          </div>
          <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[9px] text-slate-400 font-bold uppercase block">Pending Saving Swap</span>
            <span className="font-mono font-extrabold text-blue-600 block">
              ₹{Math.round(taxSavingsEstimate).toLocaleString()} Potential
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu inside Workspace */}
      <div className="flex gap-2 border-b border-slate-100 pb-3 mb-5 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("rebalancer")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === "rebalancer"
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Target className="w-3.5 h-3.5" /> Rebalance Agent
        </button>
        <button
          onClick={() => setActiveSubTab("taxHarvest")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === "taxHarvest"
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" /> Tax Harvesting Bot
        </button>
        <button
          onClick={() => setActiveSubTab("guardrails")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === "guardrails"
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Smart Autopilot Guardrails
        </button>
      </div>

      {/* SUB-TAB CONTENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 min-h-0">
        
        {/* LEFT COMPONENT COLUMN */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* A. REBALANCER AGENT PANEL */}
          {activeSubTab === "rebalancer" && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              
              <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-blue-900 block font-bold">Autonomous Allocation Alignment</strong>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    This agent evaluates the deviation between your current holdings and the <strong className="text-blue-700">{targetRisk} Risk Profile</strong>. It will perform bulk purchases and liquidation swaps automatically upon activation.
                  </p>
                </div>
              </div>

              {/* Allocation comparison grids */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3.5 text-xs">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Asset Allocation Alignment Matrix</h4>
                
                <div className="space-y-3">
                  {Object.keys(targets).map((key) => {
                    const cls = key as keyof typeof targets;
                    const targetVal = targets[cls];
                    const currentVal = currentAllocationPct[cls];
                    const deviation = (currentVal - targetVal) * 100;

                    return (
                      <div key={cls} className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-700">{cls}</span>
                          <span className="text-slate-500 font-mono">
                            Current: <strong className="text-slate-800">{(currentVal * 100).toFixed(0)}%</strong> vs. Target: <strong className="text-blue-600">{(targetVal * 100).toFixed(0)}%</strong>
                          </span>
                        </div>
                        
                        {/* Split progress bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${currentVal * 100}%` }}
                          />
                        </div>
                        {/* Deviation badge */}
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Holding Value: ₹{Math.round(currentAllocationValues[cls]).toLocaleString()}</span>
                          <span className={`font-bold font-mono ${Math.abs(deviation) < 3 ? "text-emerald-600" : deviation > 0 ? "text-amber-600" : "text-rose-600"}`}>
                            {deviation === 0 ? "Balanced" : `${deviation > 0 ? "Overallocated +" : "Underallocated "}${deviation.toFixed(0)}%`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transactions plan list */}
              <div className="border border-slate-100 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Autonomous Rebalancing Trade Blueprint</h4>
                
                {requiredAdjustments.length === 0 ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-center text-xs font-semibold">
                    ✓ Portfolio perfectly aligned to the {targetRisk} model. No deviations detected!
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50 text-xs">
                    {requiredAdjustments.map((adj) => (
                      <div key={adj.assetClass} className="py-2.5 flex justify-between items-center">
                        <div>
                          <strong className="text-slate-800 block">{adj.assetClass}</strong>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {adj.deviationVal >= 0 ? "Trigger block buy on market" : "Liquidate surplus value on brokerages"}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold font-mono text-xs block ${adj.deviationVal >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {adj.deviationVal >= 0 ? "BUY" : "SELL"} ₹{Math.abs(Math.round(adj.deviationVal)).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400">{Math.abs(adj.deviationPct).toFixed(0)}% portfolio shift</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trigger Button */}
              {requiredAdjustments.length > 0 && (
                <button
                  disabled={isRebalancing}
                  onClick={handleStartRebalanceAgent}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isRebalancing ? (
                    <>
                      <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                      Executing Auto-Rebalance Stage {rebalanceStep}/7...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4.5 h-4.5" />
                      Trigger Autonomous Rebalance Agent (Update Demats)
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* B. TAX LOSS HARVESTING PANEL */}
          {activeSubTab === "taxHarvest" && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-4 bg-amber-50/50 border border-amber-100/50 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-amber-900 block font-bold">Tax Yield Optimization Loop</strong>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    This agent scans your connected brokerages to identify capital assets currently held at an unrealized loss. By locking in capital losses and immediately moving the balance into substitute index track funds, we save tax without affecting your structural market exposure.
                  </p>
                </div>
              </div>

              {/* Harvest details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Harvestable Capital Loss</span>
                  <span className="text-base font-mono font-extrabold text-rose-600 block mt-1">
                    ₹{totalLossToHarvest.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">Across {taxLossHoldings.length} holdings</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Direct Tax Savings (Est.)</span>
                  <span className="text-base font-mono font-extrabold text-emerald-700 block mt-1">
                    ₹{Math.round(taxSavingsEstimate).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">Offset against current capital gains tax</span>
                </div>
              </div>

              {/* Target items to harvest */}
              <div className="border border-slate-100 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Eligible Securities & Swap Substitutes</h4>
                
                {taxLossHoldings.length === 0 ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-center text-xs font-semibold">
                    ✓ No unrealized capital losses found across your demat accounts.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50 text-xs">
                    {taxLossHoldings.map((h) => {
                      const loss = h.costBasis - h.value;
                      return (
                        <div key={h.id} className="py-2.5 flex justify-between items-start">
                          <div>
                            <strong className="text-slate-800 block">{h.name}</strong>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              Swap with low-cost substitute index ETF on {h.broker}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold font-mono text-xs text-rose-600 block">
                              -₹{loss.toLocaleString()} Loss
                            </span>
                            <span className="text-[10px] text-slate-400">Current Value: ₹{h.value.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Trigger Button */}
              {taxLossHoldings.length > 0 && (
                <button
                  disabled={isTaxHarvesting}
                  onClick={handleStartTaxHarvestAgent}
                  className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isTaxHarvesting ? (
                    <>
                      <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                      Executing Auto-Harvest Swaps Stage {taxHarvestStep}/6...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4.5 h-4.5" />
                      Deploy Tax-Loss Harvesting Swap Bot
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* C. AUTOPILOT GUARDRAILS */}
          {activeSubTab === "guardrails" && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Create Natural Language Active Rule</span>
                <form onSubmit={handleCreateRule} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. If mutual funds drop 5%, automatically move ₹50,000 from Zerodha cash into Index Funds..."
                    value={newRulePrompt}
                    onChange={(e) => setNewRulePrompt(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isCreatingRule || !newRulePrompt}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-sans transition-all shadow-xs flex-shrink-0"
                  >
                    {isCreatingRule ? "Interpreting..." : "Deploy Loop"}
                  </button>
                </form>
              </div>

              {/* Active guardrail rules list */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">Running Background Agent Monitors</h4>
                
                {guardrails.map((g) => (
                  <div 
                    key={g.id} 
                    className={`p-4 border rounded-2xl flex justify-between items-start transition-all ${
                      g.isActive 
                        ? "bg-emerald-50/20 border-emerald-100/50" 
                        : "bg-slate-50/50 border-slate-100 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs mt-0.5 font-bold ${
                        g.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-500"
                      }`}>
                        {g.isActive ? "ON" : "OFF"}
                      </div>
                      <div className="text-xs">
                        <strong className="text-slate-800 block font-bold">{g.name}</strong>
                        <span className="text-[10px] text-slate-500 font-medium block mt-1">
                          <strong>TRIGGER:</strong> {g.trigger}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          <strong>ACTION:</strong> {g.action}
                        </span>
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full mt-2 inline-block font-mono">
                          {g.frequency}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleGuardrail(g.id)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                        g.isActive 
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300" 
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {g.isActive ? "Disarm" : "Arm Loop"}
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* RIGHT LIVE TELEMETRY TERMINAL COLUMN */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-950 text-slate-100 font-mono text-xs flex flex-col h-[480px]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">AGENTIC EXECUTION DECK</span>
              </div>
              <button 
                onClick={() => setAgentLogs([])}
                className="text-[9px] text-slate-400 hover:text-white underline"
              >
                Clear Terminal
              </button>
            </div>

            {/* Scrollable logs area */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-text scrollbar-thin">
              {agentLogs.length === 0 ? (
                <div className="text-slate-500 text-center py-20 italic">
                  &lt; System armed. Ready to stream telemetry logs... &gt;
                </div>
              ) : (
                agentLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed text-[11px] break-words">
                    <span className="text-slate-500">[{log.timestamp}]</span>{" "}
                    <span className={`font-bold ${
                      log.level === "SUCCESS" ? "text-emerald-400" :
                      log.level === "WARNING" ? "text-amber-400" : "text-blue-400"
                    }`}>
                      {log.level}:
                    </span>{" "}
                    <span className={log.level === "SUCCESS" ? "text-emerald-100" : "text-slate-200"}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Footer pipeline states */}
            <div className="border-t border-slate-800 pt-3 mt-3 flex justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> NSE/BSE Feed: Live
              </span>
              <span>Secure Sandboxed Sandbox Environment</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
