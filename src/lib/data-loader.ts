import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { DATA_PATHS } from "./paths";
import { dataCache, CACHE_KEYS } from "./cache";
import type {
  EvidenceRecord,
  GrantFinanceRow,
  GrantPerformance,
  ReportingMonth,
  RiskStatus,
  SchoolRecord,
} from "./types";

function parseBool(value: string): boolean {
  return value.trim().toLowerCase() === "yes";
}

function parseNumber(value: string, defaultValue = 0): number {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

function parseRisk(value: string): RiskStatus {
  const v = value.trim() as RiskStatus;
  return v;
}

function parsePblRow(row: Record<string, string>): SchoolRecord {
  return {
    reportingMonth: row["Reporting Month"] as ReportingMonth,
    timestamp: row["Timestamp"],
    schoolName: row["What is the name of your school?"],
    schoolCode: row["What is your school's synthetic school code?"],
    district: row["What is the name of your district?"],
    block: row["Block Details"],
    pblConducted: parseBool(row["Was the PBL project conducted in your school this month?"]),
    evidenceSubmitted: parseBool(row["Was evidence submitted for the completed PBL project?"]),
    classes: row["In which class/classes did you conduct the PBL project?"],
    subjects: row["Which subject do you teach?"],
    totalEnrollment: parseNumber(row["Derived: Total enrollment across Classes 6-8"]),
    totalAttendance: parseNumber(row["Derived: Total attendance across PBL Science and Math sessions"]),
    attendanceRate: parseNumber(row["Derived: Overall PBL attendance rate"]),
    riskStatus: parseRisk(row["Derived: Risk status"]),
  };
}

function loadCsv<T>(filePath: string, mapper: (row: Record<string, string>) => T): T[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = Papa.parse<Record<string, string>>(content, {
      header: true,
      skipEmptyLines: true,
    });
    
    if (parsed.errors.length > 0) {
      console.warn(`CSV parsing warnings for ${filePath}:`, parsed.errors);
    }
    
    return parsed.data.map(mapper);
  } catch (error) {
    console.error(`Failed to load CSV from ${filePath}:`, error);
    throw new Error(`Data loading failed: ${filePath}`);
  }
}

export function loadSchoolRecords(): SchoolRecord[] {
  const cached = dataCache.get<SchoolRecord[]>(CACHE_KEYS.SCHOOL_RECORDS);
  if (cached) return cached;

  const files = [DATA_PATHS.pblJuly, DATA_PATHS.pblAugust, DATA_PATHS.pblSeptember];
  const records = files.flatMap((file) => loadCsv(file, parsePblRow));
  
  dataCache.set(CACHE_KEYS.SCHOOL_RECORDS, records);
  return records;
}

export function loadGrantFinance(): GrantFinanceRow[] {
  const cached = dataCache.get<GrantFinanceRow[]>(CACHE_KEYS.GRANT_FINANCE);
  if (cached) return cached;

  const records = loadCsv(DATA_PATHS.grantFinance, (row) => ({
    grantId: row.grant_id,
    donor: row.donor,
    grantName: row.grant_name,
    reportingMonth: row.reporting_month as ReportingMonth,
    budgetLine: row.budget_line,
    approvedBudgetUnits: parseNumber(row.approved_budget_units),
    monthlyUtilizedUnits: parseNumber(row.monthly_utilized_units),
    cumulativeUtilizedUnits: parseNumber(row.cumulative_utilized_units),
    cumulativeUtilizationRate: parseNumber(row.cumulative_utilization_rate),
    financeNote: row.finance_note,
  }));

  dataCache.set(CACHE_KEYS.GRANT_FINANCE, records);
  return records;
}

export function loadGrantPerformance(): GrantPerformance[] {
  const cached = dataCache.get<GrantPerformance[]>(CACHE_KEYS.GRANT_PERFORMANCE);
  if (cached) return cached;

  const records = loadCsv(DATA_PATHS.grantPerformance, (row) => ({
    grantId: row.grant_id,
    donor: row.donor,
    grantName: row.grant_name,
    reportingMonth: row.reporting_month as ReportingMonth,
    periodEndDate: row.period_end_date,
    reportDueDate: row.report_due_date,
    reportStatus: row.report_status,
    coveredDistricts: row.covered_districts.split(";").map((d) => d.trim()),
    sampledSchoolRecords: parseNumber(row.sampled_school_records),
    schoolsCompletedPbl: parseNumber(row.schools_completed_pbl),
    pblCompletionRate: parseNumber(row.pbl_completion_rate),
    schoolsWithEvidence: parseNumber(row.schools_with_evidence),
    evidenceSubmissionRate: parseNumber(row.evidence_submission_rate),
    totalEnrollment: parseNumber(row.total_enrollment),
    totalAttendance: parseNumber(row.total_attendance),
    attendanceRate: parseNumber(row.attendance_rate),
    riskStatus: row.risk_status as RiskStatus,
    milestoneSummary: row.milestone_summary,
    draftReportText: row.draft_report_text,
  }));

  dataCache.set(CACHE_KEYS.GRANT_PERFORMANCE, records);
  return records;
}

export function loadEvidenceRecords(): EvidenceRecord[] {
  const cached = dataCache.get<EvidenceRecord[]>(CACHE_KEYS.EVIDENCE_RECORDS);
  if (cached) return cached;

  const records = loadCsv(DATA_PATHS.evidenceIndex, (row) => ({
    recordId: row.record_id,
    recordType: row.record_type,
    grantId: row.grant_id,
    donor: row.donor,
    reportingMonth: row.reporting_month as ReportingMonth,
    district: row.district,
    title: row.title,
    summaryOrCaption: row.summary_or_caption,
    fileName: row.file_name,
    relativePath: row.relative_path,
    usageNote: row.usage_note,
  }));

  dataCache.set(CACHE_KEYS.EVIDENCE_RECORDS, records);
  return records;
}

export function evidenceImageExists(relativePath: string): boolean {
  const fullPath = path.join(DATA_PATHS.evidenceImages, relativePath);
  return fs.existsSync(fullPath);
}
