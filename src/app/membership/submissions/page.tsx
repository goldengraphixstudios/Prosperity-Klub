"use client";

import * as React from "react";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const storageKey = "pk_membership_submissions";

type Submission = {
  referenceId: string;
  timestamp: string;
  formType: "full_access" | "ipon_challenge";
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  genderOther: string;
  civilStatus: string;
  civilStatusOther: string;
  dateOfBirth: string;
  placeOfBirth: string;
  age: string;
  weight: string;
  height: string;
  citizenship: string;
  email: string;
  mobile: string;
  consent: boolean;
  userAgent: string;
};

const csvFields = [
  "referenceId",
  "timestamp",
  "formType",
  "firstName",
  "middleName",
  "lastName",
  "gender",
  "genderOther",
  "civilStatus",
  "civilStatusOther",
  "dateOfBirth",
  "placeOfBirth",
  "age",
  "weight",
  "height",
  "citizenship",
  "email",
  "mobile",
  "consent",
  "userAgent",
];

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadCsv(filename: string, rows: (string | number | boolean)[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const text = String(cell ?? "");
          if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
            return `"${text.replace(/\"/g, "\"\"")}"`;
          }
          return text;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function MembershipSubmissionsPage() {
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      setSubmissions(JSON.parse(stored) as Submission[]);
    } catch {
      setSubmissions([]);
    }
  }, []);

  const handleExportJson = () => {
    downloadJson("pk-membership-submissions.json", submissions);
  };

  const handleExportCsv = () => {
    const rows: (string | number | boolean)[][] = [csvFields];
    submissions.forEach((submission) => {
      rows.push(
        csvFields.map(
          (field) => (submission as Record<string, string | boolean>)[field] ?? ""
        )
      );
    });
    downloadCsv("pk-membership-submissions.csv", rows);
  };

  return (
    <div className="py-12">
      <Container className="space-y-6">
        <FadeIn className="space-y-2">
          <Badge>Admin</Badge>
          <h1 className="text-3xl font-semibold text-brand-primary">
            Membership Submissions
          </h1>
          <p className="text-sm text-brand-muted">
            Local-only view. Submissions are stored in this browser only (no backend yet).
          </p>
        </FadeIn>

        <FadeIn>
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base">Stored Submissions</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={handleExportJson}>
                  Export JSON
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportCsv}>
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <p className="text-sm text-brand-muted">
                  No submissions stored in localStorage yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-[900px] w-full text-left text-sm">
                    <thead className="bg-white/90 text-xs uppercase text-brand-secondary">
                      <tr>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Mobile</th>
                        <th className="px-3 py-2">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => (
                        <tr key={submission.referenceId} className="border-t">
                          <td className="px-3 py-2">
                            {new Date(submission.timestamp).toLocaleString("en-PH")}
                          </td>
                          <td className="px-3 py-2">
                            {submission.formType === "full_access"
                              ? "Full Access"
                              : "Ipon Challenge"}
                          </td>
                          <td className="px-3 py-2">
                            {submission.firstName} {submission.lastName}
                          </td>
                          <td className="px-3 py-2">{submission.email}</td>
                          <td className="px-3 py-2">{submission.mobile}</td>
                          <td className="px-3 py-2">{submission.referenceId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </div>
  );
}
