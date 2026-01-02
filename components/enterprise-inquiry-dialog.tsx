"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type InquiryType =
  | "Flexible SLA"
  | "Managed Services"
  | "Custom Integrations"
  | "Enterprise Pricing"
  | "Other";

const inquiryTypes: InquiryType[] = [
  "Flexible SLA",
  "Managed Services",
  "Custom Integrations",
  "Enterprise Pricing",
  "Other",
];

export function EnterpriseInquiryDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [inquiryType, setInquiryType] = useState<InquiryType>("Flexible SLA");
  const [message, setMessage] = useState("");

  const isValid = useMemo(() => {
    return (
      name.trim().length > 1 &&
      /^\S+@\S+\.\S+$/.test(email.trim()) &&
      inquiryType.trim().length > 0 &&
      message.trim().length > 10
    );
  }, [name, email, inquiryType, message]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValid) {
      setError("Please fill the required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enterprise-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          role,
          inquiryType,
          message,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Something went wrong. Please try again.");
        return;
      }

      setSuccess("Thanks! Your inquiry has been sent.");
      setName("");
      setEmail("");
      setCompany("");
      setRole("");
      setInquiryType("Flexible SLA");
      setMessage("");

      // Close shortly after showing success
      setTimeout(() => setOpen(false), 900);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Contact Sales</DialogTitle>
          <DialogDescription>
            Request a flexible SLA and service plan. We’ll respond within 24
            hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Full name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Work email *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Company
              </label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Hospital / Clinic"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Role</label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Founder / Admin / IT"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Inquiry type *
            </label>
            <select
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value as InquiryType)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {inquiryTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Requirements *
              <span className="text-gray-500 font-normal">
                {" "}
                (SLA targets, support hours, modules, etc.)
              </span>
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Example: 99.9% uptime SLA, 24/7 support, dedicated onboarding, custom integration..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-gray-500">Minimum 10 characters.</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !isValid}>
              {submitting ? "Sending..." : "Send inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
