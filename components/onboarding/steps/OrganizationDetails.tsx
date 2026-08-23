"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useSubdomainCheckMutation,
  useReserveSubdomainMutation,
  useVerifyMRMutation,
  useVerifyGstMutation,
  useOrgTypesQuery,
} from "@/hooks/queries/useOnboarding";
import { CheckSubdomainResponse, ReserveSubdomainResponse } from "@/lib/api/types/onboarding.types";
import {
  RESERVED_SUBDOMAINS,
  isValidGSTIN,
  normalizeGSTIN,
  normalizeName,
  normalizeReferral,
  normalizeSubdomain,
} from "@/lib/validations/normalize";
import { orgSubTypeLabel } from "../onboardingConfig";
import { OnboardingData } from "../OnboardingWizard";

const Schema = z.object({
  orgName: z.string().trim().min(2, "Organization name must be at least 2 characters").max(120, "Organization name is too long"),
  subdomain: z
    .string()
    .trim()
    .min(3, "Workspace URL must be at least 3 characters")
    .max(30, "Workspace URL must be under 30 characters")
    .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "Lowercase letters, numbers and hyphens — no leading or trailing hyphen")
    .refine((v) => !RESERVED_SUBDOMAINS.has(v), "That workspace URL is reserved — choose another"),
  contactName: z.string().trim().min(2, "Administrator name is required").max(80, "Name is too long"),
  referralCode: z.string().trim().max(24, "Referral code is too long").optional(),
  gstNumber: z.string().optional().refine((v) => !v || isValidGSTIN(v), "Enter a valid 15-character GSTIN (e.g. 22AAAAA0000A1Z5)"),
});
type Values = z.infer<typeof Schema>;

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

type Status = "idle" | "loading" | "available" | "taken" | "invalid";
type VerifyStatus = "idle" | "loading" | "valid" | "invalid";

