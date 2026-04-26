import { readFileSync } from "fs";
import { join } from "path";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "Prosperity Klub <onboarding@resend.dev>";
const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "goldengraphixstudios@gmail.com";

// Brand colours used inline for email clients that strip <style>
const C = {
  primary: "#1a3679",
  gold: "#b38124",
  muted: "#5f6b7f",
  bg: "#f5f6fa",
  white: "#ffffff",
};

function layout(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${C.bg};font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:${C.white};border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr><td style="height:5px;background:linear-gradient(90deg,${C.primary},${C.gold},#94a6cf);"></td></tr>
        <tr><td style="padding:32px 36px 24px;">
          ${body}
        </td></tr>
        <tr><td style="padding:16px 36px 24px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:${C.muted};line-height:1.6;">
            Prosperity Klub · Financial Growth Community under International Marketing Group (IMG)<br>
            You received this because you interacted with Prosperity Klub.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function heading(text: string) {
  return `<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${C.primary};line-height:1.3;">${text}</h1>`;
}

function para(text: string) {
  return `<p style="margin:12px 0;font-size:15px;color:${C.muted};line-height:1.7;">${text}</p>`;
}

function goldBtn(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;margin-top:8px;padding:12px 28px;background:${C.gold};color:${C.white};text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">${label}</a>`;
}

function divider() {
  return `<hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">`;
}

// ─── Ebook delivery ────────────────────────────────────────────────────────────

export async function sendEbookDelivery({
  to,
  name,
  requestedResource,
}: {
  to: string;
  name: string;
  requestedResource: string;
}) {
  const pdfPath = join(process.cwd(), "private/resources/the-secret-to-saving-and-building-your-future.pdf");
  const pdfBuffer = readFileSync(pdfPath);

  const html = layout(`
    ${heading(`Hi ${name.split(" ")[0] || name}, here's your free ebook!`)}
    ${para(`Thank you for requesting <strong>${requestedResource}</strong>. We've attached your copy of <strong>The Secret to Saving and Building Your Future</strong> to this email.`)}
    ${para("Inside, you'll find a guided roadmap covering protection, savings discipline, and long-term wealth growth — designed specifically for Filipinos who want to take control of their finances.")}
    ${divider()}
    ${para("Ready to go deeper? Book a free financial clarity session and we'll walk you through a personalised plan.")}
    ${goldBtn("Book a Free Clarity Session", "https://prosperityklub.com/book")}
  `);

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your Free Ebook: The Secret to Saving and Building Your Future",
    html,
    attachments: [
      {
        filename: "The-Secret-to-Saving-and-Building-Your-Future.pdf",
        content: pdfBuffer,
      },
    ],
  });
}

// ─── Ebook owner notification ──────────────────────────────────────────────────

export async function sendEbookOwnerNotification({
  name,
  email,
  requestedResource,
  sourcePage,
}: {
  name: string;
  email: string;
  requestedResource: string;
  sourcePage: string;
}) {
  const html = layout(`
    ${heading("New Ebook Request")}
    ${para(`<strong>${name}</strong> (<a href="mailto:${email}" style="color:${C.gold};">${email}</a>) just requested the free ebook.`)}
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0;">
      <tr><td style="padding:8px 12px;background:${C.bg};color:${C.muted};width:40%;border-radius:6px 0 0 6px;">Resource</td><td style="padding:8px 12px;background:${C.bg};color:${C.primary};border-radius:0 6px 6px 0;">${requestedResource}</td></tr>
      <tr><td style="padding:8px 12px;color:${C.muted};">Source page</td><td style="padding:8px 12px;color:${C.primary};">${sourcePage}</td></tr>
    </table>
    ${para("The ebook has been automatically emailed to them. Their details are now in the admin dashboard.")}
    ${goldBtn("View Admin Dashboard", "https://prosperityklub.com/admin")}
  `);

  await resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    subject: `New Ebook Request — ${name}`,
    html,
  });
}

// ─── Lead owner notification ───────────────────────────────────────────────────

export async function sendLeadOwnerNotification({
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
}: {
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  isOfw: boolean | null;
  incomeRange: string | null;
  priorities: string[];
  sourcePage: string | null;
  requestedResource: string | null;
  tags: string[];
  qualified: boolean;
  recommendedFollowUp: string;
}) {
  const rows = [
    ["Email", `<a href="mailto:${email}" style="color:${C.gold};">${email}</a>`],
    ["Phone", phone ?? "—"],
    ["Location", location ?? "—"],
    ["OFW", isOfw === true ? "Yes" : isOfw === false ? "No" : "—"],
    ["Income range", incomeRange ?? "—"],
    ["Priorities", priorities.join(", ") || "—"],
    ["Source", sourcePage ?? "—"],
    ["Resource", requestedResource ?? "—"],
    ["Tags", tags.join(", ") || "—"],
    ["Qualified", qualified ? "✅ Yes" : "No"],
    ["Follow-up", recommendedFollowUp],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;background:${C.bg};color:${C.muted};width:35%;border-radius:4px 0 0 4px;">${k}</td><td style="padding:6px 12px;background:${C.bg};color:${C.primary};border-radius:0 4px 4px 0;">${v}</td></tr>`
    )
    .join("<tr><td colspan='2' style='height:4px;'></td></tr>");

  const html = layout(`
    ${heading(`New Lead — ${name}`)}
    ${qualified ? `<p style="display:inline-block;padding:4px 12px;background:${C.gold};color:${C.white};border-radius:20px;font-size:12px;font-weight:600;margin:0 0 16px;">QUALIFIED LEAD</p>` : ""}
    <table style="width:100%;border-collapse:separate;border-spacing:0 4px;font-size:14px;">
      ${rows}
    </table>
    ${goldBtn("View Admin Dashboard", "https://prosperityklub.com/admin")}
  `);

  await resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    subject: `${qualified ? "🔥 Qualified" : "New"} Lead — ${name}`,
    html,
  });
}

