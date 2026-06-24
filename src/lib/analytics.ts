import { classifyRisk, priorityScore } from "./risk";
import type {
  DashboardMetrics,
  DashboardWithTrends,
  GeoPerformance,
  MetricDelta,
  ProgramFilters,
  ReportingMonth,
  SchoolRecord,
} from "./types";

export const MONTHS: ReportingMonth[] = ["2025-07", "2025-08", "2025-09"];

export function monthLabel(month: ReportingMonth): string {
  const labels: Record<ReportingMonth, string> = {
    "2025-07": "July 2025",
    "2025-08": "August 2025",
    "2025-09": "September 2025",
  };
  return labels[month];
}

export function previousMonth(month: ReportingMonth): ReportingMonth | null {
  const idx = MONTHS.indexOf(month);
  return idx > 0 ? MONTHS[idx - 1] : null;
}

export function matchesGrade(classes: string, grade: string): boolean {
  if (!grade || grade === "All") return true;
  return classes.includes(`Class ${grade}`) || classes.includes(`Classes ${grade}`);
}

export function matchesSubject(subjects: string, subject: string): boolean {
  if (!subject || subject === "All") return true;
  return subjects.toLowerCase().includes(subject.toLowerCase());
}

export function applyFilters(records: SchoolRecord[], filters: ProgramFilters): SchoolRecord[] {
  return records.filter((r) => {
    if (r.reportingMonth !== filters.month) return false;
    if (filters.district !== "All" && r.district !== filters.district) return false;
    if (filters.block !== "All" && r.block !== filters.block) return false;
    if (!matchesGrade(r.classes, filters.grade)) return false;
    if (!matchesSubject(r.subjects, filters.subject)) return false;
    return true;
  });
}

export function computeMetrics(records: SchoolRecord[]): DashboardMetrics {
  const schoolCodes = new Set(records.map((r) => r.schoolCode));
  const totalSchools = schoolCodes.size;
  const participating = records.filter((r) => r.pblConducted);
  const participatingSchools = new Set(participating.map((r) => r.schoolCode)).size;
  const withEvidence = participating.filter((r) => r.evidenceSubmitted);
  const evidenceSchools = new Set(withEvidence.map((r) => r.schoolCode)).size;

  const totalEnrollment = records.reduce((s, r) => s + r.totalEnrollment, 0);
  const totalAttendance = records.reduce((s, r) => s + r.totalAttendance, 0);
  const participationRate = totalSchools > 0 ? participatingSchools / totalSchools : 0;
  const evidenceSubmissionRate =
    participatingSchools > 0 ? evidenceSchools / participatingSchools : 0;
  const attendanceRate = totalEnrollment > 0 ? totalAttendance / totalEnrollment : 0;

  return {
    totalSchools,
    participatingSchools,
    participationRate,
    evidenceSubmissionRate,
    totalEnrollment,
    totalAttendance,
    attendanceRate,
    participationRisk: classifyRisk(participationRate),
    evidenceRisk: classifyRisk(evidenceSubmissionRate),
    attendanceRisk: classifyRisk(attendanceRate),
  };
}

function metricDelta(current: number, previous: number | null): MetricDelta {
  if (previous === null) {
    return { current, previous: null, delta: null, deltaPct: null };
  }
  const delta = current - previous;
  const deltaPct = previous !== 0 ? delta / previous : null;
  return { current, previous, delta, deltaPct };
}

export function computeDashboardWithTrends(
  allRecords: SchoolRecord[],
  filters: ProgramFilters,
): DashboardWithTrends {
  const currentRecords = applyFilters(allRecords, filters);
  const metrics = computeMetrics(currentRecords);

  const prev = previousMonth(filters.month);
  let trends = {
    participationRate: metricDelta(metrics.participationRate, null),
    evidenceSubmissionRate: metricDelta(metrics.evidenceSubmissionRate, null),
    attendanceRate: metricDelta(metrics.attendanceRate, null),
  };

  if (prev) {
    const prevFilters = { ...filters, month: prev };
    const prevMetrics = computeMetrics(applyFilters(allRecords, prevFilters));
    trends = {
      participationRate: metricDelta(metrics.participationRate, prevMetrics.participationRate),
      evidenceSubmissionRate: metricDelta(
        metrics.evidenceSubmissionRate,
        prevMetrics.evidenceSubmissionRate,
      ),
      attendanceRate: metricDelta(metrics.attendanceRate, prevMetrics.attendanceRate),
    };
  }

  return { ...metrics, trends };
}

export function computeGeoPerformance(
  records: SchoolRecord[],
  level: "district" | "block",
): GeoPerformance[] {
  const groups = new Map<string, SchoolRecord[]>();
  for (const r of records) {
    const key = level === "district" ? r.district : r.block;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  const results: GeoPerformance[] = [];
  for (const [name, groupRecords] of groups) {
    const m = computeMetrics(groupRecords);
    const compositeRate =
      (m.participationRate + m.evidenceSubmissionRate + m.attendanceRate) / 3;
    results.push({
      name,
      totalSchools: m.totalSchools,
      participatingSchools: m.participatingSchools,
      participationRate: m.participationRate,
      evidenceSubmissionRate: m.evidenceSubmissionRate,
      attendanceRate: m.attendanceRate,
      overallRisk: classifyRisk(compositeRate),
      priorityScore: priorityScore([
        m.participationRate,
        m.evidenceSubmissionRate,
        m.attendanceRate,
      ]),
    });
  }

  return results.sort((a, b) => b.priorityScore - a.priorityScore);
}

export function extractFilterOptions(records: SchoolRecord[]) {
  const districts = [...new Set(records.map((r) => r.district))].sort();
  const blocks = [...new Set(records.map((r) => r.block))].sort();
  return { districts, blocks, grades: ["All", "6", "7", "8"], subjects: ["All", "Math", "Science"] };
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatPct(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function formatDelta(delta: MetricDelta): string {
  if (delta.delta === null) return "—";
  const sign = delta.delta >= 0 ? "+" : "";
  return `${sign}${(delta.delta * 100).toFixed(1)} pp`;
}
