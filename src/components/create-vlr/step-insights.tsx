"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { VlrChatBox } from "./vlr-chat-box";
import { LoadingOverlay } from "./loading-overlay";
import {
  insightSections,
  step2LoadingMessages,
  step2ChatResponses,
  type ChatMessage,
  type InsightSection,
} from "@/data/create-vlr";

type StepInsightsProps = {
  onNext: () => void;
};

type SectionState = {
  isExcluded: boolean;
  isRefined: boolean;
};

const CHART_COLORS = ["#0ea5e9", "#a855f7", "#22c55e", "#f59e0b", "#ef4444"];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "0.75rem",
    border: "1px solid #e2e8f0",
    padding: "0.75rem 1rem",
    boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
  },
  labelStyle: {
    color: "#334155",
    fontWeight: 600,
    marginBottom: "0.25rem",
  },
};

function renderChart(section: InsightSection) {
  const { chartType, chartData } = section;

  switch (chartType) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={Object.keys(chartData[0])[0]}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {Object.keys(chartData[0])
              .slice(1)
              .map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
          </BarChart>
        </ResponsiveContainer>
      );

    case "line":
      return (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={Object.keys(chartData[0])[0]}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {Object.keys(chartData[0])
              .slice(1)
              .map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS[index % CHART_COLORS.length], r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {Object.keys(chartData[0])
                .slice(1)
                .map((key, index) => (
                  <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS[index % CHART_COLORS.length]}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS[index % CHART_COLORS.length]}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={Object.keys(chartData[0])[0]}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {Object.keys(chartData[0])
              .slice(1)
              .map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  fill={`url(#gradient-${key})`}
                />
              ))}
          </AreaChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              dataKey="allocation"
              nameKey="category"
              label={({ category, allocation }) => `${category}: ${allocation}%`}
              labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    (entry as { color?: string }).color ||
                    CHART_COLORS[index % CHART_COLORS.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
}

export function StepInsights({ onNext }: StepInsightsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>(insightSections[0].id);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sectionStates, setSectionStates] = useState<Record<string, SectionState>>({});
  const [messageCountPerSection, setMessageCountPerSection] = useState<Record<string, number>>({});
  const [isRefiningText, setIsRefiningText] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleSelectSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    setChatMessages([]);
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!activeSection) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => [...prev, userMessage]);

      // Check if this is an executive summary request
      const isExecutiveRequest =
        content.toLowerCase().includes("executive") ||
        content.toLowerCase().includes("summary") ||
        content.toLowerCase().includes("summarize");

      // Check if this is a refine request
      const isRefineRequest =
        content.toLowerCase().includes("refine") ||
        content.toLowerCase().includes("update") ||
        content.toLowerCase().includes("shorten") ||
        content.toLowerCase().includes("rewrite") ||
        isExecutiveRequest;

      // Start refining animation if it's a refine request
      if (isRefineRequest) {
        setIsRefiningText(true);
      }

      setTimeout(() => {
        const currentCount = messageCountPerSection[activeSection] || 0;
        const responses = step2ChatResponses[activeSection] || {};
        const responseIndex = Math.min(currentCount, Object.keys(responses).length - 1);

        let responseText: string;
        if (isRefineRequest) {
          responseText = isExecutiveRequest
            ? "Creating an executive summary. Condensing to key metrics and action items..."
            : "I'm refining the narrative text now. This will make it more concise while preserving the key insights...";
        } else {
          responseText = responses[responseIndex] || "Noted. I'll incorporate your feedback into the report.";
        }

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: responseText,
          timestamp: new Date().toLocaleTimeString(),
        };

        setChatMessages((prev) => [...prev, assistantMessage]);
        setMessageCountPerSection((prev) => ({
          ...prev,
          [activeSection]: currentCount + 1,
        }));

        if (responseText.toLowerCase().includes("exclude")) {
          setSectionStates((prev) => ({
            ...prev,
            [activeSection]: { ...prev[activeSection], isExcluded: true },
          }));
        }

        // Handle refine completion after additional delay
        if (isRefineRequest) {
          setTimeout(() => {
            setIsRefiningText(false);
            setSectionStates((prev) => ({
              ...prev,
              [activeSection]: { ...prev[activeSection], isRefined: true },
            }));

            // Add completion message
            const completionMessage: ChatMessage = {
              id: `assistant-complete-${Date.now()}`,
              role: "assistant",
              content: isExecutiveRequest
                ? "Done! Executive summary generated with key metrics and required actions."
                : "Done! The narrative has been refined and shortened. The updated text is now displayed.",
              timestamp: new Date().toLocaleTimeString(),
            };
            setChatMessages((prev) => [...prev, completionMessage]);
          }, 2000);
        }
      }, 1000);
    },
    [activeSection, messageCountPerSection]
  );

  const currentSection = insightSections.find((s) => s.id === activeSection);
  const currentState = sectionStates[activeSection];
  const includedSections = insightSections.filter(
    (s) => !sectionStates[s.id]?.isExcluded
  );

  if (isLoading) {
    return (
      <LoadingOverlay
        messages={step2LoadingMessages}
        duration={5000}
        onComplete={handleLoadingComplete}
        isActive={isLoading}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-800">
          Review VLR Insights
        </h2>
        <p className="mt-2 text-slate-500">
          Select a section from the menu to review and use the chat to request adjustments.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left Menu */}
        <div className="w-72 shrink-0">
          <div className="sticky top-24 space-y-2">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              VLR Sections
            </h3>
            {insightSections.map((section) => {
              const state = sectionStates[section.id];
              const isActive = activeSection === section.id;
              const isExcluded = state?.isExcluded;
              const isRefined = state?.isRefined;

              return (
                <button
                  key={section.id}
                  onClick={() => handleSelectSection(section.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    isExcluded
                      ? "border-dashed border-slate-300 bg-slate-50 opacity-50"
                      : isActive
                      ? "border-sky-200 bg-sky-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                        isExcluded
                          ? "bg-slate-200 text-slate-400"
                          : isActive
                          ? "bg-sky-100 text-sky-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium leading-tight ${
                          isExcluded
                            ? "text-slate-400 line-through"
                            : isActive
                            ? "text-sky-700"
                            : "text-slate-700"
                        }`}
                      >
                        {section.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {isExcluded && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <XCircle className="h-3 w-3" />
                            Excluded
                          </span>
                        )}
                        {isRefined && !isExcluded && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" />
                            Refined
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Report Status
              </h4>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Included</span>
                  <span className="font-medium text-slate-700">
                    {includedSections.length} / {insightSections.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Refined</span>
                  <span className="font-medium text-emerald-600">
                    {Object.values(sectionStates).filter((s) => s.isRefined).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {currentSection && (
              <motion.div
                key={currentSection.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {currentSection.title}
                  </h3>
                  {currentState?.isRefined && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      Refined
                    </span>
                  )}
                  {currentState?.isExcluded && (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      Excluded from report
                    </span>
                  )}
                </div>

                <div className="mb-6 rounded-xl bg-slate-50 p-4">
                  {renderChart(currentSection)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Narrative for VLR
                    </h4>
                    {isRefiningText && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-sky-600"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-xs font-medium">Refining...</span>
                      </motion.div>
                    )}
                  </div>
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {isRefiningText ? (
                        <motion.div
                          key="refining"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0.4 }}
                          exit={{ opacity: 0 }}
                          className="space-y-2"
                        >
                          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                          <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />
                          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                          <div className="h-4 w-10/12 animate-pulse rounded bg-slate-200" />
                          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                          <div className="h-4 w-9/12 animate-pulse rounded bg-slate-200" />
                        </motion.div>
                      ) : (
                        <motion.p
                          key={currentState?.isRefined ? "refined" : "original"}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600"
                        >
                          {currentState?.isRefined && currentSection.narrativeRefined
                            ? currentSection.narrativeRefined
                            : currentSection.narrative}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Chat Sidebar */}
        <div className="w-80 shrink-0">
          <div className="sticky top-24">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-500" />
              <h3 className="text-sm font-medium text-slate-700">
                Section Assistant
              </h3>
            </div>

            {/* Quick Actions */}
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                onClick={() => handleSendMessage("Exclude this section from the report")}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
              >
                Exclude section
              </button>
              <button
                onClick={() => handleSendMessage("Please refine and shorten the narrative")}
                className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-600 transition hover:bg-sky-100"
              >
                Refine text
              </button>
              <button
                onClick={() => handleSendMessage("Why is this data significant?")}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Explain data
              </button>
              <button
                onClick={() => handleSendMessage("Add more context about the trends")}
                className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-600 transition hover:bg-purple-100"
              >
                Add context
              </button>
            </div>

            <div className="h-[400px]">
              <VlrChatBox
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                placeholder="Ask about this section..."
                compact
              />
            </div>

            <button
              onClick={onNext}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-medium text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 hover:shadow-sky-500/30"
            >
              Generate VLR
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
