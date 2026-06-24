import { Nav } from "@/components/Nav";
import { ProgramDashboard } from "@/components/ProgramDashboard";
import { loadSchoolRecords } from "@/lib/data-loader";

// Force dynamic rendering (load data at runtime, not build time)
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const records = loadSchoolRecords();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Program Review Dashboard</h2>
          <p className="mt-1 text-slate-600">
            Filter by month, district, block, grade, and subject. Metrics and risk classifications
            are computed deterministically from school response data.
          </p>
        </div>
        <ProgramDashboard records={records} />
      </main>
    </>
  );
}
