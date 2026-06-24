import { classifyRisk, riskExplanation } from "./risk";
import { formatNumber, formatPct, monthLabel } from "./analytics";
import type {
  GeneratedReport,
  GrantFinanceRow,
  GrantPerformance,
  EvidenceRecord,
  GrantReportFacts,
  SourceFact,
} from "./types";

export function assembleGrantFacts(
  performance: GrantPerformance,
  finance: GrantFinanceRow[],
  evidence: EvidenceRecord[],
): GrantReportFacts {
  const totalApprovedBudget = finance.reduce((s, f) => s + f.approvedBudgetUnits, 0);
  const totalCumulativeUtilized = finance.reduce((s, f) => s + f.cumulativeUtilizedUnits, 0);
  const overallUtilizationRate =
    totalApprovedBudget > 0 ? totalCumulativeUtilized / totalApprovedBudget : 0;

  return {
    performance,
    finance,
    evidence,
    totalApprovedBudget,
    totalCumulativeUtilized,
    overallUtilizationRate,
  };
}

export function buildSourceFacts(facts: GrantReportFacts): SourceFact[] {
  const { performance: p, finance, evidence } = facts;
  return [
    { label: "Grant", value: p.grantName },
    { label: "Reporting month", value: monthLabel(p.reportingMonth) },
    { label: "PBL completion rate", value: formatPct(p.pblCompletionRate) },
    { label: "Schools completed PBL", value: `${p.schoolsCompletedPbl} / ${p.sampledSchoolRecords}` },
    { label: "Evidence submission rate", value: formatPct(p.evidenceSubmissionRate) },
    { label: "Schools with evidence", value: String(p.schoolsWithEvidence) },
    { label: "Attendance rate", value: formatPct(p.attendanceRate) },
    { label: "Total enrollment", value: formatNumber(p.totalEnrollment) },
    { label: "Total attendance", value: formatNumber(p.totalAttendance) },
    { label: "Overall risk status", value: p.riskStatus },
    { label: "Report status", value: p.reportStatus },
    { label: "Budget utilization", value: formatPct(facts.overallUtilizationRate) },
    { label: "Cumulative spend (units)", value: formatNumber(facts.totalCumulativeUtilized) },
    { label: "Approved budget (units)", value: formatNumber(facts.totalApprovedBudget) },
    { label: "Milestones", value: p.milestoneSummary },
    { label: "Covered districts", value: p.coveredDistricts.join(", ") },
    ...finance.map((f) => ({
      label: `Finance: ${f.budgetLine}`,
      value: `${formatPct(f.cumulativeUtilizationRate)} utilized (${f.financeNote})`,
    })),
    ...evidence.map((e) => ({
      label: `Evidence: ${e.title}`,
      value: `${e.recordType} — ${e.summaryOrCaption} (${e.fileName})`,
    })),
  ];
}

export function generateDeterministicSummary(facts: GrantReportFacts): string {
  const p = facts.performance;
  const lines = [
    `Grant Report Summary — ${p.grantName} (${monthLabel(p.reportingMonth)})`,
    "",
    "Performance",
    `• PBL completion: ${formatPct(p.pblCompletionRate)} (${p.schoolsCompletedPbl}/${p.sampledSchoolRecords} schools)`,
    `• Evidence submission: ${formatPct(p.evidenceSubmissionRate)} (${p.schoolsWithEvidence} schools)`,
    `• Attendance: ${formatPct(p.attendanceRate)} (${formatNumber(p.totalAttendance)} / ${formatNumber(p.totalEnrollment)} students)`,
    `• Risk status: ${p.riskStatus}`,
    "",
    "Finance",
    `• Total approved budget: ${formatNumber(facts.totalApprovedBudget)} units`,
    `• Cumulative utilized: ${formatNumber(facts.totalCumulativeUtilized)} units (${formatPct(facts.overallUtilizationRate)})`,
    ...facts.finance.map(
      (f) => `• ${f.budgetLine}: ${formatPct(f.cumulativeUtilizationRate)} — ${f.financeNote}`,
    ),
    "",
    "Milestones",
    p.milestoneSummary,
    "",
    "Evidence assets",
    ...(facts.evidence.length > 0
      ? facts.evidence.map((e) => `• [${e.recordType}] ${e.title}: ${e.fileName}`)
      : ["• No linked evidence records for this selection."]),
  ];
  return lines.join("\n");
}

export function generateGrantNarrative(facts: GrantReportFacts, useAiStyle = true): GeneratedReport {
  const p = facts.performance;
  const sourceFacts = buildSourceFacts(facts);
  const deterministicSummary = generateDeterministicSummary(facts);

  const gaps: string[] = [];
  if (p.pblCompletionRate < 0.75) gaps.push("PBL completion");
  if (p.evidenceSubmissionRate < 0.75) gaps.push("evidence submission");
  if (p.attendanceRate < 0.75) gaps.push("attendance");

  const gapText =
    gaps.length > 0
      ? `Priority follow-up is needed on ${gaps.join(", ")}.`
      : "Core indicators are meeting on-track thresholds.";

  const evidenceRefs =
    facts.evidence.length > 0
      ? `Supporting evidence includes ${facts.evidence.map((e) => e.title).join("; ")}.`
      : "";

  const narrative = useAiStyle
    ? [
        `During ${monthLabel(p.reportingMonth)}, ${p.grantName} (${p.donor}) reported ${formatPct(p.pblCompletionRate)} PBL completion across ${p.sampledSchoolRecords} sampled schools in ${p.coveredDistricts.join(", ")}.`,
        `Evidence was submitted by ${p.schoolsWithEvidence} schools (${formatPct(p.evidenceSubmissionRate)}), with student attendance at ${formatPct(p.attendanceRate)} across ${formatNumber(p.totalEnrollment)} enrolled students.`,
        `Finance utilization stands at ${formatPct(facts.overallUtilizationRate)} of approved budget (${formatNumber(facts.totalCumulativeUtilized)} of ${formatNumber(facts.totalApprovedBudget)} units), with all budget lines marked "${facts.finance[0]?.financeNote ?? "Within plan"}".`,
        `Program status is classified as ${p.riskStatus}. ${riskExplanation(classifyRisk(p.pblCompletionRate), "Completion", p.pblCompletionRate)} ${riskExplanation(classifyRisk(p.evidenceSubmissionRate), "Evidence", p.evidenceSubmissionRate)} ${riskExplanation(classifyRisk(p.attendanceRate), "Attendance", p.attendanceRate)}`,
        `Milestone progress: ${p.milestoneSummary.replace(/\|/g, ";")}.`,
        gapText,
        evidenceRefs,
        `Report filing status: ${p.reportStatus}. Due date: ${p.reportDueDate}.`,
      ]
        .filter(Boolean)
        .join("\n\n")
    : deterministicSummary;

  return { narrative, sourceFacts, deterministicSummary };
}
