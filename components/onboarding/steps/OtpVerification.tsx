"use client";

import { useEffect, useRef, useState } from "react";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/hooks/queries/useOnboarding";
import { VerifyOtpResponse, ResendOtpResponse } from "@/lib/api/types/onboarding.types";
import { OnboardingData } from "../OnboardingWizard";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function OtpVerification({ onNext, onBack, updateData, data }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [showError, setShowError] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  const { mutate: verifyOtp, isPending: verifying, error: verifyError } = useVerifyOtpMutation();
  const { mutate: resendOtp, isPending: resending } = useResendOtpMutation();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const code = otp.join("");

  const change = (i: number, v: string) => {
    if (v && !/^\d$/.test(v)) return;
    const next = [...otp];
    next[i] = v.slice(-1);
    setOtp(next);
    setShowError(false);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const keydown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const paste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!t) return;
    const next = [...otp];
    for (let j = 0; j < 6; j++) next[j] = t[j] || "";
    setOtp(next);
    refs.current[Math.min(t.length, 5)]?.focus();
  };

  const verify = () => {
    if (code.length < 6 || !data.sessionId) {
      setShowError(true);
      return;
    }
    verifyOtp(
      { sessionId: data.sessionId, otp: code },
      {
        onSuccess: (res: VerifyOtpResponse) => {
          if (res.success || res.verified) {
            updateData({ verifiedToken: res.verifiedToken });
            onNext();
          } else {
            setShowError(true);
          }
        },
        onError: () => setShowError(true),
      }
    );
  };

  const resend = () => {
    if (cooldown > 0 || !data.sessionId) return;
    resendOtp(
      { sessionId: data.sessionId },
      {
        onSuccess: (res: ResendOtpResponse) => {
          setCooldown(30);
          if (res.message) alert(res.message);
        },
      }
    );
  };

  const err = showError || !!verifyError;

  return (
    <section className="screen">
      <div className="screen__container screen__container--narrow">
        <p className="eyebrow">Step 2</p>
        <h1 className="screen__title">Check your email</h1>
        <p className="screen__subtitle">
          We sent a 6-digit verification code to <strong>{data.email || "your email"}</strong>
        </p>

        <div className="form">
          <div className="field">
            <label className="field__label">Verification code</label>
            <div className="otp-group" onPaste={paste}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  className={`otp-digit ${err ? "is-invalid" : ""}`}
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => { refs.current[i] = el; }}
                  value={d}
                  disabled={verifying}
                  autoFocus={i === 0}
                  onChange={(e) => change(i, e.target.value)}
                  onKeyDown={(e) => keydown(i, e)}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>
            {err && <p className="field__hint field__hint--error">That code didn&apos;t match. Check your email and try again.</p>}
          </div>

          <div className="otp-meta">
            <button className="link-btn" type="button" disabled={cooldown > 0 || resending} onClick={resend}>
              {cooldown > 0 ? `Resend code in ${cooldown}s` : resending ? "Resending…" : "Resend code"}
            </button>
            <button className="link-btn" type="button" onClick={onBack}>Change email</button>
          </div>

          <div className="screen__actions">
            <button className="btn btn--secondary" type="button" onClick={onBack}>Back</button>
            <button className="btn btn--primary" type="button" disabled={verifying} onClick={verify}>
              {verifying ? <><span className="spinner" /> Verifying…</> : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
