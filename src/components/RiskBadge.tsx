import type { RiskStatus } from "@/lib/types";
import { riskColor } from "@/lib/risk";

export function RiskBadge({ status }: { status: RiskStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${riskColor(status)}`}
    >
      {status}
    </span>
  );
}
