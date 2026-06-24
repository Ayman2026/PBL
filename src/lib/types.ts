export type RiskStatus = "On Track" | "Behind" | "At Risk" | "Critical";

export type ReportingMonth = "2025-07" | "2025-08" | "2025-09";

export interface SchoolRecord {
  reportingMonth: ReportingMonth;
  timestamp: string;
  schoolName: string;
  schoolCode: string;
  district: string;
  block: string;
  pblConducted: boolean;
  evidenceSubmitted: boolean;
  classes: string;
  subjects: string;
  totalEnrollment: number;
  totalAttendance: number;
  attendanceRate: number;
  riskStatus: RiskStatus;
}

export interface DashboardMetrics {
  totalSchools: number;
  participatingSchools: number;
  participationRate: number;
  evidenceSubmissionRate: number;
  totalEnrollment: number;
  totalAttendance: number;
  attendanceRate: number;
  participationRisk: RiskStatus;
  evidenceRisk: RiskStatus;
  attendanceRisk: RiskStatus;
}

export interface MetricDelta {
  current: number;
  previous: number | null;
  delta: number | null;
  deltaPct: number | null;
}

export interface DashboardWithTrends extends DashboardMetrics {
  trends: {
    participationRate: MetricDelta;
    evidenceSubmissionRate: MetricDelta;
    attendanceRate: MetricDelta;
  };
}

export interface GeoPerformance {
  name: string;
  totalSchools: number;
  participatingSchools: number;
  participationRate: number;
  evidenceSubmissionRate: number;
  attendanceRate: number;
  overallRisk: RiskStatus;
  priorityScore: number;
}

export interface ProgramFilters {
  month: ReportingMonth;
  district: string;
  block: string;
  grade: string;
  subject: string;
}

export interface GrantFinanceRow {
  grantId: string;
  donor: string;
  grantName: string;
  reportingMonth: ReportingMonth;
  budgetLine: string;
  approvedBudgetUnits: number;
  monthlyUtilizedUnits: number;
  cumulativeUtilizedUnits: number;
  cumulativeUtilizationRate: number;
  financeNote: string;
}

export interface GrantPerformance {
  grantId: string;
  donor: string;
  grantName: string;
  reportingMonth: ReportingMonth;
  periodEndDate: string;
  reportDueDate: string;
  reportStatus: string;
  coveredDistricts: string[];
  sampledSchoolRecords: number;
  schoolsCompletedPbl: number;
  pblCompletionRate: number;
  schoolsWithEvidence: number;
  evidenceSubmissionRate: number;
  totalEnrollment: number;
  totalAttendance: number;
  attendanceRate: number;
  riskStatus: RiskStatus;
  milestoneSummary: string;
  draftReportText: string;
}

export interface EvidenceRecord {
  recordId: string;
  recordType: string;
  grantId: string;
  donor: string;
  reportingMonth: ReportingMonth;
  district: string;
  title: string;
  summaryOrCaption: string;
  fileName: string;
  relativePath: string;
  usageNote: string;
}

export interface GrantReportFacts {
  performance: GrantPerformance;
  finance: GrantFinanceRow[];
  evidence: EvidenceRecord[];
  totalApprovedBudget: number;
  totalCumulativeUtilized: number;
  overallUtilizationRate: number;
}

export interface SourceFact {
  label: string;
  value: string;
}

export interface GeneratedReport {
  narrative: string;
  sourceFacts: SourceFact[];
  deterministicSummary: string;
}

export interface ReviewSummary {
  month: ReportingMonth;
  achievements: string[];
  monthOverMonthChanges: string[];
  risks: string[];
  priorityGeographies: { name: string; level: "district" | "block"; reason: string }[];
  discussionPoints: string[];
}
