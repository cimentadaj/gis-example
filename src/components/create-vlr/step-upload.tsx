"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Database, Sparkles, Filter } from "lucide-react";
import { FileDropzone } from "./file-dropzone";
import { SdgDataTable } from "./sdg-data-table";
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

// Available districts in the data
const availableDistricts = [
  "Central District",
  "Northern Zone",
  "Metro Area",
  "Eastern Borough",
  "Western District",
  "Southern Region",
  "Industrial Zone",
  "Rural District",
  "Tech Park",
];

// Keywords to detect district filtering intent
const districtKeywords: Record<string, string> = {
  central: "Central District",
  northern: "Northern Zone",
  north: "Northern Zone",
  metro: "Metro Area",
  eastern: "Eastern Borough",
  east: "Eastern Borough",
  western: "Western District",
  west: "Western District",
  southern: "Southern Region",
  south: "Southern Region",
  industrial: "Industrial Zone",
  rural: "Rural District",
  tech: "Tech Park",
  "tech park": "Tech Park",
};

export function StepUpload({ onNext }: StepUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [filteredDistrict, setFilteredDistrict] = useState<string | null>(null);

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

  const handleClearFilter = useCallback(() => {
    setFilteredDistrict(null);
    const systemMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "Filter cleared. Now showing all districts.",
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages((prev) => [...prev, systemMessage]);
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
        const isFilterRequest =
          lowerContent.includes("filter") ||
          lowerContent.includes("show") ||
          lowerContent.includes("only") ||
          lowerContent.includes("focus");

        const isClearRequest =
          lowerContent.includes("clear") ||
          lowerContent.includes("reset") ||
          lowerContent.includes("all districts") ||
          lowerContent.includes("remove filter");

        // Detect which district is being referenced
        let detectedDistrict: string | null = null;
        for (const [keyword, district] of Object.entries(districtKeywords)) {
          if (lowerContent.includes(keyword)) {
            detectedDistrict = district;
            break;
          }
        }

        let responseText: string;

        if (isClearRequest) {
          setFilteredDistrict(null);
          responseText = "Done! I've cleared the filter. Now showing data from all districts.";
        } else if (isFilterRequest && detectedDistrict) {
          setFilteredDistrict(detectedDistrict);
          const matchingRows = sdgUnifiedData.filter(
            (row) => row.district === detectedDistrict
          ).length;
          responseText = `Got it! I've filtered the data to show only "${detectedDistrict}". Found ${matchingRows} records for this district.`;
        } else if (detectedDistrict) {
          setFilteredDistrict(detectedDistrict);
          const matchingRows = sdgUnifiedData.filter(
            (row) => row.district === detectedDistrict
          ).length;
          responseText = `Filtering data to "${detectedDistrict}". Showing ${matchingRows} records.`;
        } else if (isFilterRequest) {
          responseText = `Which district would you like to filter by? Available districts: ${availableDistricts.join(", ")}.`;
        } else {
          responseText = "Got it, I'll make that adjustment to the data view. You can ask me to filter by a specific district like 'Show only Central District' or 'Filter by Metro Area'.";
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

  // Filter data based on selected district
  const displayData = filteredDistrict
    ? sdgUnifiedData.filter((row) => row.district === filteredDistrict)
    : sdgUnifiedData;

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
              filter by district using the assistant.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
            <div className="grid grid-cols-6 items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-slate-700">
                  Data Summary
                </h3>
                {filteredDistrict && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleClearFilter}
                    className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 hover:bg-sky-200"
                  >
                    <Filter className="h-3 w-3" />
                    {filteredDistrict}
                    <span className="ml-1">×</span>
                  </motion.button>
                )}
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-slate-700">
                  {displayData.length}
                </span>
                <p className="text-xs text-slate-500">Records</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-slate-700">
                  {new Set(displayData.map((r) => r.sdgGoal)).size}
                </span>
                <p className="text-xs text-slate-500">SDG Goals</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-slate-700">
                  {new Set(displayData.map((r) => r.district)).size}
                </span>
                <p className="text-xs text-slate-500">Districts</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-slate-700">
                  {new Set(displayData.map((r) => r.dataSource)).size}
                </span>
                <p className="text-xs text-slate-500">Sources</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-emerald-600">
                  {displayData.length > 0
                    ? Math.round(
                        displayData.reduce(
                          (acc, r) => acc + r.progressPercent,
                          0
                        ) / displayData.length
                      )
                    : 0}
                  %
                </span>
                <p className="text-xs text-slate-500">Avg. Progress</p>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <SdgDataTable data={displayData} visibleRows={10} />
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
                    placeholder="Ask anything..."
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
