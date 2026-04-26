"use client";

import * as React from "react";
import {
  BookOpen,
  ChevronDown,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Search,
  Shield,
  Star,
  Users,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DashboardData = {
  counts: {
    leads: number;
    ebook_requests: number;
    full_access_registrations: number;
    ipon_challenge_registrations: number;
  };
  leads: Row[];
  ebook_requests: Row[];
  full_access_registrations: Row[];
  ipon_challenge_registrations: Row[];
};

type Row = Record<string, unknown>;

type Section = "overview" | "leads" | "ebook_requests" | "full_access" | "ipon_challenge";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SESSION_KEY = "pk_admin_key";
const PAGE_SIZE = 15;

function fmt(key: string, value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (key === "created_at" || key === "sent_at" || key === "updated_at") {
    const d = new Date(String(value));
    return isNaN(d.getTime()) ? String(value) : d.toLocaleString("en-PH");
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function exportCsv(filename: string, rows: Row[], cols: Col[]) {
  const header = cols.map((c) => `"${c.label}"`).join(",");
  const body = rows.map((r) => cols.map((c) => `"${fmt(c.key, r[c.key]).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([header + "\n" + body], { type: "text/csv" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: filename });
  a.click();
  URL.revokeObjectURL(a.href);
}

function rowSearch(row: Row, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return Object.values(row).some((v) => fmt("", v).toLowerCase().includes(q));
}

// ─── Column configs ────────────────────────────────────────────────────────────

type Col = { key: string; label: string; badge?: boolean };

const COLS: Record<string, Col[]> = {
  leads: [
    { key: "created_at", label: "Date" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
    { key: "is_ofw", label: "OFW" },
    { key: "income_range", label: "Income" },
    { key: "priorities", label: "Priorities" },
    { key: "tags", label: "Tags" },
    { key: "is_qualified", label: "Qualified", badge: true },
    { key: "source_page", label: "Source" },
    { key: "recommended_follow_up", label: "Follow-up" },
    { key: "status", label: "Status", badge: true },
  ],
  ebook_requests: [
    { key: "created_at", label: "Date" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "requested_resource", label: "Resource" },
    { key: "status", label: "Status", badge: true },
    { key: "delivery_method", label: "Delivery" },
    { key: "source_page", label: "Source" },
  ],
  full_access: [
    { key: "created_at", label: "Date" },
    { key: "reference_id", label: "Ref ID" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile" },
    { key: "gender", label: "Gender" },
    { key: "civil_status", label: "Civil Status" },
    { key: "date_of_birth", label: "DOB" },
    { key: "age", label: "Age" },
    { key: "citizenship", label: "Citizenship" },
    { key: "status", label: "Status", badge: true },
  ],
  ipon_challenge: [
    { key: "created_at", label: "Date" },
    { key: "reference_id", label: "Ref ID" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile" },
    { key: "gender", label: "Gender" },
    { key: "civil_status", label: "Civil Status" },
    { key: "date_of_birth", label: "DOB" },
    { key: "age", label: "Age" },
    { key: "citizenship", label: "Citizenship" },
    { key: "status", label: "Status", badge: true },
  ],
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ value }: { value: string }) {
  const v = String(value).toLowerCase();
  const cls =
    v === "new" ? "bg-blue-100 text-blue-700" :
    v === "delivered" ? "bg-emerald-100 text-emerald-700" :
    v === "pending" ? "bg-amber-100 text-amber-800" :
    v === "true" || v === "yes" ? "bg-emerald-100 text-emerald-700" :
    v === "false" || v === "no" ? "bg-slate-100 text-slate-500" :
    "bg-slate-100 text-slate-600";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{value}</span>;
}

function DataTable({ rows, cols, csvName }: { rows: Row[]; cols: Col[]; csvName: string }) {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [expandedRow, setExpandedRow] = React.useState<number | null>(null);

  const filtered = React.useMemo(() => rows.filter((r) => rowSearch(r, query)), [rows, query]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  React.useEffect(() => setPage(0), [query]);

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="search"
            placeholder="Search all columns…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1a3679]/40 focus:outline-none focus:ring-2 focus:ring-[#1a3679]/10"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <span className="text-xs text-slate-400">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        <button
          onClick={() => exportCsv(csvName, filtered, cols)}
          disabled={filtered.length === 0}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FileText className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">{query ? "No records match your search." : "No records yet."}</p>
          </div>
        ) : (
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {cols.slice(0, 6).map((c) => (
                  <th key={c.key} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {c.label}
                  </th>
                ))}
                {cols.length > 6 && <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">More</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((row, i) => {
                const globalIdx = page * PAGE_SIZE + i;
                const isExpanded = expandedRow === globalIdx;
                return (
                  <React.Fragment key={globalIdx}>
                    <tr
                      className={`transition-colors hover:bg-slate-50 ${isExpanded ? "bg-slate-50" : ""}`}
                    >
                      {cols.slice(0, 6).map((c) => (
                        <td key={c.key} className="px-4 py-3 text-slate-600 max-w-[200px] truncate">
                          {c.badge ? <StatusBadge value={fmt(c.key, row[c.key])} /> : fmt(c.key, row[c.key])}
                        </td>
                      ))}
                      {cols.length > 6 && (
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setExpandedRow(isExpanded ? null : globalIdx)}
                            className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 transition hover:bg-white hover:text-slate-700"
                          >
                            {isExpanded ? "Hide" : "View all"}
                            <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        </td>
                      )}
                    </tr>
                    {isExpanded && (
                      <tr className="bg-[#f8faff]">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-3 lg:grid-cols-4">
                            {cols.map((c) => (
                              <div key={c.key} className="space-y-0.5">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
                                <p className="text-xs text-slate-700 break-all">
                                  {c.badge ? <StatusBadge value={fmt(c.key, row[c.key])} /> : fmt(c.key, row[c.key])}
                                </p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg border border-slate-200 px-3 py-1.5 transition hover:bg-white disabled:opacity-40"
            >
              ←
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const p = totalPages <= 7 ? i : i === 0 ? 0 : i === 6 ? totalPages - 1 : page - 2 + i;
              return (
                <button
                  key={i}
                  onClick={() => setPage(p)}
                  className={`min-w-[32px] rounded-lg border px-2 py-1.5 transition ${p === page ? "border-[#1a3679] bg-[#1a3679] text-white" : "border-slate-200 hover:bg-white"}`}
                >
                  {p + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 transition hover:bg-white disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, count, color }: { icon: React.ElementType; label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1a3679]">{count}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// ─── Login screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin, error, loading }: { onLogin: (u: string, p: string) => void; error: string | null; loading: boolean }) {
  const [u, setU] = React.useState("");
  const [p, setP] = React.useState("");
  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-[#f5f6fa] to-[#e8ecf5] px-4">
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a3679] shadow-lg shadow-[#1a3679]/25">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a3679]">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Prosperity Klub · Internal Access</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <form
            onSubmit={(e) => { e.preventDefault(); onLogin(u, p); }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Username</label>
              <input
                autoComplete="username"
                value={u}
                onChange={(e) => setU(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1a3679]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3679]/10 transition"
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={p}
                onChange={(e) => setP(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1a3679]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3679]/10 transition"
                placeholder="Enter password"
              />
            </div>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#1a3679] py-3 text-sm font-semibold text-white transition hover:bg-[#1a3679]/90 disabled:opacity-60 shadow-md shadow-[#1a3679]/20"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Main dashboard ────────────────────────────────────────────────────────────

const NAV: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Users },
  { id: "ebook_requests", label: "Ebook Requests", icon: BookOpen },
  { id: "full_access", label: "Full Access", icon: Star },
  { id: "ipon_challenge", label: "Ipon Challenge", icon: FileText },
];

function Dashboard({ data, onLogout, onRefresh, refreshing }: {
  data: DashboardData;
  onLogout: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const [section, setSection] = React.useState<Section>("overview");

  const sectionRows: Record<Section, Row[]> = {
    overview: [],
    leads: data.leads,
    ebook_requests: data.ebook_requests,
    full_access: data.full_access_registrations,
    ipon_challenge: data.ipon_challenge_registrations,
  };

  const sectionCols: Record<Section, Col[]> = {
    overview: [],
    leads: COLS.leads,
    ebook_requests: COLS.ebook_requests,
    full_access: COLS.full_access,
    ipon_challenge: COLS.ipon_challenge,
  };

  const csvNames: Record<Section, string> = {
    overview: "",
    leads: "pk-leads.csv",
    ebook_requests: "pk-ebook-requests.csv",
    full_access: "pk-full-access.csv",
    ipon_challenge: "pk-ipon-challenge.csv",
  };

  return (
    <div className="flex min-h-full bg-[#f5f6fa]">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a3679]">
            <Shield className="h-4.5 w-4.5 text-white h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1a3679] leading-tight">Prosperity Klub</p>
            <p className="text-[10px] text-slate-400">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map(({ id, label, icon: Icon }) => {
            const count =
              id === "leads" ? data.counts.leads :
              id === "ebook_requests" ? data.counts.ebook_requests :
              id === "full_access" ? data.counts.full_access_registrations :
              id === "ipon_challenge" ? data.counts.ipon_challenge_registrations : null;

            return (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  section === id
                    ? "bg-[#1a3679] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </span>
                {count !== null && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    section === id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 px-3 py-4 space-y-1">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing…" : "Refresh Data"}
          </button>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-lg font-bold text-[#1a3679]">
              {NAV.find((n) => n.id === section)?.label}
            </h1>
            <p className="text-xs text-slate-400">
              Last refreshed: {new Date().toLocaleString("en-PH")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-500">Connected to Supabase</span>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Overview */}
          {section === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Users} label="Total Leads" count={data.counts.leads} color="bg-[#1a3679]" />
                <StatCard icon={BookOpen} label="Ebook Requests" count={data.counts.ebook_requests} color="bg-[#b38124]" />
                <StatCard icon={Star} label="Full Access Applications" count={data.counts.full_access_registrations} color="bg-emerald-600" />
                <StatCard icon={FileText} label="Ipon Challenge Registrations" count={data.counts.ipon_challenge_registrations} color="bg-violet-600" />
              </div>

              {/* Recent activity across all tables */}
              <div className="grid gap-6 lg:grid-cols-2">
                {(["leads", "ebook_requests", "full_access", "ipon_challenge"] as Section[]).map((id) => {
                  const rows = sectionRows[id].slice(0, 5);
                  const label = NAV.find((n) => n.id === id)!.label;
                  return (
                    <div key={id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#1a3679]">{label}</h3>
                        <button
                          onClick={() => setSection(id)}
                          className="text-xs font-medium text-[#b38124] transition hover:underline"
                        >
                          View all →
                        </button>
                      </div>
                      {rows.length === 0 ? (
                        <p className="text-xs text-slate-400">No records yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {rows.map((row, i) => (
                            <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-700">
                                  {String(row.name ?? (row.first_name ? `${row.first_name} ${row.last_name}` : "—"))}
                                </p>
                                <p className="truncate text-xs text-slate-400">{String(row.email ?? "—")}</p>
                              </div>
                              <StatusBadge value={fmt("status", row.status)} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Data sections */}
          {section !== "overview" && (
            <DataTable
              rows={sectionRows[section]}
              cols={sectionCols[section]}
              csvName={csvNames[section]}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Root component ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = React.useState(false);
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDashboard = React.useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/dashboard", { credentials: "include" });
      const json = (await res.json()) as DashboardData & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to load dashboard.");
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setData(json);
    } catch (err) {
      setError((err as Error).message);
      if (!silent) { setAuthed(false); setData(null); }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Auto-restore session
  React.useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) void fetchDashboard();
  }, [fetchDashboard]);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const json = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(json?.error ?? "Invalid credentials.");
      await fetchDashboard();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" }).catch(() => null);
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setData(null);
    setError(null);
  };

  // Full-screen overlay — covers the site Navbar/Footer completely
  return (
    <div className="fixed inset-0 z-[999] overflow-auto bg-[#f5f6fa]">
      {!authed || !data ? (
        <LoginScreen onLogin={handleLogin} error={error} loading={loading} />
      ) : (
        <Dashboard
          data={data}
          onLogout={handleLogout}
          onRefresh={() => fetchDashboard(true)}
          refreshing={refreshing}
        />
      )}
    </div>
  );
}
