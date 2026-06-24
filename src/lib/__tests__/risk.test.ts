/**
 * Unit tests for risk classification
 * Run with: npm test (after setting up Jest)
 */

import { classifyRisk, priorityScore } from "../risk";

describe("Risk Classification", () => {
  describe("classifyRisk", () => {
    it("should classify On Track (>= 75%)", () => {
      expect(classifyRisk(0.75)).toBe("On Track");
      expect(classifyRisk(0.9)).toBe("On Track");
      expect(classifyRisk(1.0)).toBe("On Track");
    });

    it("should classify Behind (60-74.99%)", () => {
      expect(classifyRisk(0.74)).toBe("Behind");
      expect(classifyRisk(0.6)).toBe("Behind");
    });

    it("should classify At Risk (35-59.99%)", () => {
      expect(classifyRisk(0.59)).toBe("At Risk");
      expect(classifyRisk(0.35)).toBe("At Risk");
    });

    it("should classify Critical (< 35%)", () => {
      expect(classifyRisk(0.34)).toBe("Critical");
      expect(classifyRisk(0.0)).toBe("Critical");
    });
  });

  describe("priorityScore", () => {
    it("should return 0 for all perfect rates", () => {
      expect(priorityScore([1.0, 1.0, 1.0])).toBe(0);
    });

    it("should return average gap", () => {
      // gaps: 0.3, 0.4, 0.5 → average 0.4
      expect(priorityScore([0.7, 0.6, 0.5])).toBeCloseTo(0.4, 5);
    });

    it("should handle empty array", () => {
      expect(priorityScore([])).toBeNaN();
    });
  });
});
