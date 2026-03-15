"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export function ResourceGateDialog({
  open,
  onOpenChange,
  onSubmitted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name || !email) {
      setError("Please enter your name and email.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = getSupabaseBrowserClient();

      if (supabase) {
        const { error: supabaseError } = await supabase.from("ebook_requests").insert({
          name,
          email,
          source_page: "/resources",
          requested_resource: "The Secret to Saving and Building Your Future",
          status: "pending",
          delivery_method: "email",
        });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }
      } else {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            source_page: "/resources",
            requested_resource: "The Secret to Saving and Building Your Future",
            priorities: [],
          }),
        });

        if (!response.ok) {
          throw new Error("Unable to submit. Please try again.");
        }
      }

      onSubmitted();
      onOpenChange(false);
      setName("");
      setEmail("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request the Free Ebook</DialogTitle>
          <DialogDescription>
            Share your name and email and we&apos;ll route this as an ebook request.
            The on-site preview stays locked, and the full file should be delivered
            through your email workflow.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-primary" htmlFor="resource-name">
              Full Name
            </label>
            <Input
              id="resource-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-primary" htmlFor="resource-email">
              Email
            </label>
            <Input
              id="resource-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              required
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" variant="gold" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Send Me the Ebook"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
