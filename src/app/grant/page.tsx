import { Nav } from "@/components/Nav";
import { GrantReportAssistant } from "@/components/GrantReportAssistant";
import {
  evidenceImageExists,
  loadEvidenceRecords,
  loadGrantFinance,
  loadGrantPerformance,
} from "@/lib/data-loader";

// Force dynamic rendering (load data at runtime, not build time)
export const dynamic = 'force-dynamic';

export default function GrantPage() {
  const performance = loadGrantPerformance();
  const finance = loadGrantFinance();
  const evidence = loadEvidenceRecords();

  const imageAvailability: Record<string, boolean> = {};
  for (const e of evidence) {
    imageAvailability[e.relativePath] = evidenceImageExists(e.relativePath);
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Grant Reporting Assistant</h2>
          <p className="mt-1 text-slate-600">
            Select a grant and reporting month to view finance, outcomes, milestones, and evidence.
            Report text is generated from computed facts with full traceability.
          </p>
        </div>
        <GrantReportAssistant
          performance={performance}
          finance={finance}
          evidence={evidence}
          imageAvailability={imageAvailability}
        />
      </main>
    </>
  );
}