// ─── Lead user confirmation ────────────────────────────────────────────────────

export async function sendLeadConfirmation({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const html = layout(`
    ${heading(`Hi ${name.split(" ")[0] || name}, we received your message!`)}
    ${para("Thank you for reaching out to Prosperity Klub. Our team will review your details and get back to you within 24 hours.")}
    ${para("In the meantime, feel free to explore our resources or book a free financial clarity session if you'd like to speak with us sooner.")}
    ${divider()}
    ${goldBtn("Book a Free Clarity Session", "https://prosperityklub.com/book")}
    <a href="https://prosperityklub.com/resources" style="display:inline-block;margin-top:8px;margin-left:12px;padding:12px 28px;background:transparent;color:${C.primary};text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;border:1.5px solid ${C.primary};">Browse Resources</a>
  `);

  await resend.emails.send({
    from: FROM,
    to,
    subject: "We got your message — Prosperity Klub",
    html,
  });
}

// ─── Membership confirmation (shared for both plans) ──────────────────────────

export async function sendMembershipConfirmation({
  to,
  firstName,
  plan,
}: {
  to: string;
  firstName: string;
  plan: "Full Access" | "Ipon Challenge";
}) {
  const planDetails =
    plan === "Full Access"
      ? "Full Access membership includes life insurance, healthcare, investments, and a full wealth-building system."
      : "Ipon Challenge is a guided savings and protection program to help you build your financial foundation.";

  const html = layout(`
    ${heading(`Welcome to Prosperity Klub, ${firstName}!`)}
    <p style="display:inline-block;padding:4px 14px;background:${C.gold};color:${C.white};border-radius:20px;font-size:12px;font-weight:600;margin:0 0 16px;">${plan}</p>
    ${para("Thank you for registering. Your application has been received and our team will review your details and reach out within 24–48 hours to guide you through the next steps.")}
    ${para(planDetails)}
    ${divider()}
    ${para("While you wait, feel free to explore our learning materials:")}
    ${goldBtn("Browse Resources", "https://prosperityklub.com/resources")}
    <a href="https://prosperityklub.com/book" style="display:inline-block;margin-top:8px;margin-left:12px;padding:12px 28px;background:transparent;color:${C.primary};text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;border:1.5px solid ${C.primary};">Book a Clarity Session</a>
  `);

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your ${plan} registration is confirmed — Prosperity Klub`,
    html,
  });
}

// ─── Membership owner notification ────────────────────────────────────────────

export async function sendMembershipOwnerNotification({
  firstName,
  lastName,
  email,
  mobile,
  plan,
  referenceId,
}: {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string | null;
  plan: "Full Access" | "Ipon Challenge";
  referenceId: string;
}) {
  const html = layout(`
    ${heading(`New ${plan} Registration`)}
    ${para(`<strong>${firstName} ${lastName}</strong> just signed up for the <strong>${plan}</strong> plan.`)}
    <table style="width:100%;border-collapse:separate;border-spacing:0 4px;font-size:14px;">
      <tr><td style="padding:6px 12px;background:${C.bg};color:${C.muted};width:35%;border-radius:4px 0 0 4px;">Email</td><td style="padding:6px 12px;background:${C.bg};color:${C.primary};border-radius:0 4px 4px 0;"><a href="mailto:${email}" style="color:${C.gold};">${email}</a></td></tr>
      <tr><td colspan='2' style='height:4px;'></td></tr>
      <tr><td style="padding:6px 12px;background:${C.bg};color:${C.muted};border-radius:4px 0 0 4px;">Mobile</td><td style="padding:6px 12px;background:${C.bg};color:${C.primary};border-radius:0 4px 4px 0;">${mobile ?? "—"}</td></tr>
      <tr><td colspan='2' style='height:4px;'></td></tr>
      <tr><td style="padding:6px 12px;background:${C.bg};color:${C.muted};border-radius:4px 0 0 4px;">Ref ID</td><td style="padding:6px 12px;background:${C.bg};color:${C.primary};border-radius:0 4px 4px 0;font-family:monospace;">${referenceId}</td></tr>
    </table>
    ${goldBtn("View Admin Dashboard", "https://prosperityklub.com/admin")}
  `);

  await resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    subject: `New ${plan} Registration — ${firstName} ${lastName}`,
    html,
  });
}

// ─── Financial check-up result confirmation ────────────────────────────────────

export async function sendCheckupConfirmation({
  to,
  name,
  score,
  tier,
}: {
  to: string;
  name: string;
  score: number;
  tier: "green" | "amber" | "red";
}) {
  const tierLabel =
    tier === "green" ? "Financially On Track" : tier === "amber" ? "Borderline" : "Needs Attention";
  const tierColor = tier === "green" ? "#16a34a" : tier === "amber" ? "#b45309" : "#dc2626";
  const message =
    tier === "green"
      ? "You're doing well! Keep building on your solid foundation and explore how to grow your wealth further."
      : tier === "amber"
      ? "You have some gaps worth addressing. A free financial clarity session can help you prioritise the right moves."
      : "Your results show some financial vulnerabilities that need immediate attention. Don't worry — there's a clear path forward.";

  const html = layout(`
    ${heading(`Hi ${name.split(" ")[0] || name}, here are your check-up results!`)}
    <div style="text-align:center;padding:24px;background:${C.bg};border-radius:12px;margin:16px 0;">
      <div style="font-size:40px;font-weight:700;color:${tierColor};">${score}/8</div>
      <div style="font-size:14px;font-weight:600;color:${tierColor};margin-top:4px;">${tierLabel}</div>
      <div style="font-size:13px;color:${C.muted};margin-top:8px;">YES answers to the 8 financial vulnerability questions</div>
    </div>
    ${para(message)}
    ${divider()}
    ${para("Book a free session and we'll help you build a personalised financial plan based on your results.")}
    ${goldBtn("Book a Free Clarity Session", "https://prosperityklub.com/book")}
    <a href="https://prosperityklub.com/resources" style="display:inline-block;margin-top:8px;margin-left:12px;padding:12px 28px;background:transparent;color:${C.primary};text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;border:1.5px solid ${C.primary};">Browse Resources</a>
  `);

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your Financial Check-up Results — Prosperity Klub`,
    html,
  });
}
