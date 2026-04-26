"use client";

import * as React from "react";
import { Download } from "lucide-react";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type DashboardResponse = {
  counts: {
    leads: number;
    ebook_requests: number;
    full_access_registrations: number;
    ipon_challenge_registrations: number;
  };
  leads: Array<Record<string, unknown>>;
  ebook_requests: Array<Record<string, unknown>>;
  full_access_registrations: Array<Record<string, unknown>>;
  ipon_challenge_registrations: Array<Record<string, unknown>>;
};

const sessionKey = "pk_admin_key";
const PAGE_SIZE = 10;

function formatDate(value: unknown) {
  if (typeof value !== "string") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-PH");
}

function cellDisplay(key: string, value: unknown): string {
  if (key === "created_at" || key === "sent_at") return formatDate(value);
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value ?? "—");
}

function exportCsv(filename: string, rows: Array<Record<string, unknown>>, columns: Array<{ key: string; label: string }>) {
  const header = columns.map((c) => JSON.stringify(c.label)).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => JSON.stringify(cellDisplay(c.key, row[c.key])))
        .join(",")
    )
    .join("\n");
  const blob = new Blob([header + "\n" + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function TableBlock({
  title,
  rows,
  columns,
  csvFilename,
}: {
  title: string;
  rows: Array<Record<string, unknown>>;
  columns: Array<{ key: string; label: string }>;
  csvFilename: string;
}) {
  const [page, setPage] = React.useState(0);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <Card className="border-brand-primary/10 bg-white/80">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => exportCsv(csvFilename, rows, columns)}
          disabled={rows.length === 0}
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-brand-muted">No records yet.</p>
        ) : (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full text-left text-sm">
                <thead className="bg-white/90 text-xs uppercase tracking-[0.18em] text-brand-secondary">
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key} className="px-3 py-2">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row, index) => (
                    <tr
                      key={String(row.id ?? row.reference_id ?? index)}
                      className="border-t border-brand-primary/10 align-top"
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-3 py-3 text-brand-muted">
                          {cellDisplay(column.key, row[column.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-3 text-xs text-brand-muted">
              <span>
                Showing {page * PAGE_SIZE + 1}–
                {Math.min((page + 1) * PAGE_SIZE, rows.length)} of {rows.length}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded-md border border-brand-primary/15 px-2.5 py-1 transition hover:bg-brand-background disabled:opacity-40"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    className={`rounded-md border px-2.5 py-1 transition ${
                      i === page
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-brand-primary/15 hover:bg-brand-background"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="rounded-md border border-brand-primary/15 px-2.5 py-1 transition hover:bg-brand-background disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authenticated, setAuthenticated] = React.useState(false);
  const [dashboard, setDashboard] = React.useState<DashboardResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadDashboard = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/dashboard");
      const data = (await response.json()) as DashboardResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to load dashboard.");
      }

      sessionStorage.setItem(sessionKey, "1");
      setAuthenticated(true);
      setDashboard(data);
    } catch (err) {
      setError((err as Error).message);
      setDashboard(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      void loadDashboard();
    }
  }, [loadDashboard]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(data?.error || "Unable to login.");
      }

      setPassword("");
      await loadDashboard();
    } catch (err) {
      setError((err as Error).message);
      setAuthenticated(false);
      setDashboard(null);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    sessionStorage.removeItem(sessionKey);
    setAuthenticated(false);
    setDashboard(null);
    setUsername("");
    setPassword("");
    setError(null);
  };

  return (
    <div className="py-12">
      <Container className="space-y-8">
        <FadeIn className="space-y-3">
          <Badge>Admin</Badge>
          <h1 className="text-3xl font-semibold text-brand-primary">Live Submissions Dashboard</h1>
          <p className="max-w-3xl text-sm text-brand-muted">
            This panel reads live Supabase data for leads, ebook requests, full-access
            applications, and Ipon Challenge registrations through a protected backend route.
          </p>
        </FadeIn>

        <FadeIn>
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle className="text-base">Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
                <Input
                  placeholder="Admin username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Button type="submit" variant="gold" disabled={loading}>
                  {loading ? "Loading..." : authenticated ? "Refresh Dashboard" : "Login"}
                </Button>
                {authenticated ? (
                  <Button type="button" variant="outline" onClick={handleLogout}>
                    Log Out
                  </Button>
                ) : null}
              </form>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
            </CardContent>
          </Card>
        </FadeIn>

        {dashboard ? (
          <>
            <FadeIn className="grid gap-4 md:grid-cols-4">
              {[
                { label: "Leads", count: dashboard.counts.leads },
                { label: "Ebook Requests", count: dashboard.counts.ebook_requests },
                { label: "Full Access", count: dashboard.counts.full_access_registrations },
                { label: "Ipon Challenge", count: dashboard.counts.ipon_challenge_registrations },
              ].map(({ label, count }) => (
                <Card key={label} className="border-brand-primary/10 bg-white/80">
                  <CardHeader>
                    <CardTitle className="text-base">{label}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-3xl font-semibold text-brand-primary">
                    {count}
                  </CardContent>
                </Card>
              ))}
            </FadeIn>

            <FadeIn>
              <TableBlock
                title="Leads"
                rows={dashboard.leads}
                csvFilename="pk-leads.csv"
                columns={[
                  { key: "created_at", label: "Created" },
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "source_page", label: "Source" },
                  { key: "income_range", label: "Income" },
                  { key: "tags", label: "Tags" },
                  { key: "recommended_follow_up", label: "Follow Up" },
                ]}
              />
            </FadeIn>

            <FadeIn>
              <TableBlock
                title="Ebook Requests"
                rows={dashboard.ebook_requests}
                csvFilename="pk-ebook-requests.csv"
                columns={[
                  { key: "created_at", label: "Created" },
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "requested_resource", label: "Resource" },
                  { key: "status", label: "Status" },
                  { key: "source_page", label: "Source" },
                ]}
              />
            </FadeIn>

            <FadeIn>
              <TableBlock
                title="Full Access Applications"
                rows={dashboard.full_access_registrations}
                csvFilename="pk-full-access.csv"
                columns={[
                  { key: "created_at", label: "Created" },
                  { key: "reference_id", label: "Reference" },
                  { key: "first_name", label: "First Name" },
                  { key: "last_name", label: "Last Name" },
                  { key: "email", label: "Email" },
                  { key: "mobile", label: "Mobile" },
                  { key: "status", label: "Status" },
                ]}
              />
            </FadeIn>

            <FadeIn>
              <TableBlock
                title="Ipon Challenge Registrations"
                rows={dashboard.ipon_challenge_registrations}
                csvFilename="pk-ipon-challenge.csv"
                columns={[
                  { key: "created_at", label: "Created" },
                  { key: "reference_id", label: "Reference" },
                  { key: "first_name", label: "First Name" },
                  { key: "last_name", label: "Last Name" },
                  { key: "email", label: "Email" },
                  { key: "mobile", label: "Mobile" },
                  { key: "status", label: "Status" },
                ]}
              />
            </FadeIn>
          </>
        ) : null}
      </Container>
    </div>
  );
}
