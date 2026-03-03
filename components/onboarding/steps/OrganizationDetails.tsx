"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubdomainCheckMutation, useReserveSubdomainMutation } from "@/hooks/queries/useOnboarding";
import { ReserveSubdomainResponse, CheckSubdomainResponse } from "@/lib/api/types/onboarding.types";
import { Box, Typography, TextField, Button, InputAdornment } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import LanguageIcon from "@mui/icons-material/Language";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { OnboardingData } from "../OnboardingWizard";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

// Extended schema to capture Admin Name here since we are skipping the final review form
const ExtendedIdentitySchema = z.object({
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
  subdomain: z.string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(30, "Subdomain must be under 30 characters")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed"),
  contactName: z.string().min(2, "Admin name is required to setup the profile"),
});

type IdentityFormValues = z.infer<typeof ExtendedIdentitySchema>;

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function OrganizationDetails({ onNext, onBack, updateData, data }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IdentityFormValues>({
    resolver: zodResolver(ExtendedIdentitySchema),
    mode: "onChange",
    defaultValues: { orgName: data.orgName || "", subdomain: data.subdomain || "", contactName: (data as any).contactName || "" },
  });

  const subdomainValue = watch("subdomain");
  const debouncedSubdomain = useDebounce(subdomainValue, 500);

  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "loading" | "available" | "taken" | "invalid">("idle");
  const { mutate: checkSubdomain } = useSubdomainCheckMutation();
  const { mutate: reserveSubdomain, isPending: reserving } = useReserveSubdomainMutation();

  useEffect(() => {
    if (!debouncedSubdomain) {
      setSubdomainStatus("idle");
      return;
    }

    if (debouncedSubdomain.length < 3 || debouncedSubdomain.length > 30 || !/^[a-z0-9-]+$/.test(debouncedSubdomain)) {
      setSubdomainStatus("invalid");
      return;
    }

    setSubdomainStatus("loading");
    checkSubdomain(debouncedSubdomain, {
      onSuccess: (res: CheckSubdomainResponse) => {
        if (res.available) setSubdomainStatus("available");
        else setSubdomainStatus("taken");
      },
      onError: () => setSubdomainStatus("invalid"),
    });
  }, [debouncedSubdomain, checkSubdomain]);

  const onSubmit = (values: IdentityFormValues) => {
    if (subdomainStatus !== "available") return;
    if (!data.verifiedToken) return;

    reserveSubdomain(
      { subdomain: values.subdomain, token: data.verifiedToken },
      {
        onSuccess: (res: ReserveSubdomainResponse) => {
          if (res.available) {
            updateData({ orgName: values.orgName, subdomain: values.subdomain, contactName: values.contactName } as any);
            onNext();
          } else {
             setSubdomainStatus("taken");
             alert(res.message);
          }
        },
        onError: (err) => {
          alert(err.message || "Failed to reserve the workspace URL.");
        }
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
          Back to Verification
        </Button>
        <Typography variant="h4" color="text.primary" gutterBottom>
          Organization Identity
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Let's set up your clinic's workspace and administrator profile.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Admin Name */}
        <Box mb={3}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
            Administrator Full Name
          </Typography>
          <TextField
            fullWidth
            id="contactName"
            placeholder="Dr. John Doe"
            error={!!errors.contactName}
            helperText={errors.contactName?.message || " "}
            {...register("contactName")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Org Name */}
        <Box mb={3}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
            Clinic / Organization Name
          </Typography>
          <TextField
            fullWidth
            id="orgName"
            placeholder="Apollo Health Clinic"
            error={!!errors.orgName}
            helperText={errors.orgName?.message || " "}
            {...register("orgName")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Subdomain */}
        <Box mb={1}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
            Workspace URL
          </Typography>
          <TextField
            fullWidth
            id="subdomain"
            placeholder="apollo"
            error={subdomainStatus === "taken" || subdomainStatus === "invalid" || !!errors.subdomain}
            {...register("subdomain")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LanguageIcon color="action" />
                  <Typography variant="body2" sx={{ ml: 1, mt: 0.2 }}>https://</Typography>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2">.kaero.in</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box mb={3} minHeight={24} display="flex" alignItems="center" px={1}>
          {subdomainStatus === "loading" && (
            <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
              <CircularProgress size={12} sx={{ mr: 1 }} /> Checking availability...
            </Typography>
          )}
          {subdomainStatus === "available" && (
            <Typography variant="caption" color="success.main" display="flex" alignItems="center" fontWeight={600}>
              <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} /> URL is available!
            </Typography>
          )}
          {subdomainStatus === "taken" && (
            <Typography variant="caption" color="error.main" display="flex" alignItems="center" fontWeight={600}>
              <ErrorOutlineIcon fontSize="small" sx={{ mr: 0.5 }} /> URL is taken.
            </Typography>
          )}
          {subdomainStatus === "invalid" && (
            <Typography variant="caption" color="error.main" fontWeight={600}>
              Must be lowercase letters, numbers, hyphens.
            </Typography>
          )}
          {subdomainStatus === "idle" && errors.subdomain && (
            <Typography variant="caption" color="error.main">
              {errors.subdomain.message}
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={!isValid || subdomainStatus !== "available" || reserving}
          endIcon={reserving ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
          sx={{ mb: 2 }}
        >
          {reserving ? "Reserving..." : "Next: Configure Modules"}
        </Button>
      </form>
    </Box>
  );
}
