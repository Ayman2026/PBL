import {
  applyFilters,
  computeDashboardWithTrends,
  computeGeoPerformance,
  formatDelta,
  formatPct,
  monthLabel,
  previousMonth,
} from "./analytics";
import { classifyRisk, riskExplanation } from "./risk";
import type { ProgramFilters, ReviewSummary, SchoolRecord } from "./types";

export function generateReviewSummary(
  allRecords: SchoolRecord[],
  filters: ProgramFilters,
): ReviewSummary {
  const dashboard = computeDashboardWithTrends(allRecords, filters);
  const records = applyFilters(allRecords, filters);
  const districts = computeGeoPerformance(records, "district");
  const blocks = computeGeoPerformance(records, "block");

  const achievements: string[] = [];
  if (dashboard.participationRate >= 0.75) {
    achievements.push(
      `Participation reached ${formatPct(dashboard.participationRate)} — on track across ${dashboard.participatingSchools} schools.`,
    );
  }
  if (dashboard.evidenceSubmissionRate >= 0.6) {
    achievements.push(
      `Evidence submission at ${formatPct(dashboard.evidenceSubmissionRate)} shows improving documentation practices.`,
    );
  }
  if (dashboard.trends.participationRate.delta !== null && dashboard.trends.participationRate.delta > 0) {
    achievements.push(
      `Participation improved ${formatDelta(dashboard.trends.participationRate)} vs prior month.`,
    );
  }
  if (dashboard.trends.evidenceSubmissionRate.delta !== null && dashboard.trends.evidenceSubmissionRate.delta > 0) {
    achievements.push(
      `Evidence submission improved ${formatDelta(dashboard.trends.evidenceSubmissionRate)} vs prior month.`,
    );
  }
  if (achievements.length === 0) {
    achievements.push(
      `${dashboard.participatingSchools} of ${dashboard.totalSchools} schools participated in PBL this month.`,
    );
  }

  const monthOverMonthChanges: string[] = [];
  const prev = previousMonth(filters.month);
  if (prev) {
    monthOverMonthChanges.push(
      `Participation: ${formatPct(dashboard.participationRate)} (${formatDelta(dashboard.trends.participationRate)} from ${monthLabel(prev)})`,
    );
    monthOverMonthChanges.push(
      `Evidence: ${formatPct(dashboard.evidenceSubmissionRate)} (${formatDelta(dashboard.trends.evidenceSubmissionRate)} from ${monthLabel(prev)})`,
    );
    monthOverMonthChanges.push(
      `Attendance: ${formatPct(dashboard.attendanceRate)} (${formatDelta(dashboard.trends.attendanceRate)} from ${monthLabel(prev)})`,
    );
  } else {
    monthOverMonthChanges.push("No prior month available for comparison (first reporting period).");
  }

  const risks = [
    riskExplanation(dashboard.participationRisk, "Participation", dashboard.participationRate),
    riskExplanation(dashboard.evidenceRisk, "Evidence submission", dashboard.evidenceSubmissionRate),
    riskExplanation(dashboard.attendanceRisk, "Attendance", dashboard.attendanceRate),
  ];

  const priorityGeographies = [
    ...districts.slice(0, 3).map((d) => ({
      name: d.name,
      level: "district" as const,
      reason: `${d.overallRisk} — participation ${formatPct(d.participationRate)}, evidence ${formatPct(d.evidenceSubmissionRate)}, attendance ${formatPct(d.attendanceRate)}`,
    })),
    ...blocks.slice(0, 3).map((b) => ({
      name: b.name,
      level: "block" as const,
      reason: `${b.overallRisk} — participation ${formatPct(b.participationRate)}, evidence ${formatPct(b.evidenceSubmissionRate)}`,
    })),
  ];

  const lowDistricts = districts.filter((d) => classifyRisk(d.participationRate) !== "On Track");
  const discussionPoints = [
    `Review ${lowDistricts.length} district(s) below on-track participation threshold.`,
    `Evidence submission at ${formatPct(dashboard.evidenceSubmissionRate)} — discuss support for schools not submitting documentation.`,
    `Attendance at ${formatPct(dashboard.attendanceRate)} — identify blocks with lowest session attendance.`,
    `Prioritize follow-up in: ${districts.slice(0, 2).map((d) => d.name).join(", ") || "N/A"}.`,
    `Confirm action owners and timelines for ${blocks.filter((b) => b.overallRisk === "Critical" || b.overallRisk === "At Risk").length} at-risk/critical blocks.`,
  ];

  return {
    month: filters.month,
    achievements,
    monthOverMonthChanges,
    risks,
    priorityGeographies,
    discussionPoints,
  };
}

export function reviewSummaryToText(summary: ReviewSummary): string {
  const sections = [
    `Program Review Summary — ${monthLabel(summary.month)}`,
    "",
    "Achievements",
    ...summary.achievements.map((a) => `• ${a}`),
    "",
    "Month-over-Month Changes",
    ...summary.monthOverMonthChanges.map((c) => `• ${c}`),
    "",
    "Risks",
    ...summary.risks.map((r) => `• ${r}`),
    "",
    "Priority Geographies",
    ...summary.priorityGeographies.map((g) => `• [${g.level}] ${g.name}: ${g.reason}`),
    "",
    "Discussion Points",
    ...summary.discussionPoints.map((d) => `• ${d}`),
  ];
  return sections.join("\n");
}
