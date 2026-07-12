import React, { useState } from "react";
import { HelpCircle, Search, BookOpen, ChevronRight, BookOpenCheck, ArrowRightLeft } from "lucide-react";

interface Term {
  title: string;
  category: "Fundamentals" | "Tax & Costs" | "Vehicles" | "Advanced";
  shortDesc: string;
  detailedDesc: string;
  tip: string;
}

const LEARN_TERMS: Term[] = [
  {
    title: "Asset Allocation",
    category: "Fundamentals",
    shortDesc: "Spreading your investments among stocks, bonds, cash, and real estate to balance risk and reward.",
    detailedDesc: "Asset allocation is the most critical decision you'll make in your investment life. Academic studies show that over 90% of a portfolio's return variability over time is determined by its asset allocation, rather than the selection of individual stocks or timing of the market.",
    tip: "Match your asset allocation to your investment timeline. If you don't need the money for 10+ years, you can afford to hold a higher stock percentage."
  },
  {
    title: "Expense Ratio",
    category: "Tax & Costs",
    shortDesc: "The annual fee that mutual funds or ETFs charge shareholders, expressed as a percentage of assets.",
    detailedDesc: "An expense ratio of 0.50% means ₹5 is taken out of every ₹1,000 you have invested annually. While it sounds small, high expense ratios drag compounding yields significantly over 20-30 years.",
    tip: "Look for expense ratios below 0.10% for index funds. Avoid managed funds charging over 0.75% unless they have consistently beat the market long-term."
  },
  {
    title: "REIT (Real Estate Investment Trust)",
    category: "Vehicles",
    shortDesc: "Companies that own, operate, or finance income-producing commercial and residential properties.",
    detailedDesc: "REITs trade on major stock exchanges just like normal stocks. By law, REITs must distribute at least 90% of their taxable income to shareholders as dividend payments, making them popular for income investors.",
    tip: "REIT dividends are usually taxed as ordinary income, so it's often more tax-efficient to hold REITs in a retirement account like an IRA."
  },
  {
    title: "Compound Interest",
    category: "Fundamentals",
    shortDesc: "The process of earning interest on your initial investment plus all previously accumulated earnings.",
    detailedDesc: "Albert Einstein famously called compound interest the 'eighth wonder of the world.' It starts slow, but as years pass, your returns generate returns of their own, creating an exponential curve of wealth.",
    tip: "Start as early as possible. Investing ₹2,000 a month starting at age 20 creates twice as much retirement wealth as investing ₹4,000 a month starting at age 35!"
  },
  {
    title: "Tax-Loss Harvesting",
    category: "Tax & Costs",
    shortDesc: "Selling investments that have lost value to offset the capital gains tax you owe on profitable sales.",
    detailedDesc: "When you sell a losing investment, you 'realize' a loss. This loss can be used to cancel out capital gains you made in other areas. If your losses exceed your gains, you can even use up to ₹1,50,000 to offset ordinary income tax.",
    tip: "Be careful of the 'Wash-Sale Rule'. You cannot buy the exact same investment within 30 days of selling it for a tax loss, or the tax benefit is disallowed."
  },
  {
    title: "Dollar-Cost Average (DCA)",
    category: "Fundamentals",
    shortDesc: "Investing a fixed dollar amount on a regular, consistent schedule, regardless of whether prices are up or down.",
    detailedDesc: "DCA removes emotion from investing. When market prices fall, your fixed contribution naturally buys more shares. When prices rise, your contribution buys fewer shares. Over time, this lowers your average price per share.",
    tip: "Automate your investing! Set your account to invest ₹5,000 every single payday to leverage the power of DCA effortlessly."
  },
  {
    title: "Beta (Risk Coefficient)",
    category: "Advanced",
    shortDesc: "A measure of how volatile a stock or portfolio is compared to the overall market.",
    detailedDesc: "The overall market has a Beta of 1.0. A stock with a Beta of 1.3 is 30% more volatile than the market, typically rising faster in good times but dropping harder in downturns. A Beta of 0.8 is more stable than the market.",
    tip: "If you're approaching retirement, look for low-beta assets (like high-yield bond ETFs or blue-chip consumer stocks) to insulate your nest egg."
  }
];

export const LearnCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(LEARN_TERMS[0]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredTerms = LEARN_TERMS.filter((term) => {
    const matchesSearch = term.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          term.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || term.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col h-full animate-fadeIn" id="learn-module">
      <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight font-display flex items-center gap-2">
            <BookOpenCheck className="w-4.5 h-4.5 text-blue-600" />
            Plain-English Wealth Academy
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Financial terms simplified. Empowering you to make confident asset choices.
          </p>
        </div>

        {/* Categories selection pills */}
        <div className="flex flex-wrap gap-1">
          {["All", "Fundamentals", "Tax & Costs", "Vehicles", "Advanced"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                activeCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left column: List of terms with search */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search investment terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
            />
          </div>

          <div className="max-h-[340px] overflow-y-auto flex flex-col gap-1.5 pr-1" role="listbox">
            {filteredTerms.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No simplified terms match your search.
              </div>
            ) : (
              filteredTerms.map((term) => (
                <button
                  key={term.title}
                  onClick={() => setSelectedTerm(term)}
                  className={`flex items-center justify-between text-left p-3 rounded-xl border transition-all ${
                    selectedTerm?.title === term.title
                      ? "border-blue-500 bg-blue-50/20 text-blue-700 shadow-2xs"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 text-slate-700"
                  }`}
                  role="option"
                  aria-selected={selectedTerm?.title === term.title}
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-xs block text-slate-800">
                      {term.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold truncate block mt-0.5">
                      {term.shortDesc}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right column: Selected term detail sheet */}
        <div className="md:col-span-7">
          {selectedTerm ? (
            <div className="bg-slate-50/55 border border-slate-150 rounded-2xl p-5 flex flex-col gap-4 animate-fadeIn">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {selectedTerm.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2 font-display">
                    {selectedTerm.title}
                  </h4>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Concept Definition</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {selectedTerm.shortDesc}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Deep-Dive Breakdown</span>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {selectedTerm.detailedDesc}
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-3.5 rounded-r-xl">
                <span className="text-[9px] font-extrabold text-blue-700 uppercase tracking-widest block mb-1">Pro Wealth Action Tip</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {selectedTerm.tip}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Select any term from the list to view its plain-English summary.
            </div>
          )}
        </div>
      </div>

      {/* Comparison Grid card */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
          Core Comparison Matrix
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="border border-slate-100 hover:border-slate-200 rounded-xl p-3 bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ETFs vs Mutual Funds</span>
            <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5">
              ETFs trade live throughout the day like stocks and usually have lower fees. Mutual funds price once at 4 PM, require minimums, and are often active.
            </p>
          </div>
          <div className="border border-slate-100 hover:border-slate-200 rounded-xl p-3 bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stocks vs bonds</span>
            <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5">
              Stocks represent direct equity ownership and have high growth potential but high risk. Bonds are loans to governments/corps earning fixed interest yield.
            </p>
          </div>
          <div className="border border-slate-100 hover:border-slate-200 rounded-xl p-3 bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">REITs vs physical real estate</span>
            <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5">
              REITs can be bought or sold instantly on brokers with ₹1,000, paying liquid dividends. Physical housing requires large downpayments and high maintenance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
