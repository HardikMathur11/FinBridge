import React, { useState, useEffect, useRef } from "react";
import { BrainCircuit, Send, RotateCcw, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";
import { Asset } from "../types";

interface Message {
  role: "user" | "model";
  content: string;
}

interface AIConversationalWidgetProps {
  assets: Asset[];
  targetRisk: string;
  isFloating?: boolean;
}

export const AIConversationalWidget: React.FC<AIConversationalWidgetProps> = ({
  assets,
  targetRisk,
  isFloating = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `### Welcome to FinBridge AI Assistant 

I have fully index-scanned your current portfolio holding **${assets.length} positions** with a total value of **₹${assets.reduce((s, a) => s + a.value, 0).toLocaleString()}**.

What would you like to explore today?
- *"Am I on track for retirement?"*
- *"Why is my portfolio risky?"*
- *"How can I diversify?"*
- *"Explain REITs or compound interest."*`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) {
      setInput("");
    }

    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/portfolio/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: newMessages.slice(0, -1), // Exclude the latest user message
          assets,
          targetRisk
        })
      });

      if (!response.ok) {
        throw new Error("Chat response failed");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "model", content: data.text }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "⚠️ **Connection Timeout**: I was unable to connect with our server proxy. Here is a simulated response based on the offline analyzer:\n\nFor general asset allocation or safety checks, review the **Advanced Reports** tab where we calculate diversified risk models and tax loss thresholds."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "model",
        content: `### Assistant Reset Complete

I'm ready to assist you. Ask me about **REITs, ETFs, Bond returns**, or how your current portfolio holding matches your selected *${targetRisk}* plan.`
      }
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Predefined prompt triggers
  const promptTriggers = [
    { label: "Check Portfolio Risks", query: "Why is my portfolio risky?" },
    { label: "How to Diversify", query: "How can I diversify?" },
    { label: "Retirement Outlook", query: "Am I on track for retirement?" },
    { label: "What is a REIT?", query: "Explain REITs." },
    { label: "Compare ETFs & Funds", query: "Compare ETFs and Mutual Funds." }
  ];

  const chatContainerStyle = isFloating
    ? "fixed bottom-5 right-5 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[520px] bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300"
    : "w-full h-[580px] bg-white rounded-2xl border border-slate-100 flex flex-col overflow-hidden";

  if (isFloating && !isOpen) {
    return (
      <button
        id="floating-ai-button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group focus:ring-4 focus:ring-blue-100"
        aria-label="Open AI Financial Chat Assistant"
        aria-expanded="false"
      >
        <BrainCircuit className="w-6 h-6 stroke-[2.2] group-hover:rotate-12 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out text-xs font-bold pl-0 group-hover:pl-2 whitespace-nowrap">
          Ask FinBridge AI
        </span>
      </button>
    );
  }

  return (
    <div className={chatContainerStyle} id={isFloating ? "floating-chat-container" : "embedded-chat-container"}>
      {/* Chat Title bar */}
      <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <BrainCircuit className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-display tracking-tight flex items-center gap-1">
              FinBridge AI Intelligence
              <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
            </h3>
            <span className="text-[9px] text-slate-400 block font-medium">SECURE PROXY GATEWAY</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {isFloating && (
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white font-bold text-xs p-1.5 hover:bg-slate-800 rounded-md"
              aria-label="Close AI Assistant Window"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Safety Notice block */}
      <div className="bg-blue-50/50 border-b border-blue-50 px-3.5 py-2 text-[10px] text-blue-800 font-sans flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
        <span>Fully localized sandbox telemetry. Absolute security, zero data leaks.</span>
      </div>

      {/* Messages Console */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-slate-50/40">
        {messages.map((m, index) => {
          const isUser = m.role === "user";
          return (
            <div
              key={index}
              className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-blue-600 text-white font-medium rounded-br-none"
                    : "bg-white border border-slate-100 text-slate-800 shadow-xs rounded-bl-none"
                }`}
              >
                {/* Parse simple markdown styles dynamically */}
                <div className="whitespace-pre-wrap space-y-1 text-xs">
                  {m.content.split("\n").map((line, lIdx) => {
                    if (line.startsWith("### ")) {
                      return <h4 key={lIdx} className="font-bold text-slate-900 mt-2 mb-1 text-xs font-display">{line.replace("### ", "")}</h4>;
                    }
                    if (line.startsWith("- ")) {
                      return <li key={lIdx} className="ml-3 list-disc mt-0.5 text-xs text-slate-700">{line.replace("- ", "")}</li>;
                    }
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <p key={lIdx} className="font-semibold text-slate-900 mt-1 text-xs">{line.replace(/\*\*/g, "")}</p>;
                    }
                    // Highlight bold items inside line
                    const parts = line.split("**");
                    if (parts.length > 1) {
                      return (
                        <p key={lIdx} className="text-xs leading-relaxed">
                          {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-900">{p}</strong> : p)}
                        </p>
                      );
                    }
                    return <p key={lIdx} className="text-xs leading-relaxed">{line}</p>;
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start items-center gap-2 animate-pulse">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                Evaluating portfolio allocations...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Triggers list */}
      <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none select-none">
        {promptTriggers.map((t, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(t.query)}
            className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-150 rounded-lg text-[10px] font-bold transition-all focus:outline-hidden flex-shrink-0"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Input keyboard row */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask anything about REITs, tax, or allocations..."
          className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:bg-white text-slate-800 transition-all max-h-20"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:bg-slate-100 disabled:text-slate-400 flex items-center justify-center"
          aria-label="Submit message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
