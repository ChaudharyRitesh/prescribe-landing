"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InitiateSchema, InitiateFormValues } from "@/lib/validations/onboarding-schema";
import { useInitiateMutation } from "@/hooks/queries/useOnboarding";
import { InitiateResponse } from "@/lib/api/types/onboarding.types";
import { Box, Typography, TextField, Button, InputAdornment } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CircularProgress } from "@mui/material";
import { OnboardingData } from "../OnboardingWizard";

interface Props {
  onNext: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function EmailInitiation({ onNext, updateData, data }: Props) {
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
            updateData({
              email: values.email,
              sessionId: res.sessionId,
              verifiedToken: res.verifiedToken,
            });
            onNext();
          } else {
            updateData({ email: values.email, sessionId: res.sessionId });
            onNext();
          }
        },
      }
    );
  };

  return (
    <Box className="animate-fade-up">
      <Box mb={4}>
        <Typography variant="h4" color="text.primary" gutterBottom>
          Welcome to Kaero Prescribe
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your work email address to begin your clinic's setup.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={3}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
            Work Email Address
          </Typography>
          <TextField
            fullWidth
            id="email"
            placeholder="admin@myclinic.com"
            type="email"
            autoComplete="email"
            disabled={isPending}
            error={!!errors.email || !!error}
            helperText={errors.email?.message || error?.message || " "}
            {...register("email")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={isPending}
          endIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
          sx={{ mb: 3 }}
        >
          {isPending ? "Initiating..." : "Continue"}
        </Button>

        <Typography variant="body2" align="center" color="text.disabled">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Typography>
      </form>
    </Box>
  );
}
