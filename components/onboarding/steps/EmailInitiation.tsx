"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InitiateSchema, InitiateFormValues } from "@/lib/validations/onboarding-schema";
import { useInitiateMutation } from "@/hooks/queries/useOnboarding";
import { InitiateResponse } from "@/lib/api/types/onboarding.types";
import { normalizeEmail } from "@/lib/validations/normalize";
import { OnboardingData } from "../OnboardingWizard";
import { SAFE_ONBOARDING_START_ERROR } from "../safeErrorMessages";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function EmailInitiation({ onNext, onBack, updateData, data }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InitiateFormValues>({
    resolver: zodResolver(InitiateSchema),
    defaultValues: { email: data.email || "" },
  });

  const { mutate, isPending, error } = useInitiateMutation();

  const onSubmit = (values: InitiateFormValues) => {
    const email = normalizeEmail(values.email);
    mutate(
      { email },
      {
        onSuccess: (res: InitiateResponse) => {
          if (res.onboarded) {
            alert("Your workspace is already active. Taking you to your dashboard.");
            if (res.dashboardUrl) window.location.href = res.dashboardUrl;
          } else if (res.canResume) {
            updateData({ email, sessionId: res.sessionId, verifiedToken: res.verifiedToken });
            onNext();
          } else {
            updateData({ email, sessionId: res.sessionId });
            onNext();
          }
        },
      }
    );
  };

  const serverError = error ? SAFE_ONBOARDING_START_ERROR : null;
  const hasError = !!errors.email || !!serverError;

  return (
    <section className="screen">
      <div className="screen__container screen__container--narrow">
        <p className="eyebrow">Step 2</p>
        <h1 className="screen__title">Verify your work email</h1>
        <p className="screen__subtitle">We&apos;ll send a verification code to confirm this is you.</p>

        <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="email">Work email</label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={254}
              placeholder="admin@myclinic.com"
              className={`field__input ${hasError ? "is-invalid" : ""}`}
              disabled={isPending}
              {...register("email")}
            />
            <p className={`field__hint ${hasError ? "field__hint--error" : ""}`}>
              {errors.email?.message ||
                serverError ||
                "We recommend using an email you check regularly — this becomes your admin login."}
            </p>
          </div>

          <div className="screen__actions">
            <button className="btn btn--secondary" type="button" onClick={onBack}>Back</button>
            <button className="btn btn--primary" type="submit" disabled={isPending}>
              {isPending ? <><span className="spinner" /> Sending…</> : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
