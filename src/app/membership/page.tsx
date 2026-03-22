"use client";

import * as React from "react";
import Link from "next/link";

import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { submitToFormspree } from "@/lib/formspree";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const fullAccessHighlights = [
  "Financial Education (FREE)",
  "Unlimited Trainings (FREE)",
  "Unlimited Workshops (FREE, with certificates)",
  "100,000 Personal Accident Insurance",
  "50,000 Life Insurance (memorial services)",
  "1,000 mutual fund investment with zero entry fee",
];

const fullAccessSections = [
  {
    title: "Education & Growth",
    items: [
      "Financial Education (FREE)",
      "Unlimited Trainings (FREE)",
      "Unlimited Workshops (FREE with Certificates)",
      "Discounts on associate financial planner certification",
      "Helping you add your skills",
    ],
  },
  {
    title: "Protection & Healthcare",
    items: [
      "100,000 Personal Accident Insurance",
      "50,000 Life Insurance (memorial services)",
      "Free eye consultation from Kaiser and IMG",
      "Free eye frames from Kaiser and IMG",
      "Free UNLIMITED medical consultation at Kaiser Medical Centers",
      "Discount on medical laboratory tests",
      "24/7 assistance from memorial concierge",
      "Worldwide protection (International coded members)",
      "Accidental disablement benefit (International coded members)",
    ],
  },
  {
    title: "Savings, Investments, and Cashflow",
    items: [
      "1,000 investment in mutual fund with zero entry fee",
      "Helping you to increase your cash flow",
    ],
  },
  {
    title: "Discounts & Lifestyle Perks",
    items: [
      "Discounts on car purchases",
      "Discounts on vehicle insurance, fire insurance, etc.",
      "Discounts on Real Estate",
      "Discounts on Non-Life Insurance",
      "Discounts on Special Courses",
    ],
  },
  {
    title: "Community, Events, Opportunities",
    items: [
      "Recognitions",
      "Exclusive Events (International coded members)",
      "Direct access to financial industry companies",
      "FREE access to donation programs",
      "FREE legal assistance program",
      "FREE travels and travel to many countries",
      "Having job opportunities",
      "Having your own business in the financial industry",
      "Having access to Non-Life Insurance and HMO industries",
      "Exclusive Facebook Community",
      "Personal portal for benefits",
      "Free weekly webinar inside the community",
      "Access to job postings from our network",
      "Community chats to cater your needs",
      "Meet & greets in any parts of the world",
    ],
  },
];

const iponHighlights = [
  "20,000 Personal Accident Insurance",
  "Exclusive Members Group Chat (iponaryo)",
  "Access to Zoom Seminars and Financial Coaching",
  "Option to upgrade to Full Access",
];

type FormType = "full_access" | "ipon_challenge";

type MembershipForm = {
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
};

type Submission = MembershipForm & {
  referenceId: string;
  timestamp: string;
  formType: FormType;
};

const emptyForm: MembershipForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  genderOther: "",
  civilStatus: "",
  civilStatusOther: "",
  dateOfBirth: "",
  placeOfBirth: "",
  age: "",
  weight: "",
  height: "",
  citizenship: "",
  email: "",
  mobile: "",
  consent: false,
};

function buildReferenceId() {
  return `PK-${Date.now().toString(36).slice(-6).toUpperCase()}`;
}

