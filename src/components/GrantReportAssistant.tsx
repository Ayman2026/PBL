"use client";

import { useMemo, useState } from "react";
import type {
  EvidenceRecord,
  GrantFinanceRow,
  GrantPerformance,
  ReportingMonth,
} from "@/lib/types";
import { MONTHS, formatPct, monthLabel } from "@/lib/analytics";
import {
  assembleGrantFacts,
  generateGrantNarrative,
} from "@/lib/narrative";
import { RiskBadge } from "./RiskBadge";

interface GrantReportAssistantProps {
  performance: GrantPerformance[];
  finance: GrantFinanceRow[];
  evidence: EvidenceRecord[];
  imageAvailability: Record<string, boolean>;
}

export function GrantReportAssistant({
  performance,
  finance,
  evidence,
  imageAvailability,
}: GrantReportAssistantProps) {
  const grants = useMemo(() => {
    const map = new Map<string, string>();
    performance.forEach((p) => map.set(p.grantId, p.grantName));
    return [...map.entries()];
  }, [performance]);

  const [grantId, setGrantId] = useState(grants[0]?.[0] ?? "");
  const [month, setMonth] = useState<ReportingMonth>("2025-09");
  const [useNarrative, setUseNarrative] = useState(true);
  const [copied, setCopied] = useState(false);

  const perf = performance.find((p) => p.grantId === grantId && p.reportingMonth === month);
  const fin = finance.filter((f) => f.grantId === grantId && f.reportingMonth === month);
  const ev = evidence.filter((e) => e.grantId === grantId && e.reportingMonth === month);

  const facts = perf ? assembleGrantFacts(perf, fin, ev) : null;
  const report = facts ? generateGrantNarrative(facts, useNarrative) : null;

  async function copyReport() {
    if (!report) return;
    const text = useNarrative ? report.narrative : report.deterministicSummary;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Selection
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">Grant</span>
            <select
              value={grantId}
              onChange={(e) => setGrantId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {grants.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">Reporting month</span>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value as ReportingMonth)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2">
            <input
              type="checkbox"
              checked={useNarrative}
              onChange={(e) => setUseNarrative(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">
              Rule-based narrative (disable for fact-only summary)
            </span>
          </label>
        </div>
      </div>

      {!facts || !report ? (
        <p className="text-slate-600">No grant data for this selection.</p>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <FactPanel facts={facts} />
            <FinancePanel finance={fin} totalUtil={facts.overallUtilizationRate} />
          </div>

          <EvidencePanel evidence={ev} imageAvailability={imageAvailability} />

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="font-semibold text-slate-900">Report Preview</h3>
                <p className="text-sm text-slate-500">
                  {useNarrative
                    ? "Generated narrative grounded in computed facts"
                    : "Deterministic fact summary (AI disabled mode)"}
                </p>
              </div>
              <button
                type="button"
                onClick={copyReport}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
              >
                {copied ? "Copied!" : "Copy report"}
              </button>
            </div>
            <div className="grid gap-6 p-5 lg:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase text-teal-700">
                  {useNarrative ? "Narrative" : "Fact Summary"}
                </h4>
                <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
                  {useNarrative ? report.narrative : report.deterministicSummary}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase text-teal-700">
                  Source Facts (Traceability)
                </h4>
                <ul className="max-h-96 space-y-2 overflow-y-auto rounded-lg bg-slate-50 p-4 text-sm">
                  {report.sourceFacts.map((f, i) => (
                    <li key={i} className="text-slate-700">
                      <span className="font-medium text-slate-900">{f.label}:</span> {f.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {!useNarrative && (
            <p className="text-sm text-slate-500">
              Deterministic mode active — same output as{" "}
              <code className="rounded bg-slate-100 px-1">generateDeterministicSummary()</code>
            </p>
          )}
        </>
      )}
    </div>
  );
}

function FactPanel({ facts }: { facts: ReturnType<typeof assembleGrantFacts> }) {
  const p = facts.performance;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">Performance Facts</h3>
      <div className="mt-4 space-y-3 text-sm">
        <Row label="Grant" value={p.grantName} />
        <Row label="Donor" value={p.donor} />
        <Row label="Month" value={monthLabel(p.reportingMonth)} />
        <Row label="PBL completion" value={formatPct(p.pblCompletionRate)} />
        <Row
          label="Schools"
          value={`${p.schoolsCompletedPbl} / ${p.sampledSchoolRecords}`}
        />
        <Row label="Evidence rate" value={formatPct(p.evidenceSubmissionRate)} />
        <Row label="Attendance" value={formatPct(p.attendanceRate)} />
        <Row label="Report status" value={p.reportStatus} />
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Risk:</span>
          <RiskBadge status={p.riskStatus} />
        </div>
        <Row label="Milestones" value={p.milestoneSummary} />
      </div>
    </div>
  );
}

function FinancePanel({
  finance,
  totalUtil,
}: {
  finance: GrantFinanceRow[];
  totalUtil: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">Finance Utilization</h3>
      <p className="mt-1 text-2xl font-bold text-teal-700">{formatPct(totalUtil)} overall</p>
      <div className="mt-4 space-y-2">
        {finance.map((f) => (
          <div
            key={f.budgetLine}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
          >
            <span className="text-slate-700">{f.budgetLine}</span>
            <span className="font-medium text-slate-900">
              {formatPct(f.cumulativeUtilizationRate)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvidencePanel({
  evidence,
  imageAvailability,
}: {
  evidence: EvidenceRecord[];
  imageAvailability: Record<string, boolean>;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">Linked Evidence & Media</h3>
      {evidence.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">No evidence records for this grant/month.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {evidence.map((e) => (
            <div key={e.recordId} className="rounded-lg border border-slate-100 p-4">
              <p className="text-xs font-semibold uppercase text-teal-700">{e.recordType}</p>
              <p className="mt-1 font-medium text-slate-900">{e.title}</p>
              <p className="mt-1 text-sm text-slate-600">{e.summaryOrCaption}</p>
              <p className="mt-2 text-xs text-slate-400">{e.fileName}</p>
              {!imageAvailability[e.relativePath] && (
                <p className="mt-1 text-xs text-amber-600">
                  Image file not in package — metadata shown only
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-slate-500">{label}: </span>
      <span className="text-slate-900">{value}</span>
    </div>
  );
}
