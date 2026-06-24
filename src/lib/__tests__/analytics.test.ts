/**
 * Unit tests for analytics functions
 * Run with: npm test (after setting up Jest)
 */

import { computeMetrics, applyFilters, matchesGrade, matchesSubject } from "../analytics";
import type { SchoolRecord, ProgramFilters } from "../types";

// Mock data
const mockRecords: SchoolRecord[] = [
  {
    reportingMonth: "2025-07",
    timestamp: "2025-07-01",
    schoolName: "Test School A",
    schoolCode: "TEST-001",
    district: "District A",
    block: "Block 1",
    pblConducted: true,
    evidenceSubmitted: true,
    classes: "Class 6, Class 7",
    subjects: "Math and Science",
    totalEnrollment: 100,
    totalAttendance: 80,
    attendanceRate: 0.8,
    riskStatus: "On Track",
  },
  {
    reportingMonth: "2025-07",
    timestamp: "2025-07-01",
    schoolName: "Test School B",
    schoolCode: "TEST-002",
    district: "District A",
    block: "Block 1",
    pblConducted: false,
    evidenceSubmitted: false,
    classes: "Class 8",
    subjects: "Science",
    totalEnrollment: 150,
    totalAttendance: 0,
    attendanceRate: 0,
    riskStatus: "Critical",
  },
];

describe("Analytics Functions", () => {
  describe("matchesGrade", () => {
    it("should match 'All' for any grade", () => {
      expect(matchesGrade("Class 6, Class 7", "All")).toBe(true);
    });

    it("should match specific grade", () => {
      expect(matchesGrade("Class 6, Class 7", "6")).toBe(true);
      expect(matchesGrade("Class 6, Class 7", "8")).toBe(false);
    });
  });

  describe("matchesSubject", () => {
    it("should match 'All' for any subject", () => {
      expect(matchesSubject("Math and Science", "All")).toBe(true);
    });

    it("should match specific subject (case-insensitive)", () => {
      expect(matchesSubject("Math and Science", "Math")).toBe(true);
      expect(matchesSubject("Math and Science", "science")).toBe(true);
      expect(matchesSubject("Science only", "Math")).toBe(false);
    });
  });

  describe("computeMetrics", () => {
    it("should compute correct participation rate", () => {
      const metrics = computeMetrics(mockRecords);
      expect(metrics.totalSchools).toBe(2);
      expect(metrics.participatingSchools).toBe(1);
      expect(metrics.participationRate).toBe(0.5);
    });

    it("should compute correct attendance metrics", () => {
      const metrics = computeMetrics(mockRecords);
      expect(metrics.totalEnrollment).toBe(250);
      expect(metrics.totalAttendance).toBe(80);
      expect(metrics.attendanceRate).toBeCloseTo(0.32, 2);
    });
  });

  describe("applyFilters", () => {
    it("should filter by month", () => {
      const filters: ProgramFilters = {
        month: "2025-08",
        district: "All",
        block: "All",
        grade: "All",
        subject: "All",
      };
      const filtered = applyFilters(mockRecords, filters);
      expect(filtered.length).toBe(0);
    });

    it("should filter by district", () => {
      const filters: ProgramFilters = {
        month: "2025-07",
        district: "District B",
        block: "All",
        grade: "All",
        subject: "All",
      };
      const filtered = applyFilters(mockRecords, filters);
      expect(filtered.length).toBe(0);
    });
  });
});
