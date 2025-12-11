"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  FileText,
  LayoutDashboard,
  Calendar,
  FileBarChart,
  BookOpen,
} from "lucide-react";
import { LoadingOverlay } from "./loading-overlay";
import { step3LoadingMessages, vlrFinalMetadata } from "@/data/create-vlr";

export function StepGeneration() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <LoadingOverlay
        messages={step3LoadingMessages}
        duration={7000}
        onComplete={handleLoadingComplete}
        isActive={isLoading}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl space-y-8"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-slate-800">
          VLR Successfully Generated
        </h2>
        <p className="mt-2 text-slate-500">
          Your Voluntary Local Review report is ready for download and review.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <FileText className="h-7 w-7 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800">
              {vlrFinalMetadata.filename}
            </h3>
            <p className="text-sm text-slate-500">
              {vlrFinalMetadata.fileSize} &bull; Generated{" "}
              {vlrFinalMetadata.generatedAt}
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600">
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Sections
              </span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-slate-700">
              {vlrFinalMetadata.sections}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <FileBarChart className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Charts
              </span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-slate-700">
              {vlrFinalMetadata.charts}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Pages
              </span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-slate-700">
              {vlrFinalMetadata.pages}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl border border-sky-200 bg-sky-50 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
            <LayoutDashboard className="h-6 w-6 text-sky-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800">
              Explore Your VLR Dashboard
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              View interactive visualizations, track progress against SDG
              targets, and explore policy insights in your personalized
              dashboard.
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-medium text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 hover:shadow-sky-500/30"
        >
          <LayoutDashboard className="h-5 w-5" />
          Go to VLR Dashboard
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-sm text-slate-400"
      >
        Need to make changes?{" "}
        <button
          onClick={() => window.location.reload()}
          className="text-sky-500 hover:underline"
        >
          Start a new VLR
        </button>
      </motion.p>
    </motion.div>
  );
}
