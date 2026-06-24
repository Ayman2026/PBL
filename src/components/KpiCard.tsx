import type { MetricDelta } from "@/lib/types";
import { formatDelta } from "@/lib/analytics";

interface KpiCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: MetricDelta;
  riskLabel?: string;
}

export function KpiCard({ label, value, subtext, trend, riskLabel }: KpiCardProps) {
  const trendUp =
    trend !== undefined &&
    trend.delta !== null &&
    trend.delta >= 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {subtext && <p className="mt-1 text-sm text-slate-600">{subtext}</p>}
      {trend && trend.delta !== null && (
        <p
          className={`mt-2 text-sm font-medium ${trendUp ? "text-emerald-600" : "text-red-600"}`}
        >
          {formatDelta(trend)} vs prior month
        </p>
      )}
      {riskLabel && (
        <p className="mt-2 text-xs text-slate-500">{riskLabel}</p>
      )}
    </div>
  );
}