export function OrganizationDetails({ onNext, onBack, updateData, data }: Props) {
  const { data: orgTypesRes } = useOrgTypesQuery();
  const specializationLabel = orgSubTypeLabel(orgTypesRes?.data, data.facilityType, data.specialization);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Values>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    defaultValues: {
      orgName: data.orgName || "",
      subdomain: data.subdomain || "",
      contactName: data.contactName || "",
      referralCode: data.referralCode || "",
      gstNumber: data.gstNumber || "",
    },
  });

  const subdomain = watch("subdomain");
  const dSub = useDebounce(subdomain, 500);
  const [subStatus, setSubStatus] = useState<Status>("idle");
  const { mutate: checkSubdomain } = useSubdomainCheckMutation();
  const { mutate: reserveSubdomain, isPending: reserving } = useReserveSubdomainMutation();

  const referral = watch("referralCode");
  const dRef = useDebounce(referral, 600);
  const [mrStatus, setMrStatus] = useState<VerifyStatus>("idle");
  const [mrName, setMrName] = useState<string | null>(null);
  const { mutate: verifyMR } = useVerifyMRMutation();

  const gst = watch("gstNumber");
  const dGst = useDebounce(gst, 700);
  const [gstStatus, setGstStatus] = useState<VerifyStatus>("idle");
  const [legalName, setLegalName] = useState<string | null>(null);
  const { mutate: verifyGst } = useVerifyGstMutation();

  useEffect(() => {
    if (!dSub) { setSubStatus("idle"); return; }
    if (dSub.length < 3 || dSub.length > 30 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(dSub) || RESERVED_SUBDOMAINS.has(dSub)) { setSubStatus("invalid"); return; }
    setSubStatus("loading");
    checkSubdomain(dSub, {
      onSuccess: (res: CheckSubdomainResponse) => setSubStatus(res.success || res.available ? "available" : "taken"),
      onError: () => setSubStatus("invalid"),
    });
  }, [dSub, checkSubdomain]);

  useEffect(() => {
    if (!dRef) { setMrStatus("idle"); setMrName(null); return; }
    if (dRef.length < 4) { setMrStatus("invalid"); setMrName(null); return; }
    setMrStatus("loading");
    verifyMR(dRef, {
      onSuccess: (r) => {
        if (r.success && r.exists) { setMrStatus("valid"); setMrName(r.name || "Verified"); }
        else { setMrStatus("invalid"); setMrName(null); }
      },
      onError: () => { setMrStatus("invalid"); setMrName(null); },
    });
  }, [dRef, verifyMR]);

  useEffect(() => {
    const rx = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!dGst) { setGstStatus("idle"); setLegalName(null); return; }
    if (!rx.test(dGst.toUpperCase())) { setGstStatus("invalid"); setLegalName(null); return; }
    setGstStatus("loading");
    verifyGst(dGst, {
      onSuccess: (r) => {
        if (r.success && r.exists) {
          setGstStatus("valid");
          setLegalName(r.legalName || "Verified Entity");
          if (!watch("orgName")) setValue("orgName", r.legalName || "");
        } else { setGstStatus("invalid"); setLegalName(null); }
      },
      onError: () => { setGstStatus("invalid"); setLegalName(null); },
    });
  }, [dGst, verifyGst, watch, setValue]);

  const refInvalid = !!referral && mrStatus === "invalid";
  const gstInvalid = !!gst && gstStatus === "invalid";

  const onSubmit = (values: Values) => {
    if (subStatus !== "available" || gstInvalid || refInvalid) return;
    if (!data.verifiedToken) { alert("Session expired. Please start over."); window.location.reload(); return; }
    reserveSubdomain(
      { subdomain: values.subdomain, token: data.verifiedToken },
      {
        onSuccess: (res: ReserveSubdomainResponse) => {
          if (res.success || res.available) {
            updateData({
              orgName: normalizeName(values.orgName),
              subdomain: normalizeSubdomain(values.subdomain),
              contactName: normalizeName(values.contactName),
              referralCode: values.referralCode ? normalizeReferral(values.referralCode) : values.referralCode,
              gstNumber: values.gstNumber ? normalizeGSTIN(values.gstNumber) : values.gstNumber,
            });
            onNext();
          } else {
            setSubStatus("taken");
            alert(res.message || "This URL is no longer available. Please choose another one.");
          }
        },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { message?: string } }; message?: string };
          alert(e?.response?.data?.message || e?.message || "Failed to reserve the workspace URL.");
        },
      }
    );
  };

  const canContinue =
    isValid && subStatus === "available" && !reserving && !gstInvalid && !refInvalid && gstStatus !== "loading" && mrStatus !== "loading";

  let subHint = "Lowercase letters, numbers, and hyphens only.";
  let subHintClass = "";
  if (subStatus === "loading") subHint = "Checking availability…";
  else if (subStatus === "available") { subHint = `"${subdomain}.kaeroprescribe.com" is available.`; subHintClass = "field__hint--valid"; }
  else if (subStatus === "taken") { subHint = `"${subdomain}.kaeroprescribe.com" is already taken. Try another.`; subHintClass = "field__hint--error"; }
  else if (subStatus === "invalid" || errors.subdomain) { subHint = "Minimum 3 characters — lowercase letters, numbers, hyphens."; subHintClass = "field__hint--error"; }

  return (
    <section className="screen">
      <div className="screen__container screen__container--wide">
        <p className="eyebrow">Step 3</p>
        <h1 className="screen__title">Tell us about your organization</h1>
        <p className="screen__subtitle">This information appears on prescriptions, invoices, and patient-facing documents.</p>

        <form className="form form--grid" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="contactName">Administrator name</label>
            <input id="contactName" autoComplete="name" maxLength={80} aria-invalid={!!errors.contactName} className={`field__input ${errors.contactName ? "is-invalid" : ""}`} placeholder="Dr. John Doe" {...register("contactName")} />
            {errors.contactName && <p className="field__hint field__hint--error">{errors.contactName.message}</p>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="orgName">Organization name</label>
            <input id="orgName" autoComplete="organization" maxLength={120} aria-invalid={!!errors.orgName} className={`field__input ${errors.orgName ? "is-invalid" : ""}`} placeholder="Apollo Health Clinic" {...register("orgName")} />
            {errors.orgName && <p className="field__hint field__hint--error">{errors.orgName.message}</p>}
          </div>

          <div className="field">
            <label className="field__label">Specialization</label>
            <input className="field__input" disabled value={specializationLabel || "—"} readOnly />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="gstNumber">
              GST number <span className="field__optional">Optional</span>
            </label>
            <input
              id="gstNumber"
              maxLength={15}
              autoCapitalize="characters"
              spellCheck={false}
              aria-invalid={gstInvalid}
              className={`field__input ${gstStatus === "valid" ? "is-valid" : gstInvalid ? "is-invalid" : ""}`}
              placeholder="27AAACR1234R1Z5"
              {...register("gstNumber", { onChange: (e) => { e.target.value = normalizeGSTIN(e.target.value); } })}
            />
            {gstStatus === "loading" && <p className="field__hint">Verifying GSTIN…</p>}
            {gstStatus === "valid" && <p className="field__hint field__hint--valid">Verified: {legalName}</p>}
            {gstInvalid && <p className="field__hint field__hint--error">This doesn&apos;t match a valid GSTIN.</p>}
          </div>

          <div className="field field--span2">
            <label className="field__label" htmlFor="subdomain">Workspace URL</label>
            <div className="subdomain-input">
              <input id="subdomain" className="field__input" placeholder="apollo" maxLength={30} autoCapitalize="none" spellCheck={false} aria-invalid={subStatus === "taken" || subStatus === "invalid"} {...register("subdomain", { onChange: (e) => { e.target.value = normalizeSubdomain(e.target.value); } })} />
              <span className="subdomain-suffix">.kaeroprescribe.com</span>
            </div>
            <p className={`field__hint ${subHintClass}`}>{subHint}</p>
          </div>

          <div className="field field--span2">
            <label className="field__label" htmlFor="referralCode">
              Referral code <span className="field__optional">Optional</span>
            </label>
            <input
              id="referralCode"
              maxLength={24}
              aria-invalid={refInvalid}
              className={`field__input ${mrStatus === "valid" ? "is-valid" : refInvalid ? "is-invalid" : ""}`}
              placeholder="Enter a code if you have one"
              {...register("referralCode")}
            />
            {mrStatus === "loading" && <p className="field__hint">Checking referral…</p>}
            {mrStatus === "valid" && <p className="field__hint field__hint--valid">Verified: MR {mrName} — we&apos;ll apply this at checkout.</p>}
            {refInvalid && <p className="field__hint field__hint--error">Referral code not recognized.</p>}
          </div>

          <div className="screen__actions screen__actions--span2">
            <button className="btn btn--secondary" type="button" onClick={onBack}>Back</button>
            <button className="btn btn--primary" type="submit" disabled={!canContinue}>
              {reserving ? <><span className="spinner" /> Reserving…</> : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
