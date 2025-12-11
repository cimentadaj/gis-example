"use client";

import { TopBar } from "@/components/layout/top-bar";
import { CreateVlrWizard } from "@/components/create-vlr/create-vlr-wizard";

export default function CreateVlrPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopBar title="Create VLR" />
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-8 sm:px-6 lg:px-12">
        <CreateVlrWizard />
      </main>
    </div>
  );
}
