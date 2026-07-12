import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  BrainCircuit, 
  Target, 
  PieChart, 
  Briefcase, 
  RotateCcw, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  DollarSign, 
  ChevronRight, 
  LayoutGrid, 
  BookOpenCheck, 
  BadgeCheck, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  X,
  ArrowRight,
  ShieldAlert,
  RefreshCw,
  Lock,
  Check,
  Building,
  Activity,
  Award,
  LogOut
} from "lucide-react";
import { Asset, Goal, AnalysisResponse, AIInsight, AIAlert, ConnectedBroker } from "./types";
import { DEFAULT_GOALS } from "./data";
import { MetricCard } from "./components/MetricCard";
import { PortfolioChart } from "./components/PortfolioChart";
import { AIConversationalWidget } from "./components/AIConversationalWidget";
import { LearnCenter } from "./components/LearnCenter";
import { AdvancedReports } from "./components/AdvancedReports";
import { InvestmentsCenter } from "./components/InvestmentsCenter";
import { AgenticAIWorkspace } from "./components/AgenticAIWorkspace";
import { BrokerAggregationService, SUPPORTED_BROKERS, SAMPLE_HOLDINGS_BY_BROKER } from "./services/brokerAggregation";

export default function App() {
  // Onboarding States
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem("apex_onboarded") === "true";
  });
  
  const [onboardingStep, setOnboardingStep] = useState<
    "welcome" | "auth" | "kyc" | "consent" | "discovering" | "review" | "completed"
  >("welcome");

  const [userEmail, setUserEmail] = useState<string>("pookizxpro@gmail.com");
  const [userPhone, setUserPhone] = useState<string>("+91 98765 43210");
  const [panCard, setPanCard] = useState<string>("");
  const [isKycLoading, setIsKycLoading] = useState<boolean>(false);
  const [isKycDone, setIsKycDone] = useState<boolean>(false);
  
  // Consent flags
  const [consentAccountAggregator, setConsentAccountAggregator] = useState(true);
  const [consentNsdlLcdsl, setConsentNsdlLcdsl] = useState(true);
  const [consentBrokerApis, setConsentBrokerApis] = useState(true);

  // Discovering process states
  const [discoveryProgress, setDiscoveryProgress] = useState<number>(0);
  const [scannedBrokers, setScannedBrokers] = useState<Record<string, "pending" | "scanning" | "found" | "none">>({});

  // Connected Brokers (Investment Account Discovery Engine)
  const [connectedBrokers, setConnectedBrokers] = useState<ConnectedBroker[]>(() => {
    const saved = localStorage.getItem("apex_connected_brokers");
    return saved ? JSON.parse(saved) : [];
  });

  // Portfolio Assets and Goals
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem("apex_portfolio_assets");
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("apex_portfolio_goals");
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  // UI States
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeBrokerFilter, setActiveBrokerFilter] = useState<string>("All");
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>("All");
  const [targetRisk, setTargetRisk] = useState<"Conservative" | "Moderate" | "Aggressive">("Moderate");
  const [confirmLogout, setConfirmLogout] = useState<boolean>(false);
  
  // Is Advanced Analytics "Explore More" visible
  const [showAdvancedExplorer, setShowAdvancedExplorer] = useState<boolean>(false);
  const [advancedTab, setAdvancedTab] = useState<"positions" | "overlaps" | "rebalance" | "academy" | "milestones">("positions");

  // AI Diagnostics State
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Manual Asset Entry States
  const [showAddAsset, setShowAddAsset] = useState<boolean>(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: "",
    ticker: "",
    assetClass: "Stocks",
    value: 10000,
    costBasis: 9000,
    change24h: 1.5,
    sector: "Technology",
    broker: "Manual Entry"
  });

  // Manual Goal Creation States
  const [showAddGoal, setShowAddGoal] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    name: "",
    targetAmount: 50000,
    currentAmount: 10000,
    deadlineYears: 5,
    category: "general"
  });

  // Sync state with local storage
  useEffect(() => {
    localStorage.setItem("apex_onboarded", isOnboarded ? "true" : "false");
    localStorage.setItem("apex_connected_brokers", JSON.stringify(connectedBrokers));
    localStorage.setItem("apex_portfolio_assets", JSON.stringify(assets));
    localStorage.setItem("apex_portfolio_goals", JSON.stringify(goals));
  }, [isOnboarded, connectedBrokers, assets, goals]);

  // Handle run AI diagnostics analysis
  const runPortfolioAnalysis = async (customAssets = assets) => {
    if (customAssets.length === 0) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const response = await fetch("/api/portfolio/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assets: customAssets,
          goals,
          targetRisk
        })
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Server returned error state.");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error("AI diagnostics failed:", err);
      setAnalysisError(err.message || "Something went wrong while connecting to the diagnostics agent.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger analysis when risk plan changes
  useEffect(() => {
    if (isOnboarded && assets.length > 0) {
      runPortfolioAnalysis();
    }
  }, [targetRisk]);

  // Auto run initial analysis after onboarding completes
  useEffect(() => {
    if (isOnboarded && assets.length > 0 && !analysis) {
      runPortfolioAnalysis();
    }
  }, [isOnboarded]);

  // Calculate global portfolio stats
  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
  const totalCost = assets.reduce((sum, a) => sum + a.costBasis, 0);
  const totalProfitLoss = totalValue - totalCost;
  const plPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;
  
  // Weighted average 24h change
  const avgChange24h = totalValue > 0 
    ? assets.reduce((sum, a) => sum + (a.change24h * a.value), 0) / totalValue
    : 0;

  // Onboarding: Trigger KYC
  const handleVerifyKyc = () => {
    if (!panCard) return;
    setIsKycLoading(true);
    setTimeout(() => {
      setIsKycLoading(false);
      setIsKycDone(true);
    }, 1500);
  };

  // Onboarding: Discovering scan state machine
  const handleStartDiscovery = async () => {
    setOnboardingStep("discovering");
    setDiscoveryProgress(10);
    
    // Initialize scans
    const statuses: Record<string, "pending" | "scanning" | "found" | "none"> = {};
    SUPPORTED_BROKERS.forEach(b => {
      statuses[b.id] = "pending";
    });
    setScannedBrokers(statuses);

    // Sequential simulation of broker querying
    const steps = SUPPORTED_BROKERS.map((b, index) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Update current scanning status
          setScannedBrokers(prev => ({
            ...prev,
            [b.id]: "scanning"
          }));
          
          setTimeout(() => {
            const defaultDiscoveredIds = ["zerodha", "groww", "upstox"];
            const isFound = defaultDiscoveredIds.includes(b.id);
            
            setScannedBrokers(prev => ({
              ...prev,
              [b.id]: isFound ? "found" : "none"
            }));
            
            setDiscoveryProgress(prev => Math.min(100, prev + 12));
            resolve();
          }, 600);
        }, index * 800);
      });
    });

    await Promise.all(steps);
    
    // Auto-discover payload
    const { discovered, assets: discoveredAssets } = await BrokerAggregationService.autoDiscoverLinkedBrokers(
      userPhone,
      true
    );

    setTimeout(() => {
      setConnectedBrokers(discovered);
      setAssets(discoveredAssets);
      setDiscoveryProgress(100);
      setOnboardingStep("review");
    }, 500);
  };

  // Onboarding: Manually Link Broker Fallback
  const handleManualBrokerLink = async (brokerId: string) => {
    try {
      const { connectedBroker, updatedAssets } = await BrokerAggregationService.manuallyLinkBroker(
        brokerId,
        assets
      );
      
      // Update states
      if (!connectedBrokers.some(b => b.id === brokerId)) {
        setConnectedBrokers(prev => [...prev, connectedBroker]);
        setAssets(updatedAssets);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Onboarding: Confirm and proceed
  const handleConfirmOnboarding = async () => {
    setOnboardingStep("completed");
    // Trigger analysis pre-emptively so it is ready for the dashboard
    await runPortfolioAnalysis(assets);
  };

  // Onboarding: complete and save
  const handleEnterDashboard = () => {
    setIsOnboarded(true);
    localStorage.setItem("apex_onboarded", "true");
  };

  // Dashboard Action: Sync individual broker
  const handleSyncBroker = async (brokerId: string) => {
    // Set broker syncing state
    setConnectedBrokers(prev => prev.map(b => b.id === brokerId ? { ...b, status: "syncing" } : b));
    
    const { status, lastSyncTime, updatedAssets } = await BrokerAggregationService.syncBroker(
      brokerId,
      assets
    );

    // Filter broker Meta
    const brokerMeta = SUPPORTED_BROKERS.find(b => b.id === brokerId);
    if (!brokerMeta) return;

    // Sum holdings
    const brokerHoldingsValue = updatedAssets
      .filter(a => a.broker === brokerMeta.name)
      .reduce((sum, a) => sum + a.value, 0);

    setConnectedBrokers(prev => prev.map(b => 
      b.id === brokerId 
        ? { ...b, status, lastSyncTime, holdingsValue: brokerHoldingsValue } 
        : b
    ));

    setAssets(updatedAssets);
    await runPortfolioAnalysis(updatedAssets);
  };

  // Manual Holding Handler: Add position
  const handleAddManualAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name) return;

    const created: Asset = {
      id: "manual_" + Date.now(),
      name: newAsset.name,
      ticker: newAsset.ticker?.toUpperCase() || undefined,
      assetClass: newAsset.assetClass as any,
      value: Number(newAsset.value) || 0,
      costBasis: Number(newAsset.costBasis) || 0,
      change24h: Number(newAsset.change24h) || 0,
      sector: newAsset.sector || "Other",
      broker: newAsset.broker || "Manual Entry"
    };

    const updated = [...assets, created];
    setAssets(updated);
    setShowAddAsset(false);
    setNewAsset({
      name: "",
      ticker: "",
      assetClass: "Stocks",
      value: 10000,
      costBasis: 9000,
      change24h: 1.5,
      sector: "Technology",
      broker: "Manual Entry"
    });
    
    setTimeout(() => runPortfolioAnalysis(updated), 100);
  };

  // Manual Holding Handler: Delete
  const handleDeleteAsset = (id: string) => {
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    setTimeout(() => runPortfolioAnalysis(updated), 100);
  };

  // Manual Goal Handler: Add
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name) return;

    const created: Goal = {
      id: "goal_" + Date.now(),
      name: newGoal.name,
      targetAmount: Number(newGoal.targetAmount) || 50000,
      currentAmount: Number(newGoal.currentAmount) || 0,
      deadlineYears: Number(newGoal.deadlineYears) || 5,
      category: newGoal.category as any
    };

    setGoals([...goals, created]);
    setShowAddGoal(false);
    setNewGoal({
      name: "",
      targetAmount: 50000,
      currentAmount: 10000,
      deadlineYears: 5,
      category: "general"
    });
  };

  // Reset Onboarding State to let them experience the process again
  const handleLogoutReset = () => {
    setIsOnboarded(false);
    setOnboardingStep("welcome");
    setConnectedBrokers([]);
    setAssets([]);
    setAnalysis(null);
    setPanCard("");
    setIsKycDone(false);
    setConfirmLogout(false);
    localStorage.removeItem("apex_onboarded");
    localStorage.removeItem("apex_connected_brokers");
    localStorage.removeItem("apex_portfolio_assets");
  };

  // 1. RENDERING: ONBOARDING INTERFACE
  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans" id="onboarding-root">
        
        {/* Onboarding Card */}
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden transition-all duration-300" id="onboarding-card">
          
          {/* Header branding */}
          <div className="bg-blue-600 p-6 text-white text-center flex flex-col items-center justify-center relative">
            <div className="absolute top-4 right-4 bg-blue-700/50 text-[10px] text-blue-100 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
              SECURE 256-BIT SSL
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-md mb-3">
              <TrendingUp className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight font-display">FinBridge</h1>
            <p className="text-xs text-blue-100 mt-1 uppercase font-bold tracking-wider">UPI for Investments</p>
          </div>

          {/* Onboarding Flow Content */}
          <div className="p-6 md:p-8">
            
            {/* STEP 1: WELCOME SCREEN */}
            {onboardingStep === "welcome" && (
              <div className="flex flex-col gap-5 text-center animate-fadeIn" id="onboarding-welcome">
                <div className="space-y-2">
                  <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-display">
                    One Login. Every Investment.<br />Smarter Decisions.
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Securely access, aggregate, and analyze your investments held across multiple brokers and asset classes from one unified terminal.
                  </p>
                </div>

                {/* Core USP items */}
                <div className="grid grid-cols-3 gap-3 py-2 text-left">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-800">Auto Discover</span>
                    <span className="text-[9px] text-slate-400">Scan depositories linked to phone</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-800">Consent Led</span>
                    <span className="text-[9px] text-slate-400">Strict read-only API integration</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-800">AI Analytics</span>
                    <span className="text-[9px] text-slate-400">Instant risk diagnostic audits</span>
                  </div>
                </div>

                <button
                  onClick={() => setOnboardingStep("auth")}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 mt-2"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: AUTH SCREEN */}
            {onboardingStep === "auth" && (
              <div className="flex flex-col gap-5 animate-fadeIn" id="onboarding-auth">
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-bold text-slate-800 font-display">Create Account or Sign In</h2>
                  <p className="text-xs text-slate-400">Begin with your Google Account or verified email</p>
                </div>

                <button
                  onClick={() => setOnboardingStep("kyc")}
                  className="w-full py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {/* Google Custom Minimal Vector SVG Logo */}
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.69 14.9 1 12 1 7.35 1 3.39 3.68 1.41 7.59l3.77 2.93c.89-2.66 3.38-4.48 6.82-4.48z"/>
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.66-2.31 3.48l3.6 2.79c2.1-1.94 3.31-4.79 3.31-8.42z"/>
                    <path fill="#FBBC05" d="M5.18 14.68A7.16 7.16 0 014.75 12c0-.94.16-1.85.43-2.68L1.41 6.39A11.96 11.96 0 000 12c0 2.02.5 3.92 1.41 5.61l3.77-2.93z"/>
                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.6-2.79c-1 .67-2.28 1.07-3.96 1.07-3.44 0-5.93-2.32-6.82-4.98L1.81 16.3A11.96 11.96 0 0012 23z"/>
                  </svg>
                  Sign In with Google
                </button>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="w-full h-[1px] bg-slate-100"></span>
                  <span className="text-[10px] font-bold uppercase px-3 text-slate-400">or use email</span>
                  <span className="w-full h-[1px] bg-slate-100"></span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label htmlFor="auth-email" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email address</label>
                    <input
                      type="email"
                      id="auth-email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="auth-phone" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mobile number (Linked with Brokerages)</label>
                    <input
                      type="text"
                      id="auth-phone"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setOnboardingStep("kyc")}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Continue
                </button>
              </div>
            )}

            {/* STEP 3: KYC SCREEN */}
            {onboardingStep === "kyc" && (
              <div className="flex flex-col gap-5 animate-fadeIn" id="onboarding-kyc">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold bg-amber-50 border border-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">KYC Compliance Check</span>
                  <h2 className="text-lg font-bold text-slate-800 font-display mt-2">Verify Asset Registry Profile</h2>
                  <p className="text-xs text-slate-400">Enter PAN to scan SEBI-registered depositories automatically</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3.5">
                  <div>
                    <label htmlFor="kyc-pan" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Permanent Account Number (PAN)</label>
                    <input
                      type="text"
                      id="kyc-pan"
                      placeholder="e.g. ABCDE1234F"
                      maxLength={10}
                      value={panCard}
                      onChange={(e) => setPanCard(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 tracking-widest font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {isKycLoading ? (
                    <div className="text-center py-2 text-xs font-semibold text-slate-500 animate-pulse flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      Checking NSDL/CDSL Registry...
                    </div>
                  ) : isKycDone ? (
                    <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-[11px] font-semibold flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> KYC verified successfully under pookizxpro@gmail.com
                    </div>
                  ) : null}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // skip kyc
                      setIsKycDone(true);
                      setOnboardingStep("consent");
                    }}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all text-center"
                  >
                    Skip KYC
                  </button>
                  <button
                    disabled={!panCard || isKycDone}
                    onClick={handleVerifyKyc}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Verify KYC
                  </button>
                </div>

                {isKycDone && (
                  <button
                    onClick={() => setOnboardingStep("consent")}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    Proceed to Data Consent <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* STEP 4: CONSENT SCREEN */}
            {onboardingStep === "consent" && (
              <div className="flex flex-col gap-5 animate-fadeIn" id="onboarding-consent">
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-bold text-slate-800 font-display">Aggregator Access Consent</h2>
                  <p className="text-xs text-slate-400">Grant permission to locate and aggregate your linked portfolios</p>
                </div>

                {/* Consent Items */}
                <div className="flex flex-col gap-3">
                  <label className="p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consentAccountAggregator}
                      onChange={(e) => setConsentAccountAggregator(e.target.checked)}
                      className="mt-1 accent-blue-600 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Account Aggregator (FIP Network)</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed block mt-0.5">
                        Reads and fetches mutual fund units, bank accounts, and corporate bonds read-only.
                      </span>
                    </div>
                  </label>

                  <label className="p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consentNsdlLcdsl}
                      onChange={(e) => setConsentNsdlLcdsl(e.target.checked)}
                      className="mt-1 accent-blue-600 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">SEBI NSDL/CDSL Registry</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed block mt-0.5">
                        Matches your verified email and phone with standard demat holding portfolios.
                      </span>
                    </div>
                  </label>

                  <label className="p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consentBrokerApis}
                      onChange={(e) => setConsentBrokerApis(e.target.checked)}
                      className="mt-1 accent-blue-600 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Broker read-only APIs</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed block mt-0.5">
                        Integrates directly with supported Indian broker portals to sync stock shares live.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-900 leading-relaxed flex gap-2">
                  <Lock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Absolute Security Guarantee:</strong> All queries are read-only. We can never execute orders or withdraw money.
                  </span>
                </div>

                <button
                  disabled={!consentAccountAggregator && !consentNsdlLcdsl && !consentBrokerApis}
                  onClick={handleStartDiscovery}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Discover My Investments
                </button>
              </div>
            )}

            {/* STEP 5: DISCOVERING ANIMATION */}
            {onboardingStep === "discovering" && (
              <div className="flex flex-col gap-6 items-center py-6 animate-fadeIn" id="onboarding-discovering">
                
                {/* Scanner graphic */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                  <Building className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-base font-bold text-slate-800 font-display">Investment Account Discovery Engine</h3>
                  <p className="text-xs text-slate-500">Scanning linked depository registries for {userPhone}...</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${discoveryProgress}%` }}
                  />
                </div>

                {/* Micro statuses */}
                <div className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  {SUPPORTED_BROKERS.map(b => {
                    const status = scannedBrokers[b.id] || "pending";
                    return (
                      <div key={b.id} className="flex justify-between items-center text-[11px] py-0.5">
                        <span className="font-semibold text-slate-600">{b.name}</span>
                        {status === "pending" && <span className="text-slate-400">Waiting...</span>}
                        {status === "scanning" && <span className="text-blue-600 font-bold animate-pulse">Scanning API...</span>}
                        {status === "found" && <span className="text-emerald-700 font-extrabold flex items-center gap-1">✓ Discovered Account</span>}
                        {status === "none" && <span className="text-slate-400">No linked demat</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: REVIEW DISCOVERED ACCOUNTS */}
            {onboardingStep === "review" && (
              <div className="flex flex-col gap-5 animate-fadeIn" id="onboarding-review">
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-bold text-slate-800 font-display">Demat Accounts Discovered</h2>
                  <p className="text-xs text-slate-400">We discovered 3 active investment profiles linked to you</p>
                </div>

                {/* Discovered broker list */}
                <div className="space-y-2.5">
                  {connectedBrokers.map(b => (
                    <div key={b.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-xs">
                          {b.name[0]}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{b.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Status: Connected • read-only</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-800 block">
                          ${b.holdingsValue.toLocaleString()}
                        </span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                          {b.linkedAccountsCount} Portfolio
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Manual Link Options */}
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Connect other brokers manually:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUPPORTED_BROKERS.filter(b => !connectedBrokers.some(cb => cb.id === b.id)).map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleManualBrokerLink(b.id)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-[10px] font-bold rounded-xl text-slate-700 flex items-center gap-1.5 transition-all"
                      >
                        + {b.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleConfirmOnboarding}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-1"
                >
                  Confirm & Build Unified Portfolio <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 7: COMPLETED */}
            {onboardingStep === "completed" && (
              <div className="flex flex-col gap-5 text-center py-4 animate-fadeIn" id="onboarding-completed">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-800 font-display">Aggregation Completed!</h2>
                  <p className="text-xs text-slate-500">Your Unified Investment Dashboard is compiled securely</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-200/60 max-w-sm mx-auto w-full text-left font-sans text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Connected Brokers:</span>
                    <span className="font-bold text-slate-800">{connectedBrokers.length} Accounts</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Discovered Holdings:</span>
                    <span className="font-bold text-slate-800">{assets.length} Assets</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Combined Net Worth:</span>
                    <span className="font-bold text-blue-600">₹{totalValue.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleEnterDashboard}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-xl mt-3 flex items-center justify-center gap-1.5"
                >
                  Enter Smarter Dashboard <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    );
  }

  // 2. RENDERING: MAIN CORE UNIFIED INVESTMENT TERMINAL
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans" id="app-root">
      
      {/* SIDEBAR NAVIGATION PANEL (DESKTOP) */}
      <aside className="hidden md:flex md:w-64 bg-slate-900 text-white flex-col flex-shrink-0 border-r border-slate-800 sticky top-0 h-screen" id="desktop-sidebar">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <TrendingUp className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight font-display text-white">FinBridge</h1>
            <span className="text-[9px] text-blue-400 font-extrabold tracking-widest block uppercase">UPI FOR INVESTMENTS</span>
          </div>
        </div>

        {/* Sidebar Navigation Menu */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto" aria-label="Main Navigation">
          {[
            { name: "Dashboard", icon: LayoutGrid },
            { name: "Agentic AI", icon: BrainCircuit },
            { name: "Profile & Settings", icon: User }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all text-left ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Sync session status at bottom of sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[10px] text-slate-400 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-mono text-slate-300 font-bold">UPI Pipeline Live</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold block truncate">User: {userEmail}</span>
            {confirmLogout ? (
              <div className="flex flex-col gap-1.5 mt-1 border border-red-900/30 p-2 bg-red-950/20 rounded-xl animate-fadeIn">
                <span className="text-[9px] text-red-400 font-bold block text-center uppercase tracking-wider">Reset whole account?</span>
                <div className="flex gap-1.5">
                  <button 
                    onClick={handleLogoutReset}
                    className="flex-1 py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold transition-all text-center"
                    id="logout-confirm-yes-desktop"
                  >
                    Yes, Reset
                  </button>
                  <button 
                    onClick={() => setConfirmLogout(false)}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition-all text-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setConfirmLogout(true)}
                className="mt-1 w-full py-2 px-3 bg-red-950/30 hover:bg-red-900/40 border border-red-900/30 text-red-400 hover:text-red-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                title="Logout session and view onboarding again"
                id="logout-button-desktop"
              >
                <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Logout & Reset</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-4 py-3.5 flex items-center justify-between" id="mobile-header">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <TrendingUp className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-sm font-display tracking-tight">FinBridge</span>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Sliding Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[52px] bottom-0 bg-slate-900 z-30 flex flex-col animate-fadeIn" id="mobile-nav-menu">
          <div className="p-4 flex flex-col gap-1.5 flex-1 overflow-y-auto">
            {[
              { name: "Dashboard", icon: LayoutGrid },
              { name: "Agentic AI", icon: BrainCircuit },
              { name: "Profile & Settings", icon: User }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3.5 p-3 text-xs font-bold rounded-xl transition-all text-left ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.name}
                </button>
              );
            })}
          </div>
          <div className="p-4 border-t border-slate-800 text-[10px] text-slate-400 bg-slate-950 flex justify-between items-center" id="mobile-logout-section">
            <div>
              <span className="font-bold text-slate-300 block">UPI Pipeline Live</span>
              <span className="truncate max-w-[110px] block">{userEmail}</span>
            </div>
            {confirmLogout ? (
              <div className="flex gap-1.5 animate-fadeIn">
                <button 
                  onClick={handleLogoutReset}
                  className="py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-bold transition-all text-center"
                  id="logout-confirm-yes-mobile"
                >
                  Confirm Reset
                </button>
                <button 
                  onClick={() => setConfirmLogout(false)}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[9px] font-bold transition-all text-center"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setConfirmLogout(true)}
                className="py-1.5 px-2.5 bg-red-950/30 hover:bg-red-900/40 border border-red-900/30 text-red-400 hover:text-red-300 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
                title="Logout session and view onboarding again"
                id="logout-button-mobile"
              >
                <LogOut className="w-3 h-3 flex-shrink-0" />
                <span>Logout & Reset</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen" id="main-scrollable">
        
        {/* Global Strategy Selection Ribbon */}
        <div className="bg-white border-b border-slate-100 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-3xs" id="sub-header-bar">
          <div>
            <h2 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Investment Diagnostics Profile
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-slate-800 font-display">
                {targetRisk} Strategy Active
              </span>
              <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                PORTFOLIO HEALTH
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="strategy-risk-select" className="text-xs font-semibold text-slate-500">Risk Profile:</label>
            <select
              id="strategy-risk-select"
              value={targetRisk}
              onChange={(e) => setTargetRisk(e.target.value as any)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 px-3 focus:outline-hidden focus:ring-2 focus:ring-blue-100 text-slate-700 cursor-pointer"
            >
              <option value="Conservative">Conservative</option>
              <option value="Moderate">Moderate</option>
              <option value="Aggressive">Aggressive</option>
            </select>
          </div>
        </div>

        <div className="p-4 sm:p-6 flex-1 flex flex-col gap-6">

          {/* ==================== VIEW: DASHBOARD ==================== */}
          {activeTab === "Dashboard" && (
            <div className="flex flex-col gap-6 animate-fadeIn" id="view-dashboard">
              
              {/* Top Core Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  id="dashboard-networth"
                  title="Combined Net Worth"
                  value={`₹${totalValue.toLocaleString()}`}
                  subtitle={`of ₹${totalCost.toLocaleString()} Cost Basis`}
                  trend={{
                    value: `${totalProfitLoss >= 0 ? "+" : ""}₹${totalProfitLoss.toLocaleString()} (${plPercentage.toFixed(1)}%)`,
                    isPositive: totalProfitLoss >= 0
                  }}
                  colorType="blue"
                  sparklineData={[60, 62, 65, 68, 72, 75, 74, 77]}
                />

                <MetricCard
                  id="dashboard-daychange"
                  title="Today's Gain/Loss"
                  value={`${avgChange24h.toFixed(2)}%`}
                  subtitle="Weighted index yield"
                  trend={{
                    value: avgChange24h >= 0 ? "Profit" : "Loss",
                    isPositive: avgChange24h >= 0
                  }}
                  colorType={avgChange24h >= 0 ? "green" : "red"}
                  sparklineData={avgChange24h >= 0 ? [10, 20, 15, 30, 25, 40, 35, 50] : [50, 40, 45, 30, 35, 20, 25, 10]}
                />

                <MetricCard
                  id="dashboard-div-score"
                  title="Diversification Score"
                  value={analysis ? `${analysis.diversificationScore}/100` : "75/100"}
                  subtitle="Multi-asset balance"
                  tooltipText="Evaluates equity, gold, cash reserves, and alternative assets correlation risk."
                  colorType="amber"
                  sparklineData={[70, 72, 75, 74, 78, 81, 82, 84]}
                  isLoading={isAnalyzing}
                />

                <MetricCard
                  id="dashboard-health-score"
                  title="Financial Health Score"
                  value={analysis ? `${analysis.financialHealthScore}/100` : "80/100"}
                  subtitle="Risk mitigation level"
                  tooltipText="Calculates capital exposure levels, liquidity backing, and broker centralization risks."
                  colorType="slate"
                  sparklineData={[65, 68, 70, 72, 75, 76, 77, 78]}
                  isLoading={isAnalyzing}
                />
              </div>

              {/* TWO COLUMN GRID: INVESTMENT DISCOVERY ENGINE & ASSET ALLOCATION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* COLUMN 1: Account Aggregator Engine (Discovered Brokers list) */}
                <div className="lg:col-span-7 bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Connected broker pipelines</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">UPI-style account discovery and live synchronization</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                      {connectedBrokers.length} ACTIVE
                    </span>
                  </div>

                  {/* Connected Broker List */}
                  <div className="space-y-3">
                    {connectedBrokers.map(b => (
                      <div 
                        key={b.id} 
                        className="p-3.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-600/10 flex items-center justify-center font-extrabold text-xs">
                            {b.name[0]}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{b.name}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                b.status === "connected" ? "bg-emerald-500 animate-pulse" :
                                b.status === "syncing" ? "bg-blue-500 animate-spin" : "bg-slate-400"
                              }`}></span>
                              <span className="text-[10px] text-slate-400">
                                {b.status === "syncing" ? "Syncing data..." : `Last synced: ${b.lastSyncTime || "N/A"}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3.5">
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-slate-800 block">
                              ₹{b.holdingsValue.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-400 block font-semibold">
                              {b.linkedAccountsCount} linked portfolio
                            </span>
                          </div>

                          <button
                            disabled={b.status === "syncing"}
                            onClick={() => handleSyncBroker(b.id)}
                            className="p-2 hover:bg-slate-200/60 text-slate-500 hover:text-slate-700 rounded-xl transition-all border border-slate-200/40 bg-white shadow-3xs"
                            title="Sync Holdings live"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${b.status === "syncing" ? "animate-spin text-blue-600" : ""}`} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Quick Link More Trigger */}
                    <div className="border-t border-dashed border-slate-100 pt-3 flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Connect Additional Brokers:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {SUPPORTED_BROKERS.filter(b => !connectedBrokers.some(cb => cb.id === b.id)).map(b => (
                          <button
                            key={b.id}
                            onClick={() => handleManualBrokerLink(b.id)}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500 flex items-center gap-1.5 transition-all"
                          >
                            + {b.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: Asset Allocation (D3 Portfolio Chart) */}
                <div className="lg:col-span-5 h-full">
                  <PortfolioChart assets={assets} />
                </div>

              </div>

              {/* THREE COLUMN DETAILS ROW: GOAL PROGRESS, ALERTS, AND AI INSIGHTS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Goals Widget */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4.5 h-4.5 text-blue-600" />
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Goal Milestones</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowAdvancedExplorer(true);
                        setAdvancedTab("milestones");
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                    >
                      Manage <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    {goals.slice(0, 3).map((g) => {
                      const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
                      return (
                        <div key={g.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex flex-col gap-1.5">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-slate-700 truncate max-w-[150px]">{g.name}</span>
                            <span className="font-mono text-[10px] font-bold text-blue-700">{pct.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full animate-pulse" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Alerts Widget */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                    <ShieldAlert className="w-4.5 h-4.5 text-blue-600" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-500">System Alerts</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-2.5">
                    {isAnalyzing ? (
                      <div className="text-center py-4 text-xs text-slate-400">Scanning risk triggers...</div>
                    ) : analysis && analysis.alerts && analysis.alerts.length > 0 ? (
                      analysis.alerts.slice(0, 2).map((al, idx) => {
                        let bg = "bg-slate-50 border-slate-100 text-slate-700";
                        if (al.type === "warning") bg = "bg-rose-50/50 border-rose-100 text-rose-800";
                        if (al.type === "success") bg = "bg-emerald-50/50 border-emerald-100 text-emerald-800";
                        
                        return (
                          <div key={idx} className={`p-2.5 border rounded-xl flex gap-2 items-start text-[11px] leading-snug ${bg}`}>
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-blue-600" />
                            <div>
                              <strong className="font-bold text-slate-800 block">{al.title}</strong>
                              <span className="text-slate-500 mt-0.5 block leading-normal">{al.message}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 text-xs text-slate-400">No critical alerts flagged.</div>
                    )}
                  </div>
                </div>

                {/* AI Insights Widget */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-blue-600" />
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-500">AI Portfolio Insights</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowAdvancedExplorer(true);
                        setAdvancedTab("overlaps");
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                    >
                      Audit Reports <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col gap-2.5 justify-center">
                    {isAnalyzing ? (
                      <div className="text-center py-4 text-xs text-slate-400">Formulating wealth suggestions...</div>
                    ) : analysis && analysis.insights && analysis.insights.length > 0 ? (
                      analysis.insights.slice(0, 1).map((ins, idx) => (
                        <div key={idx} className="p-3 bg-blue-50/30 border border-blue-50 rounded-xl text-[11px] leading-relaxed text-blue-950">
                          <strong className="font-extrabold uppercase text-[9px] text-blue-600 tracking-wider block mb-1">
                            {ins.category.toUpperCase()} • {ins.title}
                          </strong>
                          <p className="text-slate-700 leading-normal mb-1.5">{ins.description}</p>
                          <span className="font-bold text-slate-800 block bg-white/85 p-1.5 rounded-lg border border-blue-100/50">
                            💡 Tip: {ins.actionableTip}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-400">Click Sync to fetch latest analysis insights.</div>
                    )}
                  </div>
                </div>

              </div>

              {/* PROGRESSIVE DISCLOSURE: EXPLORE MORE BUTTON */}
              <div className="text-center mt-2 pb-6">
                <button
                  onClick={() => setShowAdvancedExplorer(!showAdvancedExplorer)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg inline-flex items-center gap-1.5"
                >
                  {showAdvancedExplorer ? "Hide Advanced Analytics" : "Explore More Advanced Tools"} 
                  <ChevronRight className={`w-4 h-4 transition-transform ${showAdvancedExplorer ? "rotate-90" : ""}`} />
                </button>
              </div>

              {/* EXPANDABLE SECTION (POWERFUL UNDER THE HOOD) */}
              {showAdvancedExplorer && (
                <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-md flex flex-col gap-6 animate-fadeIn" id="advanced-explorer">
                  
                  {/* Inner Navigation Tabs */}
                  <div className="flex overflow-x-auto gap-1 border-b border-slate-100 pb-3 scrollbar-none">
                    {[
                      { id: "positions", label: "Holdings Matrix", icon: Briefcase },
                      { id: "overlaps", label: "Diagnostics & Overlaps", icon: ShieldAlert },
                      { id: "rebalance", label: "Strategic Rebalancer", icon: PieChart },
                      { id: "academy", label: "Wealth Academy", icon: BookOpenCheck },
                      { id: "milestones", label: "Wealth Milestones", icon: Target }
                    ].map(sub => {
                      const Icon = sub.icon;
                      const isCurrent = advancedTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setAdvancedTab(sub.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                            isCurrent 
                              ? "bg-slate-900 text-white shadow-xs" 
                              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* TAB CONTENT: HOLDINGS MATRIX LIST */}
                  {advancedTab === "positions" && (
                    <div className="flex flex-col gap-5 animate-fadeIn">
                      
                      {/* Action & Filter bar */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="text-[10px] font-bold text-slate-400 mr-2 uppercase tracking-wider">Broker Filter:</span>
                          {["All", ...connectedBrokers.map(cb => cb.name), "Manual Entry"].map((bOption) => (
                            <button
                              key={bOption}
                              onClick={() => setActiveBrokerFilter(bOption)}
                              className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                                activeBrokerFilter === bOption
                                  ? "bg-blue-600 text-white shadow-xs"
                                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {bOption}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setShowAddAsset(!showAddAsset)}
                            className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Position
                          </button>
                        </div>
                      </div>

                      {/* Add position form */}
                      {showAddAsset && (
                        <form onSubmit={handleAddManualAsset} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 animate-fadeIn">
                          <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
                            <h4 className="font-bold text-xs text-slate-700 uppercase">Manually Record Investment Asset</h4>
                            <button type="button" onClick={() => setShowAddAsset(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div>
                              <label htmlFor="form-asset-name" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Asset Name</label>
                              <input
                                type="text"
                                id="form-asset-name"
                                placeholder="e.g. Sovereign Gold Scheme"
                                value={newAsset.name}
                                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-hidden"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="form-asset-ticker" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Ticker / Symbol (Optional)</label>
                              <input
                                type="text"
                                id="form-asset-ticker"
                                placeholder="e.g. SGBGOLD"
                                value={newAsset.ticker}
                                onChange={(e) => setNewAsset({ ...newAsset, ticker: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-hidden"
                              />
                            </div>

                            <div>
                              <label htmlFor="form-asset-class" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Asset Class</label>
                              <select
                                id="form-asset-class"
                                value={newAsset.assetClass}
                                onChange={(e) => setNewAsset({ ...newAsset, assetClass: e.target.value as any })}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-hidden font-semibold cursor-pointer"
                              >
                                <option value="Stocks">Stocks</option>
                                <option value="Mutual Funds">Mutual Funds</option>
                                <option value="Cash Equivalents">Cash Equivalents</option>
                                <option value="Gold">Gold</option>
                                <option value="Alternatives">Alternatives</option>
                              </select>
                            </div>

                            <div>
                              <label htmlFor="form-asset-value" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Value (₹)</label>
                              <input
                                type="number"
                                id="form-asset-value"
                                value={newAsset.value}
                                onChange={(e) => setNewAsset({ ...newAsset, value: Number(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-hidden"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="form-asset-cost" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cost Basis (₹)</label>
                              <input
                                type="number"
                                id="form-asset-cost"
                                value={newAsset.costBasis}
                                onChange={(e) => setNewAsset({ ...newAsset, costBasis: Number(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-hidden"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="form-asset-broker" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Broker Account Tag</label>
                              <select
                                id="form-asset-broker"
                                value={newAsset.broker}
                                onChange={(e) => setNewAsset({ ...newAsset, broker: e.target.value as any })}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-hidden font-semibold cursor-pointer"
                              >
                                <option value="Manual Entry">Manual Entry</option>
                                {connectedBrokers.map(cb => (
                                  <option key={cb.id} value={cb.name}>{cb.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="self-end px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                          >
                            + Record Holding
                          </button>
                        </form>
                      )}

                      {/* Holdings Table */}
                      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-3xs bg-white">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                <th className="p-4">Investment holdings</th>
                                <th className="p-4">Asset Class</th>
                                <th className="p-4">Demat Pipeline</th>
                                <th className="p-4 text-right">Value</th>
                                <th className="p-4 text-right">Yield change</th>
                                <th className="p-4 text-center">Delete</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {assets
                                .filter(a => {
                                  if (activeBrokerFilter === "All") return true;
                                  return a.broker === activeBrokerFilter;
                                })
                                .map(a => {
                                  const pl = a.value - a.costBasis;
                                  const plPct = a.costBasis > 0 ? (pl / a.costBasis) * 100 : 0;
                                  return (
                                    <tr key={a.id} className="hover:bg-slate-50/30 transition-colors">
                                      <td className="p-4">
                                        <span className="font-bold text-slate-800 block">{a.name}</span>
                                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase">
                                          {a.ticker || "N/A"} • {a.sector}
                                        </span>
                                      </td>
                                      <td className="p-4">
                                        <span className="text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">
                                          {a.assetClass}
                                        </span>
                                      </td>
                                      <td className="p-4 font-bold text-slate-500">{a.broker}</td>
                                      <td className="p-4 text-right font-mono font-bold text-slate-800">
                                        ₹{a.value.toLocaleString()}
                                      </td>
                                      <td className="p-4 text-right font-mono font-semibold">
                                        <span className={`inline-flex items-center gap-0.5 ${pl >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                                          {pl >= 0 ? "+" : ""}₹{pl.toLocaleString()} ({plPct.toFixed(1)}%)
                                        </span>
                                      </td>
                                      <td className="p-4 text-center">
                                        <button
                                          onClick={() => handleDeleteAsset(a.id)}
                                          className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB CONTENT: ADVANCED REPORTS OVERLAPS */}
                  {advancedTab === "overlaps" && (
                    <div className="animate-fadeIn">
                      <AdvancedReports assets={assets} targetRisk={targetRisk} />
                    </div>
                  )}

                  {/* TAB CONTENT: STRATEGIC REBALANCER */}
                  {advancedTab === "rebalance" && (
                    <div className="animate-fadeIn">
                      <InvestmentsCenter assets={assets} onAddPositionClick={() => setAdvancedTab("positions")} />
                    </div>
                  )}

                  {/* TAB CONTENT: WEALTH ACADEMY */}
                  {advancedTab === "academy" && (
                    <div className="animate-fadeIn">
                      <LearnCenter />
                    </div>
                  )}

                  {/* TAB CONTENT: WEALTH MILESTONES */}
                  {advancedTab === "milestones" && (
                    <div className="flex flex-col gap-6 animate-fadeIn">
                      
                      {/* Create goal action */}
                      <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs uppercase">Target wealth Milestones</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Maintain active deposits to track milestone forecasts</p>
                        </div>
                        <button
                          onClick={() => setShowAddGoal(!showAddGoal)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Create Goal
                        </button>
                      </div>

                      {showAddGoal && (
                        <form onSubmit={handleAddGoal} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 animate-fadeIn">
                          <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
                            <h4 className="font-bold text-xs text-slate-700 uppercase">Create Goal parameters</h4>
                            <button type="button" onClick={() => setShowAddGoal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                              <label htmlFor="form-goal-name" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Goal Name</label>
                              <input
                                type="text"
                                id="form-goal-name"
                                placeholder="e.g. Secure Retirement Fund"
                                value={newGoal.name}
                                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-hidden"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="form-goal-target" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Target Amount (₹)</label>
                              <input
                                type="number"
                                id="form-goal-target"
                                value={newGoal.targetAmount}
                                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-hidden"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="form-goal-current" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Current Saved balance (₹)</label>
                              <input
                                type="number"
                                id="form-goal-current"
                                value={newGoal.currentAmount}
                                onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-hidden"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="form-goal-years" className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Timeline Target (Years)</label>
                              <input
                                type="number"
                                id="form-goal-years"
                                value={newGoal.deadlineYears}
                                onChange={(e) => setNewGoal({ ...newGoal, deadlineYears: Number(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-hidden"
                                required
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="self-end px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                          >
                            + Append Goal
                          </button>
                        </form>
                      )}

                      {/* Goal list Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {goals.map((g) => {
                          const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
                          return (
                            <div key={g.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs flex flex-col gap-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-sm font-bold text-slate-800 block">{g.name}</strong>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 block">{g.deadlineYears} years remaining</span>
                                </div>
                                <button
                                  onClick={() => setGoals(goals.filter(item => item.id !== g.id))}
                                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg"
                                >
                                  ✕
                                </button>
                              </div>

                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between font-mono text-[11px] text-slate-500">
                                  <span>Progress Rate</span>
                                  <span className="font-bold text-blue-600">{pct.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>

                              <div className="border-t border-slate-50 pt-3 flex flex-col gap-1.5">
                                <label htmlFor={`slider-${g.id}`} className="text-[10px] font-bold text-slate-400 uppercase block">Adjust balance manually:</label>
                                <input
                                  id={`slider-${g.id}`}
                                  type="range"
                                  min="0"
                                  max={g.targetAmount}
                                  value={g.currentAmount}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setGoals(goals.map(item => item.id === g.id ? { ...item, currentAmount: val } : item));
                                  }}
                                  className="w-full accent-blue-600 cursor-pointer"
                                />
                                <div className="flex justify-between font-mono text-[10px] text-slate-400 mt-1">
                                  <span>₹0</span>
                                  <span className="font-bold text-slate-700">₹{g.currentAmount.toLocaleString()} saved</span>
                                  <span>₹{g.targetAmount.toLocaleString()} target</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* ==================== VIEW: AGENTIC AI WORKSPACE ==================== */}
          {activeTab === "Agentic AI" && (
            <div className="animate-fadeIn flex flex-col gap-6" id="view-agentic">
              <AgenticAIWorkspace 
                assets={assets} 
                onUpdateAssets={setAssets} 
                targetRisk={targetRisk}
                onTriggerAnalysis={runPortfolioAnalysis}
              />
            </div>
          )}

          {/* ==================== VIEW: PROFILE & SETTINGS ==================== */}
          {activeTab === "Profile & Settings" && (
            <div className="flex flex-col gap-6 animate-fadeIn" id="view-profile">
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col gap-4">
                <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight font-display uppercase text-slate-400">
                    Security & Integration Settings
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Interactive Cohort Email</span>
                    <strong className="text-xs font-bold text-slate-700 block mt-1">{userEmail}</strong>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Risk Strategy Cohort</span>
                    <strong className="text-xs font-bold text-blue-700 block mt-1 uppercase">{targetRisk} Risk Model Active</strong>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 border border-blue-50 rounded-xl flex items-start gap-2.5 text-xs">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-blue-950 font-bold block">Telemetry Diagnostic Framework</strong>
                    <p className="text-slate-700 leading-relaxed mt-0.5">
                      Your asset calculations are processed on-the-fly and synced to your browser's private local storage. Under SEBI read-only guidelines, no order credentials can ever be modified or stored.
                    </p>
                  </div>
                </div>

                {/* Reset Buttons */}
                <div className="border-t border-slate-100 pt-5 mt-2 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Want to test the UPI Broker Aggregator Onboarding Flow again?</span>
                  <button
                    onClick={handleLogoutReset}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset & Clear Demat Syncs
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Floating conversational assistant widget available on every screen */}
      <AIConversationalWidget assets={assets} targetRisk={targetRisk} isFloating={true} />

    </div>
  );
}
