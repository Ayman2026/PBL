"use client";

import type { ProgramFilters, ReportingMonth } from "@/lib/types";
import { MONTHS, monthLabel } from "@/lib/analytics";

interface ProgramFiltersBarProps {
  filters: ProgramFilters;
  districts: string[];
  blocks: string[];
  onChange: (filters: ProgramFilters) => void;
}

export function ProgramFiltersBar({
  filters,
  districts,
  blocks,
  onChange,
}: ProgramFiltersBarProps) {
  const filteredBlocks =
    filters.district === "All"
      ? blocks
      : blocks.filter((b) => b.startsWith(filters.district));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Filters
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <FilterSelect
          label="Month"
          value={filters.month}
          options={MONTHS.map((m) => ({ value: m, label: monthLabel(m) }))}
          onChange={(month) => onChange({ ...filters, month: month as ReportingMonth })}
        />
        <FilterSelect
          label="District"
          value={filters.district}
          options={[{ value: "All", label: "All districts" }, ...districts.map((d) => ({ value: d, label: d }))]}
          onChange={(district) =>
            onChange({ ...filters, district, block: district === "All" ? "All" : filters.block })
          }
        />
        <FilterSelect
          label="Block"
          value={filters.block}
          options={[{ value: "All", label: "All blocks" }, ...filteredBlocks.map((b) => ({ value: b, label: b }))]}
          onChange={(block) => onChange({ ...filters, block })}
        />
        <FilterSelect
          label="Grade"
          value={filters.grade}
          options={["All", "6", "7", "8"].map((g) => ({
            value: g,
            label: g === "All" ? "All grades" : `Class ${g}`,
          }))}
          onChange={(grade) => onChange({ ...filters, grade })}
        />
        <FilterSelect
          label="Subject"
          value={filters.subject}
          options={["All", "Math", "Science"].map((s) => ({
            value: s,
            label: s === "All" ? "All subjects" : s,
          }))}
          onChange={(subject) => onChange({ ...filters, subject })}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
