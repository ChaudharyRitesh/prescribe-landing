"use client";

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
    formState: { errors },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(VerifyOtpSchema),
  });

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
        <Box mb={3}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
            6-Digit Code
          </Typography>
          <TextField
            fullWidth
            id="otp"
            placeholder="123456"
            disabled={verifying}
            autoFocus
            error={!!errors.otp || !!verifyError}
            helperText={errors.otp?.message || verifyError?.message || " "}
            inputProps={{ 
              maxLength: 6, 
              inputMode: "numeric",
              style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5rem', fontFamily: 'monospace' } 
            }}
            {...register("otp")}
          />
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
