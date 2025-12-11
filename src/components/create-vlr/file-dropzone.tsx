"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, X, Check } from "lucide-react";

type FileDropzoneProps = {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
};

export function FileDropzone({
  onFilesSelected,
  selectedFiles,
  onRemoveFile,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.name.endsWith(".csv") ||
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls")
      );
      if (files.length > 0) {
        onFilesSelected([...selectedFiles, ...files]);
      }
    },
    [onFilesSelected, selectedFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected([...selectedFiles, ...files]);
      }
      e.target.value = "";
    },
    [onFilesSelected, selectedFiles]
  );

  return (
    <div className="space-y-4">
      <motion.label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragOver ? "#0ea5e9" : "#cbd5e1",
          backgroundColor: isDragOver ? "rgba(14, 165, 233, 0.05)" : "rgba(248, 250, 252, 0.8)",
        }}
        transition={{ duration: 0.2 }}
        className="relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-6 py-16 backdrop-blur transition-shadow hover:shadow-lg"
      >
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />

        <motion.div
          animate={{
            scale: isDragOver ? 1.1 : 1,
            rotate: isDragOver ? 5 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 shadow-sm"
        >
          <Upload className="h-8 w-8 text-sky-600" />
        </motion.div>

        <div className="text-center">
          <p className="text-lg font-medium text-slate-700">
            {isDragOver ? "Drop files here" : "Drag & drop your data files"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            or click to browse your computer
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            .csv
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            .xlsx
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            .xls
          </span>
        </div>

        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 rounded-3xl bg-sky-500/5"
          />
        )}
      </motion.label>

      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-700">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <Check className="h-3.5 w-3.5" />
              Ready to process
            </div>
          </div>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-slate-600">{file.name}</span>
                  <span className="text-xs text-slate-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveFile(index);
                  }}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
