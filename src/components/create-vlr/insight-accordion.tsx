"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText } from "lucide-react";
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
import type { InsightSection } from "@/data/create-vlr";

type InsightAccordionProps = {
  section: InsightSection;
  isExpanded: boolean;
  onToggle: () => void;
  isRefined?: boolean;
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
        <ResponsiveContainer width="100%" height={280}>
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
        <ResponsiveContainer width="100%" height={280}>
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
        <ResponsiveContainer width="100%" height={280}>
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
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
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

export function InsightAccordion({
  section,
  isExpanded,
  onToggle,
  isRefined = false,
}: InsightAccordionProps) {
  const narrativeText = isRefined && section.narrativeRefined
    ? section.narrativeRefined
    : section.narrative;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-sm">
      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
          isExpanded
            ? "bg-sky-50 border-b border-sky-100"
            : "bg-white hover:bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              isExpanded ? "bg-sky-100 text-sky-600" : "bg-slate-100 text-slate-500"
            }`}
          >
            <FileText className="h-4 w-4" />
          </span>
          <span
            className={`font-medium ${
              isExpanded ? "text-sky-700" : "text-slate-700"
            }`}
          >
            {section.title}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={isExpanded ? "text-sky-500" : "text-slate-400"}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="p-5">
              <div className="mb-6 rounded-xl bg-slate-50 p-4">
                {renderChart(section)}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Narrative for VLR
                </h4>
                <div className="relative">
                  {isRefined && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-2 right-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                    >
                      Refined
                    </motion.div>
                  )}
                  <motion.p
                    key={isRefined ? "refined" : "original"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600"
                  >
                    {narrativeText}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
