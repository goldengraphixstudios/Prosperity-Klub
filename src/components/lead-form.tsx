"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";

import { incomeRanges, priorityOptions } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = {
  name: "",
  email: "",
  phone: "",
  location: "",
  isOfw: "",
  incomeRange: "",
  priorities: [] as string[],
};

export function LeadForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [form, setForm] = React.useState(initialState);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const togglePriority = (value: string) => {
    setForm((prev) => {
      const exists = prev.priorities.includes(value);
      return {
        ...prev,
        priorities: exists
          ? prev.priorities.filter((item) => item !== value)
          : [...prev.priorities, value],
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.isOfw || !form.incomeRange) {
      setError("Please complete the required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          is_ofw: form.isOfw === "Yes",
          income_range: form.incomeRange,
          priorities: form.priorities,
          source_page: pathname,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Unable to submit. Please try again.");
      }

      router.push("/thank-you");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-primary" htmlFor="name">
            Full Name *
          </label>
          <Input
            id="name"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Your full name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-primary" htmlFor="email">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="you@email.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-primary" htmlFor="phone">
            Mobile Number
          </label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
            placeholder="+63"
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-brand-primary"
            htmlFor="location"
          >
            Country / City
          </label>
          <Input
            id="location"
            value={form.location}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, location: event.target.value }))
            }
            placeholder="Manila, Philippines"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-primary">
            OFW (Yes/No) *
          </label>
          <Select
            value={form.isOfw}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, isOfw: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-primary">
            Monthly Income Range *
          </label>
          <Select
            value={form.incomeRange}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, incomeRange: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {incomeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-brand-primary">
          Financial Priorities (select all that apply)
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {priorityOptions.map((option) => (
            <label
              key={option}
              className="flex items-start gap-3 rounded-lg border border-brand-primary/10 bg-white/80 p-3 text-sm text-brand-text"
            >
              <Checkbox
                checked={form.priorities.includes(option)}
                onCheckedChange={() => togglePriority(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        variant="gold"
        className="w-full hover:scale-[1.02]"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit & Continue"}
      </Button>
    </form>
  );
}
