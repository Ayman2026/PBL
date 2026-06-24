import type { RiskStatus } from "./types";

export const RISK_THRESHOLDS = {
  onTrack: 0.75,
  behind: 0.6,
  atRisk: 0.35,
} as const;

export function classifyRisk(rate: number): RiskStatus {
  if (rate >= RISK_THRESHOLDS.onTrack) return "On Track";
  if (rate >= RISK_THRESHOLDS.behind) return "Behind";
  if (rate >= RISK_THRESHOLDS.atRisk) return "At Risk";
  return "Critical";
}

export function riskExplanation(status: RiskStatus, metricLabel: string, rate: number): string {
  const pct = (rate * 100).toFixed(1);
  switch (status) {
    case "On Track":
      return `${metricLabel} at ${pct}% meets the on-track threshold (≥75%).`;
    case "Behind":
      return `${metricLabel} at ${pct}% is behind target (60–74.99%). Follow-up recommended.`;
    case "At Risk":
      return `${metricLabel} at ${pct}% is at risk (35–59.99%). Priority intervention needed.`;
    case "Critical":
      return `${metricLabel} at ${pct}% is critical (<35%). Immediate action required.`;
  }
}

export function riskColor(status: RiskStatus): string {
  switch (status) {
    case "On Track":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Behind":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "At Risk":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Critical":
      return "bg-red-100 text-red-800 border-red-200";
  }
}

export function priorityScore(rates: number[]): number {
  return rates.reduce((sum, r) => sum + (1 - r), 0) / rates.length;
}
