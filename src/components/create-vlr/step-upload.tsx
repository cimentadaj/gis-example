"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Database, Sparkles } from "lucide-react";
import { FileDropzone } from "./file-dropzone";
import { SdgDataTable, type ColumnKey } from "./sdg-data-table";
import { VlrChatBox } from "./vlr-chat-box";
import { LoadingOverlay } from "./loading-overlay";
import {
  sdgUnifiedData,
  step1LoadingMessages,
  type ChatMessage,
} from "@/data/create-vlr";

type StepUploadProps = {
  onNext: () => void;
};

// Column name mappings for detection
const columnKeywords: Record<string, ColumnKey> = {
  "sdg": "sdgGoal",
  "goal": "sdgGoal",
  "indicator": "indicatorName",
  "district": "district",
  "year": "year",
  "value": "value",
  "target": "target",
  "progress": "progress",
  "source": "dataSource",
  "data source": "dataSource",
  "confidence": "confidence",
};

const columnDisplayNames: Record<ColumnKey, string> = {
  sdgGoal: "SDG Goal",
  indicatorName: "Indicator Name",
  district: "District",
  year: "Year",
  value: "Value",
  target: "Target",
  progress: "Progress",
  dataSource: "Data Source",
  confidence: "Confidence",
};

export function StepUpload({ onNext }: StepUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [markedColumns, setMarkedColumns] = useState<ColumnKey[]>([]);

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(files);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleStartVlr = useCallback(() => {
    if (selectedFiles.length === 0) return;
    setIsLoading(true);
  }, [selectedFiles.length]);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    setShowData(true);
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => [...prev, userMessage]);

      setTimeout(() => {
        const lowerContent = content.toLowerCase();
        const isRemoveRequest =
          lowerContent.includes("remove") || lowerContent.includes("delete");

        // Detect which column is being referenced
        let detectedColumn: ColumnKey | null = null;
        for (const [keyword, columnKey] of Object.entries(columnKeywords)) {
          if (lowerContent.includes(keyword)) {
            detectedColumn = columnKey;
            break;
          }
        }

        let responseText: string;

        if (isRemoveRequest && detectedColumn) {
          // Mark the column for removal
          setMarkedColumns((prev) => {
            if (!prev.includes(detectedColumn!)) {
              return [...prev, detectedColumn!];
            }
            return prev;
          });
          responseText = `Got it! I've marked the "${columnDisplayNames[detectedColumn]}" column for removal. It will be excluded from the final VLR analysis.`;
        } else if (detectedColumn) {
          responseText = `I understand you want to modify the "${columnDisplayNames[detectedColumn]}" column. Could you specify what changes you'd like to make?`;
        } else if (isRemoveRequest) {
          responseText = "Which column would you like me to remove? You can mention columns like District, Year, Target, Confidence, or Data Source.";
        } else {
          responseText = "Got it, I'll make that adjustment to the unified data. The changes will be reflected in the VLR analysis.";
        }

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: responseText,
          timestamp: new Date().toLocaleTimeString(),
        };

        setChatMessages((prev) => [...prev, assistantMessage]);
      }, 800);
    },
    []
  );

  return (
    <div className="space-y-6">
      <LoadingOverlay
        messages={step1LoadingMessages}
        duration={5000}
        onComplete={handleLoadingComplete}
        isActive={isLoading}
      />

      {!showData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-800">
              Upload Your Data
            </h2>
            <p className="mt-2 text-slate-500">
              Add your SDG indicator files to begin creating your Voluntary
              Local Review
            </p>
          </div>

          <FileDropzone
            onFilesSelected={handleFilesSelected}
            selectedFiles={selectedFiles}
            onRemoveFile={handleRemoveFile}
          />

          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button
                onClick={handleStartVlr}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-medium text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 hover:shadow-sky-500/30"
              >
                <Database className="h-5 w-5" />
                Start Data Unification
              </button>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-800">
              Unified SDG Database
            </h2>
            <p className="mt-2 text-slate-500">
              Your data has been cleaned and unified. Review the results and
              make any adjustments using the assistant.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
            <div className="grid grid-cols-6 items-center">
              <h3 className="text-sm font-medium text-slate-700">
                Data Summary
              </h3>
              <div className="text-center">
                <span className="text-2xl font-semibold text-slate-700">
                  {sdgUnifiedData.length}
                </span>
                <p className="text-xs text-slate-500">Records</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-slate-700">
                  {new Set(sdgUnifiedData.map((r) => r.sdgGoal)).size}
                </span>
                <p className="text-xs text-slate-500">SDG Goals</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-slate-700">
                  {new Set(sdgUnifiedData.map((r) => r.district)).size}
                </span>
                <p className="text-xs text-slate-500">Districts</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-slate-700">
                  {new Set(sdgUnifiedData.map((r) => r.dataSource)).size}
                </span>
                <p className="text-xs text-slate-500">Sources</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-emerald-600">
                  {Math.round(
                    sdgUnifiedData.reduce(
                      (acc, r) => acc + r.progressPercent,
                      0
                    ) / sdgUnifiedData.length
                  )}
                  %
                </span>
                <p className="text-xs text-slate-500">Avg. Progress</p>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <SdgDataTable
                data={sdgUnifiedData}
                visibleRows={10}
                markedColumns={markedColumns}
              />
            </div>

            <div className="w-80 shrink-0">
              <div className="sticky top-24">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  <h3 className="text-sm font-medium text-slate-700">
                    Data Assistant
                  </h3>
                </div>
                <div className="h-[400px]">
                  <VlrChatBox
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    placeholder="Request changes to the data..."
                    compact
                  />
                </div>

                <button
                  onClick={onNext}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-medium text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-600 hover:shadow-sky-500/30"
                >
                  Start VLR Creation
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
