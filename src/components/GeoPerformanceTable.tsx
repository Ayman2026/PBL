import type { GeoPerformance } from "@/lib/types";
import { formatPct } from "@/lib/analytics";
import { RiskBadge } from "./RiskBadge";

interface GeoPerformanceTableProps {
  title: string;
  data: GeoPerformance[];
  variant: "priority" | "top";
}

export function GeoPerformanceTable({ title, data, variant }: GeoPerformanceTableProps) {
  const rows =
    variant === "priority"
      ? data.slice(0, 8)
      : [...data].sort((a, b) => a.priorityScore - b.priorityScore).slice(0, 8);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">
          {variant === "priority"
            ? "Geographies needing follow-up first"
            : "Highest-performing geographies"}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Geography</th>
              <th className="px-5 py-3">Schools</th>
              <th className="px-5 py-3">Participation</th>
              <th className="px-5 py-3">Evidence</th>
              <th className="px-5 py-3">Attendance</th>
              <th className="px-5 py-3">Risk</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{row.name}</td>
                <td className="px-5 py-3 text-slate-600">
                  {row.participatingSchools}/{row.totalSchools}
                </td>
                <td className="px-5 py-3">{formatPct(row.participationRate)}</td>
                <td className="px-5 py-3">{formatPct(row.evidenceSubmissionRate)}</td>
                <td className="px-5 py-3">{formatPct(row.attendanceRate)}</td>
                <td className="px-5 py-3">
                  <RiskBadge status={row.overallRisk} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