function MembershipApplicationFields({
  formKey,
  formData,
  updateField,
  formError,
  submitting,
  submitLabel,
  onClear,
}: {
  formKey: FormType;
  formData: MembershipForm;
  updateField: (field: keyof MembershipForm, value: string | boolean) => void;
  formError: string | null;
  submitting: boolean;
  submitLabel: string;
  onClear: () => void;
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-primary">First Name*</label>
          <Input
            value={formData.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-primary">Middle Name*</label>
          <Input
            value={formData.middleName}
            onChange={(event) => updateField("middleName", event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-primary">Last Name*</label>
          <Input
            value={formData.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-brand-primary">Gender*</label>
          <div className="flex flex-wrap gap-3 text-sm text-brand-muted">
            {[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`${formKey}-gender`}
                  value={option.value}
                  checked={formData.gender === option.value}
                  onChange={() => updateField("gender", option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
          {formData.gender === "Other" && (
            <Input
              placeholder="Specify gender"
              value={formData.genderOther}
              onChange={(event) => updateField("genderOther", event.target.value)}
            />
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-brand-primary">Civil Status*</label>
          <Select
            value={formData.civilStatus}
            onValueChange={(value) => updateField("civilStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {["Single", "Married", "Separated", "Widowed", "Other"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.civilStatus === "Other" && (
            <Input
              placeholder="Specify status"
              value={formData.civilStatusOther}
              onChange={(event) => updateField("civilStatusOther", event.target.value)}
            />
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-primary">Date of Birth*</label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(event) => updateField("dateOfBirth", event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-primary">Age*</label>
          <Input
            type="number"
            min="0"
            value={formData.age}
            onChange={(event) => updateField("age", event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-primary">Place of Birth*</label>
          <Input
            value={formData.placeOfBirth}
            onChange={(event) => updateField("placeOfBirth", event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-primary">
            Weight (lbs/pounds)*
          </label>
          <Input
            type="number"
            min="0"
            value={formData.weight}
            onChange={(event) => updateField("weight", event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-primary">
            Height (ft or cm)*
          </label>
          <Input
            value={formData.height}
            onChange={(event) => updateField("height", event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-primary">Citizenship*</label>
          <Input
            value={formData.citizenship}
            onChange={(event) => updateField("citizenship", event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-primary">Email*</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-primary">
            Mobile / WhatsApp
          </label>
          <Input
            value={formData.mobile}
            onChange={(event) => updateField("mobile", event.target.value)}
          />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-brand-primary/10 bg-brand-background p-3">
        <Checkbox
          id={`${formKey}-consent`}
          checked={formData.consent}
          onCheckedChange={(checked) => updateField("consent", Boolean(checked))}
        />
        <label htmlFor={`${formKey}-consent`} className="text-xs text-brand-muted">
          By providing your details, you are giving us permission to contact and
          message you anytime regarding our opportunities.
        </label>
      </div>

      {formError && <p className="text-xs text-red-600">{formError}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="gold" disabled={submitting}>
          {submitting ? "Submitting..." : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onClear}>
          Clear Form
        </Button>
      </div>

      <p className="text-[11px] text-brand-muted">
        Never submit passwords. Your info is used for membership purposes only.
      </p>
    </>
  );
}

export default function MembershipPage() {
  const [activeForm, setActiveForm] = React.useState<FormType>("full_access");
  const [forms, setForms] = React.useState<Record<FormType, MembershipForm>>({
    full_access: { ...emptyForm },
    ipon_challenge: { ...emptyForm },
  });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState<Submission | null>(null);

  const formData = forms[activeForm];

  const updateField = (field: keyof MembershipForm, value: string | boolean) => {
    setForms((prev) => ({
      ...prev,
      [activeForm]: {
        ...prev[activeForm],
        [field]: value,
      },
    }));
    setFormError(null);
  };

  const validateForm = () => {
    const missing: string[] = [];
    if (!formData.firstName.trim()) missing.push("First name");
    if (!formData.lastName.trim()) missing.push("Last name");
    if (!formData.gender.trim()) missing.push("Gender");
    if (formData.gender === "Other" && !formData.genderOther.trim()) {
      missing.push("Gender (Other)");
    }
    if (!formData.civilStatus.trim()) missing.push("Civil status");
    if (formData.civilStatus === "Other" && !formData.civilStatusOther.trim()) {
      missing.push("Civil status (Other)");
    }
    if (!formData.dateOfBirth.trim()) missing.push("Date of birth");
    if (!formData.age.trim()) missing.push("Age");
    if (!formData.citizenship.trim()) missing.push("Citizenship");
    if (!formData.email.trim()) missing.push("Email");
    if (!formData.placeOfBirth.trim()) missing.push("Place of birth");
    if (!formData.weight.trim()) missing.push("Weight");
    if (!formData.height.trim()) missing.push("Height");
    if (!formData.consent) missing.push("Consent");
    return missing;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const missing = validateForm();
    if (missing.length) {
      setFormError(`Please complete the required fields: ${missing.join(", ")}.`);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const submission: Submission = {
      ...formData,
      referenceId: buildReferenceId(),
      timestamp: new Date().toISOString(),
      formType: activeForm,
    };
    try {
      if (activeForm === "full_access") {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          throw new Error("Supabase is not configured yet for Full Access submissions.");
        }

        const { error } = await supabase.from("membership_registrations").insert({
          reference_id: submission.referenceId,
          membership_path: "full_access",
          source_page: "/membership",
          first_name: submission.firstName,
          middle_name: submission.middleName,
          last_name: submission.lastName,
          gender: submission.gender,
          gender_other: submission.genderOther || null,
          civil_status: submission.civilStatus,
          civil_status_other: submission.civilStatusOther || null,
          date_of_birth: submission.dateOfBirth,
          place_of_birth: submission.placeOfBirth,
          age: Number(submission.age),
          weight: submission.weight,
          height: submission.height,
          citizenship: submission.citizenship,
          email: submission.email,
          mobile: submission.mobile || null,
          consent: submission.consent,
          status: "new",
          notes: {
            submitted_at: submission.timestamp,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        setForms((prev) => ({
          ...prev,
          full_access: { ...emptyForm },
        }));
      } else {
        await submitToFormspree({
          form_type: "membership_ipon_challenge",
          membership_path: "Ipon Challenge",
          source_page: "/membership",
          reference_id: submission.referenceId,
          submitted_at: submission.timestamp,
          first_name: submission.firstName,
          middle_name: submission.middleName,
          last_name: submission.lastName,
          gender: submission.gender,
          gender_other: submission.genderOther,
          civil_status: submission.civilStatus,
          civil_status_other: submission.civilStatusOther,
          date_of_birth: submission.dateOfBirth,
          place_of_birth: submission.placeOfBirth,
          age: submission.age,
          weight: submission.weight,
          height: submission.height,
          citizenship: submission.citizenship,
          email: submission.email,
          mobile: submission.mobile,
          consent: submission.consent,
          _subject: `Prosperity Klub Membership - ${submission.referenceId}`,
        });

        setForms((prev) => ({
          ...prev,
          ipon_challenge: { ...emptyForm },
        }));
      }

      setSubmitted(submission);
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12">
      <Container className="space-y-10">
        <FadeIn className="space-y-3">
          <Badge>Membership</Badge>
          <h1 className="text-3xl font-semibold text-brand-primary md:text-4xl">
            Prosperity Klub Membership
          </h1>
          <p className="max-w-3xl text-sm text-brand-muted md:text-base">
            Join a community built for Filipinos and OFWs who want clarity, protection,
            and long-term wealth.
          </p>
          <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-4 text-sm text-brand-muted">
            <p className="font-semibold text-brand-primary">
              This page is about community onboarding, not just content access.
            </p>
            <p className="mt-2">
              Prosperity Klub provides guidance, mentorship, and community support.
              IMG provides the infrastructure and partner access used for execution.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="grid gap-6 lg:grid-cols-2">
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle>Who this is for</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-brand-muted">
              <ul className="list-disc space-y-1 pl-5">
                <li>Filipinos and OFWs who want clarity before taking action</li>
                <li>People open to education, community accountability, and mentorship</li>
                <li>Those who want protection, investment direction, and income growth support</li>
                <li>People looking for a long-term growth environment, not a one-time tip</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle>Who this may not be for</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-brand-muted">
              <ul className="list-disc space-y-1 pl-5">
                <li>People looking only for a quick quote without guidance</li>
                <li>Anyone unwilling to go through a proper onboarding process</li>
                <li>People who want immediate financial guarantees or shortcuts</li>
              </ul>
              <div className="rounded-lg border border-brand-primary/10 bg-brand-background p-3 text-xs">
                Membership contribution details and exact package terms are clarified
                during onboarding before you proceed.
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn className="grid gap-6 lg:grid-cols-2">
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="gold">Recommended</Badge>
                <Badge variant="soft">Full Access Membership</Badge>
              </div>
              <CardTitle>Full Access Membership</CardTitle>
              <p className="text-sm text-brand-muted">
                Comprehensive protection, education, and community access.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-brand-muted">
              <ul className="list-disc space-y-1 pl-5">
                {fullAccessHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="gold">
                  <Link href="#registration">Register for Full Access</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/book">Book a Free Financial Clarity Session</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <a
                  href="https://www.messenger.com/t/4195348993870330"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:text-brand-gold"
                >
                  Join Messenger Group
                </a>
                <a
                  href="https://chat.whatsapp.com/G3QCZqVdht78Xu1VjsO8Pe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:text-brand-gold"
                >
                  WhatsApp Group
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader className="space-y-2">
              <Badge variant="soft">Ipon Challenge</Badge>
              <CardTitle>Ipon Challenge (Installment Option)</CardTitle>
              <p className="text-sm text-brand-muted">
                A lighter, installment-friendly option with essential support.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-brand-muted">
              <ul className="list-disc space-y-1 pl-5">
                {iponHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="gold">
                  <Link href="#registration">Register for Ipon Challenge</Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveForm("full_access");
                    setFormError(null);
                    document.getElementById("registration")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  Apply for Full Access
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <a
                  href="https://www.messenger.com/t/4195348993870330"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:text-brand-gold"
                >
                  Join Messenger Group
                </a>
                <a
                  href="https://chat.whatsapp.com/G3QCZqVdht78Xu1VjsO8Pe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:text-brand-gold"
                >
                  WhatsApp Group
                </a>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn>
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle>Membership comparison</CardTitle>
              <p className="text-sm text-brand-muted">
                Use this as a quick guide before you register.
              </p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.22em] text-brand-secondary">
                  <tr>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Full Access</th>
                    <th className="px-3 py-2">Ipon Challenge</th>
                  </tr>
                </thead>
                <tbody className="text-brand-muted">
                  <tr className="border-t">
                    <td className="px-3 py-3 font-semibold text-brand-primary">Best for</td>
                    <td className="px-3 py-3">People ready for broader education, protection, and growth support</td>
                    <td className="px-3 py-3">People starting with a lighter, installment-friendly pathway</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-3 py-3 font-semibold text-brand-primary">Education</td>
                    <td className="px-3 py-3">Broader access to trainings, workshops, and learning</td>
                    <td className="px-3 py-3">Core seminars and coaching access</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-3 py-3 font-semibold text-brand-primary">Protection</td>
                    <td className="px-3 py-3">Expanded benefits and partner-linked access</td>
                    <td className="px-3 py-3">Essential entry-level protection benefits</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-3 py-3 font-semibold text-brand-primary">Community path</td>
                    <td className="px-3 py-3">Full integration</td>
                    <td className="px-3 py-3">Start here, then upgrade when ready</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn className="space-y-6" id="full-access">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-brand-primary">
              Full Access Benefits
            </h2>
            <p className="text-sm text-brand-muted">
              Highlights above. Expand each section to explore the complete list of
              benefits.
            </p>
          </div>
          <Accordion type="multiple" className="space-y-3">
            {fullAccessSections.map((section) => (
              <AccordionItem
                key={section.title}
                value={section.title}
                className="rounded-xl border border-brand-primary/10 bg-white/80 px-4"
              >
                <AccordionTrigger className="py-3 text-sm font-semibold text-brand-primary">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-brand-muted">
                  <ul className="list-disc space-y-1 pl-5">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>

        <FadeIn className="space-y-4">
          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle>Ipon Challenge Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-brand-muted">
              <ul className="list-disc space-y-1 pl-5">
                {iponHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="rounded-lg border border-brand-primary/10 bg-brand-background p-3 text-xs text-brand-muted">
                <p className="font-semibold text-brand-primary">
                  Upgrade to Full Access anytime
                </p>
                <p>
                  Move into full protection and learning support whenever you&apos;re
                  ready.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn className="space-y-4">
          <h2 className="text-2xl font-semibold text-brand-primary">
            Membership FAQ
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="membership-1">
              <AccordionTrigger>Is Prosperity Klub under IMG?</AccordionTrigger>
              <AccordionContent>
                Prosperity Klub operates as the guidance, mentorship, and community
                layer. IMG provides the infrastructure, provider pathways, and
                execution support behind the scenes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="membership-2">
              <AccordionTrigger>Do I need to be ready immediately?</AccordionTrigger>
              <AccordionContent>
                No. The onboarding process is there to clarify fit, explain the path,
                and help you choose the right membership level.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="membership-3">
              <AccordionTrigger>Is there a membership fee?</AccordionTrigger>
              <AccordionContent>
                Exact fees and package details are confirmed during onboarding so you
                understand the full commitment before proceeding.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="membership-4">
              <AccordionTrigger>What is the next step after registering?</AccordionTrigger>
              <AccordionContent>
                We review your submission, confirm the right membership path, and
                guide you through the next step into the community.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FadeIn>

        <FadeIn className="space-y-6" id="registration">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-brand-primary">
              Membership Registration
            </h2>
            <p className="text-sm text-brand-muted">
              We&apos;ll contact you after registration to confirm details and next steps.
            </p>
          </div>

          {submitted && (
            <Card className="border-brand-primary/10 bg-white/80">
              <CardHeader>
                <CardTitle>Submission received</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-brand-muted">
                <p>
                  Thank you! Your reference ID is <strong>{submitted.referenceId}</strong>.
                </p>
                <p>
                  {submitted.formType === "full_access"
                    ? "Your Full Access application has been saved to the membership database. We will review it and contact you for the next step."
                    : "We received your Ipon Challenge registration and will contact you for the next step."}
                </p>
                <Button variant="ghost" onClick={() => setSubmitted(null)}>
                  Submit another response
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-brand-primary/10 bg-white/80">
            <CardHeader className="space-y-2">
              <CardTitle>Registration Form</CardTitle>
              <p className="text-xs text-brand-muted">
                Required fields are marked with an asterisk (*). Never submit passwords.
              </p>
            </CardHeader>
            <CardContent>
              <Tabs value={activeForm} onValueChange={(value) => setActiveForm(value as FormType)}>
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="full_access">Full Access</TabsTrigger>
                  <TabsTrigger value="ipon_challenge">Ipon Challenge</TabsTrigger>
                </TabsList>

                <TabsContent value="full_access" className="space-y-5">
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="rounded-2xl border border-brand-primary/10 bg-brand-background p-4 text-sm text-brand-muted">
                      <p className="font-semibold text-brand-primary">
                        Prosperity Klub Membership Form
                      </p>
                      <p className="mt-2">
                        Thank you for your interest in becoming part of our growing
                        community. Kindly fill out all questions completely and
                        truthfully.
                      </p>
                      <p className="mt-2">
                        All details and information that you provide are secured and
                        used only for this membership application. By providing your
                        details, you give us permission to contact and message you
                        anytime regarding our opportunities.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-4 text-sm text-brand-muted">
                      <p className="font-semibold text-brand-primary">
                        Full Access Membership benefits
                      </p>
                      <p className="mt-2">
                        This is the broader Prosperity Klub membership path with
                        education, protection, discounts, community access, and long-term
                        growth support.
                      </p>
                      <ul className="mt-3 list-disc space-y-1 pl-5">
                        {fullAccessHighlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p className="mt-4 text-xs">
                        Watch the membership benefits video and review the full benefits
                        list above before submitting if you want the complete package.
                      </p>
                    </div>

                    <MembershipApplicationFields
                      formKey="full_access"
                      formData={forms.full_access}
                      updateField={updateField}
                      formError={formError}
                      submitting={submitting}
                      submitLabel="Submit Full Access Application"
                      onClear={() =>
                        setForms((prev) => ({
                          ...prev,
                          full_access: { ...emptyForm },
                        }))
                      }
                    />
                  </form>
                </TabsContent>

                <TabsContent value="ipon_challenge">
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="rounded-2xl border border-brand-primary/10 bg-brand-background p-4 text-sm text-brand-muted">
                      <p className="font-semibold text-brand-primary">
                        Prosperity Klub Membership Ipon Challenge Form
                      </p>
                      <p className="mt-2">
                        Thank you for your interest in becoming part of our growing
                        community. Kindly fill out all questions completely and
                        truthfully.
                      </p>
                      <p className="mt-2">
                        All details you provide are kept secure and used only for this
                        membership application. By providing your details, you give us
                        permission to contact and message you regarding opportunities.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-4 text-sm text-brand-muted">
                      <p className="font-semibold text-brand-primary">
                        Installment option benefits
                      </p>
                      <ul className="mt-3 list-disc space-y-1 pl-5">
                        {iponHighlights.slice(0, 3).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <div className="mt-4 rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-4">
                        <p className="font-semibold text-brand-primary">
                          Want full access instead?
                        </p>
                        <p className="mt-2">
                          Switch to the Full Access tab to apply for the broader package
                          of education, protection, discounts, and community benefits.
                        </p>
                        <div className="mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setActiveForm("full_access");
                              setFormError(null);
                            }}
                          >
                            Apply for Full Access Instead
                          </Button>
                        </div>
                      </div>
                    </div>
                    <MembershipApplicationFields
                      formKey="ipon_challenge"
                      formData={forms.ipon_challenge}
                      updateField={updateField}
                      formError={formError}
                      submitting={submitting}
                      submitLabel="Submit Ipon Challenge Registration"
                      onClear={() =>
                        setForms((prev) => ({
                          ...prev,
                          ipon_challenge: { ...emptyForm },
                        }))
                      }
                    />
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </div>
  );
}
