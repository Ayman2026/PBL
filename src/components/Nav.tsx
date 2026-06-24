import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Mantra4Change
          </p>
          <h1 className="text-lg font-bold text-slate-900">
            PBL Program Intelligence
          </h1>
        </div>
        <nav className="flex gap-1 rounded-lg bg-slate-100 p-1">
          <Link
            href="/"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white hover:text-teal-700"
          >
            Program Review
          </Link>
          <Link
            href="/grant"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white hover:text-teal-700"
          >
            Grant Reporting
          </Link>
        </nav>
      </div>
    </header>
  );
}
