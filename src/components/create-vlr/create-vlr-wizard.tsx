"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Sparkles, FileCheck } from "lucide-react";
import { StepUpload } from "./step-upload";
import { StepInsights } from "./step-insights";
import { StepGeneration } from "./step-generation";

type WizardStep = "upload" | "insights" | "generation";

const steps: Array<{
  id: WizardStep;
  label: string;
  icon: typeof Upload;
}> = [
  { id: "upload", label: "Upload Data", icon: Upload },
  { id: "insights", label: "Review Insights", icon: Sparkles },
  { id: "generation", label: "Generate VLR", icon: FileCheck },
];

export function CreateVlrWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("upload");

  const handleNextStep = useCallback(() => {
    if (currentStep === "upload") {
      setCurrentStep("insights");
    } else if (currentStep === "insights") {
      setCurrentStep("generation");
    }
  }, [currentStep]);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      backgroundColor: isActive
                        ? "#0ea5e9"
                        : isCompleted
                        ? "#22c55e"
                        : "#f1f5f9",
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      isActive || isCompleted
                        ? "text-white"
                        : "text-slate-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <span
                    className={`hidden text-sm font-medium sm:block ${
                      isActive
                        ? "text-slate-800"
                        : isCompleted
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-3 h-0.5 w-8 rounded-full sm:w-16 ${
                      index < currentStepIndex ? "bg-emerald-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep === "upload" && <StepUpload onNext={handleNextStep} />}
        {currentStep === "insights" && <StepInsights onNext={handleNextStep} />}
        {currentStep === "generation" && <StepGeneration />}
      </motion.div>
    </div>
  );
}
