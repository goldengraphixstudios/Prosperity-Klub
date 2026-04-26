import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { sendLeadConfirmation, sendLeadOwnerNotification } from "@/lib/email";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const highIncomePatterns = ["40k", "80k", "100k", "120k"];

function computeTags({
  priorities,
  isOfw,
  incomeRange,
  sourcePage,
  requestedResource,
}: {
  priorities: string[];
  isOfw: boolean | null;
  incomeRange: string | null;
  sourcePage: string | null;
  requestedResource: string | null;
}) {
  const tags = new Set<string>();

  if (priorities.includes("Savings & Emergency Fund")) {
    tags.add("Savings-Lead");
  }
  if (priorities.includes("Health & Life Insurance")) {
    tags.add("Insurance-Interested");
    tags.add("HMO-Interested");
  }
  if (priorities.includes("Investment & Wealth Growth")) {
    tags.add("Investment-Ready");
  }
  if (priorities.includes("OFW Financial Planning")) {
    tags.add("OFW-Lead");
  }
  if (isOfw) {
    tags.add("OFW-Lead");
  }
  if (incomeRange && highIncomePatterns.some((pattern) => incomeRange.includes(pattern))) {
    tags.add("High-Income");
  }
  if (priorities.length <= 1) {
    tags.add("Exploratory");
  }
  if (sourcePage === "/resources") {
    tags.add("Resource-Lead");
  }
  if (requestedResource) {
    tags.add("Resource-Requested");
  }
  if (sourcePage === "/contact") {
    tags.add("Contact-Lead");
  }
  if (sourcePage === "/book") {
    tags.add("Booked-Lead");
  }
  if (sourcePage === "/membership") {
    tags.add("Membership-Interested");
  }
  if (priorities.length >= 3) {
    tags.add("Multi-Priority");
  }

  return Array.from(tags);
}

function isQualified({
  priorities,
  isOfw,
  incomeRange,
}: {
  priorities: string[];
  isOfw: boolean | null;
  incomeRange: string | null;
}) {
  const meetsIncome =
    incomeRange && highIncomePatterns.some((pattern) => incomeRange.includes(pattern));

  return Boolean(meetsIncome || priorities.length >= 2 || isOfw);
}

function computeFollowUp({
  sourcePage,
  qualified,
  tags,
  requestedResource,
}: {
  sourcePage: string | null;
  qualified: boolean;
  tags: string[];
  requestedResource: string | null;
}) {
  if (sourcePage === "/resources" && requestedResource) {
    return "Send ebook delivery email and invite to book a financial clarity session";
  }
  if (sourcePage === "/resources") return "Invite to book a financial clarity session";
  if (sourcePage === "/membership") return "Review onboarding fit and confirm membership path";
  if (qualified) return "Priority follow-up within 24 hours";
  if (tags.includes("Exploratory")) return "Send education-first follow-up";
  return "Standard guidance follow-up";
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase server configuration is missing." },
        { status: 500 }
      );
    }

    const data = await request.json();
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim() : "";

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const priorities = Array.isArray(data.priorities)
      ? data.priorities.filter((item: unknown) => typeof item === "string")
      : [];

    const isOfw = typeof data.is_ofw === "boolean" ? data.is_ofw : null;
    const incomeRange =
      typeof data.income_range === "string" ? data.income_range : null;
    const sourcePage =
      typeof data.source_page === "string" ? data.source_page : null;
    const requestedResource =
      typeof data.requested_resource === "string"
        ? data.requested_resource.trim()
        : null;
    const phone = typeof data.phone === "string" ? data.phone.trim() || null : null;
    const location = typeof data.location === "string" ? data.location.trim() || null : null;

    const tags = computeTags({
      priorities,
      isOfw,
      incomeRange,
      sourcePage,
      requestedResource,
    });
    const qualified = isQualified({ priorities, isOfw, incomeRange });
    const recommendedFollowUp = computeFollowUp({
      sourcePage,
      qualified,
      tags,
      requestedResource,
    });

    const { error } = await supabase.from("leads").insert({
      reference_id: randomUUID(),
      name,
      email,
      phone,
      location,
      is_ofw: isOfw,
      income_range: incomeRange,
      priorities,
      tags,
      is_qualified: qualified,
      source_page: sourcePage,
      requested_resource: requestedResource,
      recommended_follow_up: recommendedFollowUp,
      status: "new",
      notes: {},
    });

    if (error) {
      throw new Error(error.message);
    }

    await Promise.allSettled([
      sendLeadOwnerNotification({
        name,
        email,
        phone,
        location,
        isOfw,
        incomeRange,
        priorities,
        sourcePage,
        requestedResource,
        tags,
        qualified,
        recommendedFollowUp,
      }),
      sendLeadConfirmation({ to: email, name }),
    ]);

    return NextResponse.json({ ok: true, stored: "supabase" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
