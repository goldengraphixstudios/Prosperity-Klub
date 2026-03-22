"use client";

import * as React from "react";

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

function formatDate(value: unknown) {
  if (typeof value !== "string") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-PH");
}

function TableBlock({
  title,
  rows,
  columns,
}: {
  title: string;
  rows: Array<Record<string, unknown>>;
  columns: Array<{ key: string; label: string }>;
}) {
  return (
    <Card className="border-brand-primary/10 bg-white/80">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-brand-muted">No records yet.</p>
        ) : (
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
                {rows.map((row, index) => (
                  <tr
                    key={String(row.id ?? row.reference_id ?? index)}
                    className="border-t border-brand-primary/10 align-top"
                  >
                    {columns.map((column) => {
                      const value = row[column.key];
                      const displayValue =
                        column.key === "created_at" || column.key === "sent_at"
                          ? formatDate(value)
                          : Array.isArray(value)
                            ? value.join(", ")
                            : typeof value === "object" && value !== null
                              ? JSON.stringify(value)
                              : String(value ?? "—");
                      return (
                        <td key={column.key} className="px-3 py-3 text-brand-muted">
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
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
              <Card className="border-brand-primary/10 bg-white/80">
                <CardHeader>
                  <CardTitle className="text-base">Leads</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-brand-primary">
                  {dashboard.counts.leads}
                </CardContent>
              </Card>
              <Card className="border-brand-primary/10 bg-white/80">
                <CardHeader>
                  <CardTitle className="text-base">Ebook Requests</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-brand-primary">
                  {dashboard.counts.ebook_requests}
                </CardContent>
              </Card>
              <Card className="border-brand-primary/10 bg-white/80">
                <CardHeader>
                  <CardTitle className="text-base">Full Access</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-brand-primary">
                  {dashboard.counts.full_access_registrations}
                </CardContent>
              </Card>
              <Card className="border-brand-primary/10 bg-white/80">
                <CardHeader>
                  <CardTitle className="text-base">Ipon Challenge</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-brand-primary">
                  {dashboard.counts.ipon_challenge_registrations}
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <TableBlock
                title="Latest Leads"
                rows={dashboard.leads}
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
                title="Latest Ebook Requests"
                rows={dashboard.ebook_requests}
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
                title="Latest Full Access Applications"
                rows={dashboard.full_access_registrations}
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
                title="Latest Ipon Challenge Registrations"
                rows={dashboard.ipon_challenge_registrations}
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
