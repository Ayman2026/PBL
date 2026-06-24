"use client";

import { useMemo, useState } from "react";
import type { ProgramFilters, SchoolRecord } from "@/lib/types";
import {
  applyFilters,
  computeDashboardWithTrends,
  computeGeoPerformance,
  extractFilterOptions,
  formatNumber,
  formatPct,
} from "@/lib/analytics";
import { riskExplanation } from "@/lib/risk";
import { generateReviewSummary, reviewSummaryToText } from "@/lib/review-summary";
import { ProgramFiltersBar } from "./ProgramFiltersBar";
import { KpiCard } from "./KpiCard";
import { GeoPerformanceTable } from "./GeoPerformanceTable";
import { RiskBadge } from "./RiskBadge";

interface ProgramDashboardProps {
  records: SchoolRecord[];
}

const DEFAULT_FILTERS: ProgramFilters = {
  month: "2025-09",
  district: "All",
  block: "All",
  grade: "All",
  subject: "All",
};

export function ProgramDashboard({ records }: ProgramDashboardProps) {
  const [filters, setFilters] = useState<ProgramFilters>(DEFAULT_FILTERS);
  const [showSummary, setShowSummary] = useState(true);
  const [copied, setCopied] = useState(false);

  const options = useMemo(() => extractFilterOptions(records), [records]);

  const dashboard = useMemo(
    () => computeDashboardWithTrends(records, filters),
    [records, filters],
  );

  const filteredRecords = useMemo(
    () => applyFilters(records, filters),
    [records, filters],
  );

  const districtPerformance = useMemo(
    () => computeGeoPerformance(filteredRecords, "district"),
    [filteredRecords],
  );

  const blockPerformance = useMemo(
    () => computeGeoPerformance(filteredRecords, "block"),
    [filteredRecords],
  );

  const reviewSummary = useMemo(
    () => generateReviewSummary(records, filters),
    [records, filters],
  );

  async function copySummary() {
    await navigator.clipboard.writeText(reviewSummaryToText(reviewSummary));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <ProgramFiltersBar
        filters={filters}
        districts={options.districts}
        blocks={options.blocks}
        onChange={setFilters}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Schools"
          value={String(dashboard.totalSchools)}
          subtext={`${dashboard.participatingSchools} participating`}
        />
        <KpiCard
          label="Participation Rate"
          value={formatPct(dashboard.participationRate)}
          trend={dashboard.trends.participationRate}
          riskLabel={riskExplanation(
            dashboard.participationRisk,
            "Participation",
            dashboard.participationRate,
          )}
        />
        <KpiCard
          label="Evidence Submission"
          value={formatPct(dashboard.evidenceSubmissionRate)}
          trend={dashboard.trends.evidenceSubmissionRate}
          riskLabel={riskExplanation(
            dashboard.evidenceRisk,
            "Evidence",
            dashboard.evidenceSubmissionRate,
          )}
        />
        <KpiCard
          label="Attendance Rate"
          value={formatPct(dashboard.attendanceRate)}
          trend={dashboard.trends.attendanceRate}
          subtext={`${formatNumber(dashboard.totalAttendance)} / ${formatNumber(dashboard.totalEnrollment)} students`}
          riskLabel={riskExplanation(
            dashboard.attendanceRisk,
            "Attendance",
            dashboard.attendanceRate,
          )}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900">Risk Classification (Deterministic)</h3>
        <p className="mt-1 text-sm text-slate-500">
          On Track ≥75% · Behind 60–74.99% · At Risk 35–59.99% · Critical &lt;35%
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Participation:</span>
            <RiskBadge status={dashboard.participationRisk} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Evidence:</span>
            <RiskBadge status={dashboard.evidenceRisk} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Attendance:</span>
            <RiskBadge status={dashboard.attendanceRisk} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GeoPerformanceTable
          title="Priority Districts"
          data={districtPerformance}
          variant="priority"
        />
        <GeoPerformanceTable
          title="Top Performing Districts"
          data={districtPerformance}
          variant="top"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GeoPerformanceTable
          title="Priority Blocks"
          data={blockPerformance}
          variant="priority"
        />
        <GeoPerformanceTable
          title="Top Performing Blocks"
          data={blockPerformance}
          variant="top"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="font-semibold text-slate-900">Monthly Review Summary</h3>
            <p className="text-sm text-slate-500">
              Structured discussion points from deterministic insights
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowSummary(!showSummary)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {showSummary ? "Hide" : "Show"}
            </button>
            <button
              type="button"
              onClick={copySummary}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
            >
              {copied ? "Copied!" : "Copy for export"}
            </button>
          </div>
        </div>
        {showSummary && (
          <div className="grid gap-6 p-5 lg:grid-cols-2">
            <SummarySection title="Achievements" items={reviewSummary.achievements} />
            <SummarySection title="Month-over-Month" items={reviewSummary.monthOverMonthChanges} />
            <SummarySection title="Risks" items={reviewSummary.risks} />
            <SummarySection
              title="Priority Geographies"
              items={reviewSummary.priorityGeographies.map(
                (g) => `[${g.level}] ${g.name}: ${g.reason}`,
              )}
            />
            <div className="lg:col-span-2">
              <SummarySection title="Discussion Points" items={reviewSummary.discussionPoints} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummarySection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-700">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-700">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
