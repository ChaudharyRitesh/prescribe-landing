"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InitiateSchema, InitiateFormValues } from "@/lib/validations/onboarding-schema";
import { useInitiateMutation } from "@/hooks/queries/useOnboarding";
import { InitiateResponse } from "@/lib/api/types/onboarding.types";
import { OnboardingData } from "../OnboardingWizard";

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
    mutate(
      { email: values.email },
      {
        onSuccess: (res: InitiateResponse) => {
          if (res.onboarded) {
            alert(res.message);
            if (res.dashboardUrl) window.location.href = res.dashboardUrl;
          } else if (res.canResume) {
            updateData({ email: values.email, sessionId: res.sessionId, verifiedToken: res.verifiedToken });
            onNext();
          } else {
            updateData({ email: values.email, sessionId: res.sessionId });
            onNext();
          }
        },
      }
    );
  };

  const serverError = error ? (error as Error).message : null;
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
              autoComplete="email"
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
