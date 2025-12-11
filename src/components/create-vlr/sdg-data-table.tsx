"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SdgDataRow } from "@/data/create-vlr";

export type ColumnKey =
  | "sdgGoal"
  | "indicatorName"
  | "district"
  | "year"
  | "value"
  | "target"
  | "progress"
  | "dataSource"
  | "confidence";

type SdgDataTableProps = {
  data: SdgDataRow[];
  visibleRows?: number;
  markedColumns?: ColumnKey[];
};

const confidenceColors: Record<string, string> = {
  High: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-rose-100 text-rose-700",
};

const columns: Array<{
  key: ColumnKey;
  label: string;
  align: "left" | "right" | "center";
}> = [
  { key: "sdgGoal", label: "SDG Goal", align: "left" },
  { key: "indicatorName", label: "Indicator Name", align: "left" },
  { key: "district", label: "District", align: "left" },
  { key: "year", label: "Year", align: "left" },
  { key: "value", label: "Value", align: "right" },
  { key: "target", label: "Target", align: "right" },
  { key: "progress", label: "Progress", align: "right" },
  { key: "dataSource", label: "Data Source", align: "left" },
  { key: "confidence", label: "Confidence", align: "center" },
];

export function SdgDataTable({
  data,
  visibleRows = 10,
  markedColumns = [],
}: SdgDataTableProps) {
  const visibleData = data.slice(0, visibleRows);
  const hiddenCount = data.length - visibleRows;

  const isMarked = (key: ColumnKey) => markedColumns.includes(key);

  const getHeaderClass = (col: (typeof columns)[0]) => {
    const baseClass = `px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-300`;
    const alignClass =
      col.align === "right"
        ? "text-right"
        : col.align === "center"
        ? "text-center"
        : "text-left";
    const markedClass = isMarked(col.key)
      ? "bg-red-50 text-red-400 line-through"
      : "text-slate-500";
    return `${baseClass} ${alignClass} ${markedClass}`;
  };

  const getCellClass = (key: ColumnKey, baseClass: string) => {
    if (isMarked(key)) {
      return `${baseClass} bg-red-50/50 text-red-300 transition-colors duration-300`;
    }
    return `${baseClass} transition-colors duration-300`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">
            Unified SDG Database
          </h3>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {markedColumns.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600"
                >
                  {markedColumns.length} column{markedColumns.length > 1 ? "s" : ""} marked for removal
                </motion.span>
              )}
            </AnimatePresence>
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
              {data.length} records
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/30">
              {columns.map((col) => (
                <th key={col.key} className={getHeaderClass(col)}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleData.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td
                  className={getCellClass(
                    "sdgGoal",
                    "whitespace-nowrap px-4 py-3"
                  )}
                >
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
                      isMarked("sdgGoal")
                        ? "bg-red-50 text-red-300"
                        : "bg-sky-50 text-sky-700"
                    }`}
                  >
                    {row.sdgGoal}
                  </span>
                </td>
                <td
                  className={getCellClass(
                    "indicatorName",
                    `px-4 py-3 text-sm ${isMarked("indicatorName") ? "text-red-300" : "text-slate-700"}`
                  )}
                >
                  {row.indicatorName}
                </td>
                <td
                  className={getCellClass(
                    "district",
                    `whitespace-nowrap px-4 py-3 text-sm ${isMarked("district") ? "text-red-300" : "text-slate-600"}`
                  )}
                >
                  {row.district}
                </td>
                <td
                  className={getCellClass(
                    "year",
                    `whitespace-nowrap px-4 py-3 text-sm ${isMarked("year") ? "text-red-300" : "text-slate-600"}`
                  )}
                >
                  {row.year}
                </td>
                <td
                  className={getCellClass(
                    "value",
                    `whitespace-nowrap px-4 py-3 text-right text-sm font-medium ${isMarked("value") ? "text-red-300" : "text-slate-700"}`
                  )}
                >
                  {row.value.toLocaleString()}
                </td>
                <td
                  className={getCellClass(
                    "target",
                    `whitespace-nowrap px-4 py-3 text-right text-sm ${isMarked("target") ? "text-red-300" : "text-slate-500"}`
                  )}
                >
                  {row.target.toLocaleString()}
                </td>
                <td
                  className={getCellClass(
                    "progress",
                    "whitespace-nowrap px-4 py-3 text-right"
                  )}
                >
                  <div className="flex items-center justify-end gap-2">
                    <div
                      className={`h-1.5 w-16 overflow-hidden rounded-full ${
                        isMarked("progress") ? "bg-red-100" : "bg-slate-100"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full ${
                          isMarked("progress") ? "bg-red-300" : "bg-sky-500"
                        }`}
                        style={{
                          width: `${Math.min(row.progressPercent, 100)}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isMarked("progress") ? "text-red-300" : "text-slate-600"
                      }`}
                    >
                      {row.progressPercent}%
                    </span>
                  </div>
                </td>
                <td
                  className={getCellClass(
                    "dataSource",
                    `max-w-[150px] truncate px-4 py-3 text-xs ${isMarked("dataSource") ? "text-red-300" : "text-slate-500"}`
                  )}
                >
                  {row.dataSource}
                </td>
                <td
                  className={getCellClass(
                    "confidence",
                    "whitespace-nowrap px-4 py-3 text-center"
                  )}
                >
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      isMarked("confidence")
                        ? "bg-red-50 text-red-300"
                        : confidenceColors[row.confidence]
                    }`}
                  >
                    {row.confidence}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {hiddenCount > 0 && (
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-white to-transparent" />
          <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-center">
            <span className="text-sm text-slate-500">
              +{hiddenCount} more rows in the unified database
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
