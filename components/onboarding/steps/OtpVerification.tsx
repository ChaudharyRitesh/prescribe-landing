"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyOtpSchema, VerifyOtpFormValues } from "@/lib/validations/onboarding-schema";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/hooks/queries/useOnboarding";
import { VerifyOtpResponse, ResendOtpResponse } from "@/lib/api/types/onboarding.types";
import { Box, Typography, TextField, Button, Link, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CircularProgress } from "@mui/material";
import { OnboardingData } from "../OnboardingWizard";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function OtpVerification({ onNext, onBack, updateData, data }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(VerifyOtpSchema),
  });

  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    register("otp");
  }, [register]);

  const handleOtpChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value.substring(value.length - 1);
    setOtpArray(newOtp);
    
    setValue("otp", newOtp.join(""), { shouldValidate: true });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
    if (!pasteData) return;

    const newOtp = [...otpArray];
    for (let i = 0; i < pasteData.length; i++) {
      if (i < 6) newOtp[i] = pasteData[i];
    }
    setOtpArray(newOtp);
    setValue("otp", newOtp.join(""), { shouldValidate: true });

    const focusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const { mutate: verifyOtp, isPending: verifying, error: verifyError } = useVerifyOtpMutation();
  const { mutate: resendOtp, isPending: resending, error: resendError } = useResendOtpMutation();

  const handleResend = () => {
    if (data.sessionId) {
      resendOtp(
        { sessionId: data.sessionId },
        {
          onSuccess: (res: ResendOtpResponse) => {
            alert(res.message);
          },
        }
      );
    }
  };

  const onSubmit = (values: VerifyOtpFormValues) => {
    if (!data.sessionId) return;
    verifyOtp(
      { sessionId: data.sessionId, otp: values.otp },
      {
        onSuccess: (res: VerifyOtpResponse) => {
          if (res.success || res.verified) {
            updateData({ verifiedToken: res.verifiedToken });
            onNext();
          } else {
             console.log(res.message);
          }
        },
      }
    );
  };

  return (
    <Box className="animate-fade-up">
      <Box mb={4}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}
          size="small"
        >
          Back to Email
        </Button>
        <Typography variant="h4" color="text.primary" gutterBottom>
          Check your email
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We sent a 6-digit verification code to <Box component="span" fontWeight="600" color="text.primary">{data.email}</Box>.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={4}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary', textAlign: 'center' }}>
            Enter 6-Digit Code
          </Typography>
          <Box display="flex" gap={1.5} justifyContent="center" onPaste={handlePaste}>
            {otpArray.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(el: any) => { inputRefs.current[index] = el; }}
                value={digit}
                onChange={(e) => handleOtpChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={verifying}
                autoFocus={index === 0}
                error={!!errors.otp || !!verifyError}
                inputProps={{
                  maxLength: 2,
                  inputMode: "numeric",
                  style: { 
                    textAlign: 'center', 
                    fontSize: '1.5rem', 
                    fontFamily: 'monospace',
                    padding: '12px 8px',
                    width: '45px',
                    height: '56px',
                    boxSizing: 'border-box'
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                  }
                }}
              />
            ))}
          </Box>
          {(errors.otp || verifyError) && (
            <Typography variant="caption" color="error" display="block" align="center" mt={1}>
              {errors.otp?.message || verifyError?.message}
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={verifying}
          endIcon={verifying ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlineIcon />}
          sx={{ mb: 3 }}
        >
          {verifying ? "Verifying..." : "Verify & Continue"}
        </Button>

        <Typography variant="body2" align="center" color="text.secondary">
          Didn't receive the code?{" "}
          <Link
            component="button"
            type="button"
            variant="body2"
            underline="hover"
            onClick={handleResend}
            disabled={resending}
            sx={{ fontWeight: 600, ml: 1 }}
          >
            {resending ? "Resending..." : "Resend it"}
          </Link>
        </Typography>
        {resendError && (
          <Typography variant="caption" color="error" display="block" align="center" mt={1}>
            {resendError.message}
          </Typography>
        )}
      </form>
    </Box>
  );
}
