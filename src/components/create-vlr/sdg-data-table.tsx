"use client";

import { motion } from "framer-motion";
import type { SdgDataRow } from "@/data/create-vlr";

type SdgDataTableProps = {
  data: SdgDataRow[];
  visibleRows?: number;
};

const confidenceColors: Record<string, string> = {
  High: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-rose-100 text-rose-700",
};

export function SdgDataTable({ data, visibleRows = 10 }: SdgDataTableProps) {
  const visibleData = data.slice(0, visibleRows);
  const hiddenCount = Math.max(0, data.length - visibleRows);

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
          <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
            {data.length} records
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/30">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                SDG Goal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Indicator Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                District
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Year
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Value
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Target
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Progress
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Data Source
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Confidence
              </th>
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
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">
                    {row.sdgGoal}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {row.indicatorName}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  {row.district}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  {row.year}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-slate-700">
                  {row.value.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-500">
                  {row.target.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-sky-500"
                        style={{ width: `${Math.min(row.progressPercent, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {row.progressPercent}%
                    </span>
                  </div>
                </td>
                <td className="max-w-[150px] truncate px-4 py-3 text-xs text-slate-500">
                  {row.dataSource}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      confidenceColors[row.confidence]
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
