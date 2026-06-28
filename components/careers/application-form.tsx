"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api/axios";
import { careerPrimaryButton } from "@/components/careers/careers-ui";
import { toast } from "sonner"; // They have sonner in package.json

export function ApplicationForm({ jobId }: { jobId: string }) {
  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume) {
      toast.error("Please upload your resume");
      return;
    }

    if (resume.size > 5 * 1024 * 1024) {
      toast.error("Resume must be under 5MB");
      return;
    }

    if (resume.type !== "application/pdf") {
      toast.error("Resume must be a PDF");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("candidateName", candidateName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("resume", resume);

      const res: any = await apiClient.post(`/jobs/${jobId}/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.success) {
        toast.success("Application submitted successfully!");
        setCandidateName("");
        setEmail("");
        setPhone("");
        setResume(null);
      } else {
        toast.error(res.message || "Failed to submit application");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while applying");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-xl bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 font-display">Apply for this role</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            placeholder="+91 9876543210"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Resume (PDF, max 5MB)</label>
          <input
            type="file"
            required
            accept="application/pdf"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 transition-all cursor-pointer"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={careerPrimaryButton}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
