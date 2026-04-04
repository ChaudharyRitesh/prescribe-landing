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
import BadgeIcon from "@mui/icons-material/Badge";
import { OnboardingData } from "../OnboardingWizard";
import { useEffect, useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useVerifyMRMutation, useVerifyGstMutation } from "@/hooks/queries/useOnboarding";
import { FormControlLabel, Checkbox, Collapse } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import GavelIcon from '@mui/icons-material/Gavel';

// Extended schema to capture Admin Name and optional GST
const ExtendedIdentitySchema = z.object({
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
  subdomain: z.string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(30, "Subdomain must be under 30 characters")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed"),
  contactName: z.string().min(2, "Admin name is required to setup the profile"),
  referralCode: z.string().optional(),
  gstNumber: z.string().optional(),
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
    setValue,
    formState: { errors, isValid },
  } = useForm<IdentityFormValues>({
    resolver: zodResolver(ExtendedIdentitySchema),
    mode: "onChange",
    defaultValues: {
      orgName: data.orgName || "",
      subdomain: data.subdomain || "",
      contactName: data.contactName || "",
      referralCode: data.referralCode || "",
      gstNumber: data.gstNumber || ""
    },
  });

  const subdomainValue = watch("subdomain");
  const debouncedSubdomain = useDebounce(subdomainValue, 500);

  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "loading" | "available" | "taken" | "invalid">("idle");
  const { mutate: checkSubdomain } = useSubdomainCheckMutation();
  const { mutate: reserveSubdomain, isPending: reserving } = useReserveSubdomainMutation();

  // MR Referral State
  const [hasReferral, setHasReferral] = useState(!!data.referralCode);
  const referralValue = watch("referralCode");
  const debouncedReferral = useDebounce(referralValue, 600);
  const [mrStatus, setMrStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [verifiedMrName, setVerifiedMrName] = useState<string | null>(null);
  const { mutate: verifyMR } = useVerifyMRMutation();

  // GST Verification State
  const gstValue = watch("gstNumber");
  const debouncedGst = useDebounce(gstValue, 700);
  const [gstStatus, setGstStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [verifiedLegalName, setVerifiedLegalName] = useState<string | null>(null);
  const { mutate: verifyGst } = useVerifyGstMutation();

  useEffect(() => {
    if (!debouncedReferral || !hasReferral) {
      setMrStatus("idle");
      setVerifiedMrName(null);
      return;
    }

    setMrStatus("loading");
    verifyMR(debouncedReferral, {
      onSuccess: (res) => {
        if (res.success && res.exists) {
          setMrStatus("valid");
          setVerifiedMrName(res.name || "Verified");
        } else {
          setMrStatus("invalid");
          setVerifiedMrName(null);
        }
      },
      onError: () => {
        setMrStatus("invalid");
        setVerifiedMrName(null);
      }
    });
  }, [debouncedReferral, hasReferral, verifyMR]);

  useEffect(() => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!debouncedGst) {
      setGstStatus("idle");
      setVerifiedLegalName(null);
      return;
    }

    if (!gstRegex.test(debouncedGst.toUpperCase())) {
      setGstStatus("invalid");
      setVerifiedLegalName(null);
      return;
    }

    setGstStatus("loading");
    verifyGst(debouncedGst, {
      onSuccess: (res) => {
        if (res.success && res.exists) {
          setGstStatus("valid");
          setVerifiedLegalName(res.legalName || "Verified Entity");
          // Optionally update org name if it's empty
          if (!watch("orgName")) {
            setValue("orgName", res.legalName || "");
          }
        } else {
          setGstStatus("invalid");
          setVerifiedLegalName(null);
        }
      },
      onError: () => {
        setGstStatus("invalid");
        setVerifiedLegalName(null);
      }
    });
  }, [debouncedGst, verifyGst, watch, setValue]);

  // Disable "Next" if a referral code is entered but invalid
  const isReferralInvalid = hasReferral && !!referralValue && mrStatus === "invalid";
  const isReferralLoading = hasReferral && !!referralValue && mrStatus === "loading";
  const isGstInvalid = !!gstValue && gstStatus === "invalid";

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
        if (res.success || res.available) setSubdomainStatus("available");
        else setSubdomainStatus("taken");
      },
      onError: () => setSubdomainStatus("invalid"),
    });
  }, [debouncedSubdomain, checkSubdomain]);

  const onSubmit = (values: IdentityFormValues) => {
    if (subdomainStatus !== "available") return;
    if (isGstInvalid) return;
    if (isReferralInvalid) return;

    if (!data.verifiedToken) {
      alert("Session expired. Please start over.");
      window.location.reload();
      return;
    }

    reserveSubdomain(
      { subdomain: values.subdomain, token: data.verifiedToken },
      {
        onSuccess: (res: ReserveSubdomainResponse) => {
          if (res.success || res.available) {
            updateData({
              orgName: values.orgName,
              subdomain: values.subdomain,
              contactName: values.contactName,
              referralCode: values.referralCode,
              gstNumber: values.gstNumber
            });
            onNext();
          } else {
            setSubdomainStatus("taken");
            alert(res.message || "This URL is no longer available. Please choose another one.");
          }
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || err.message || "Failed to reserve the workspace URL.";
          alert(msg);
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
          {data.facilityType === 'diagnostic' ? 'Diagnostic Center Identity' :
            data.facilityType === 'hospital' ? 'Hospital Identity' :
              'Organization Identity'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Let's set up your {data.facilityType || 'clinic'}'s workspace and administrator profile.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* MR Referral Toggle */}


        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1,
          }}
        >
          {/* Admin Name */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              {data.facilityType === 'hospital' ? 'Chief Administrator Full Name' : 'Administrator Full Name'}
            </Typography>
            <TextField
              fullWidth
              id="contactName"
              placeholder={data.facilityType === 'dental' ? 'Dr. John Smith (BDS)' : 'Dr. John Doe'}
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

          {/* Removed previous referral code box from here as it's now a toggle */}

          {/* Org Name */}
          <Box>
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

          {/* GST Number with Verification */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              GST Number (Optional)
            </Typography>
            <TextField
              fullWidth
              id="gstNumber"
              placeholder="27AAACR1234R1Z5"
              error={gstStatus === "invalid"}
              {...register("gstNumber")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GavelIcon color={gstStatus === "valid" ? "success" : "action"} />
                  </InputAdornment>
                ),
                endAdornment: gstStatus === "loading" ? (
                  <InputAdornment position="end">
                    <CircularProgress size={16} />
                  </InputAdornment>
                ) : null
              }}
            />
            <Box mt={0.5} minHeight={20}>
              {gstStatus === "valid" && (
                <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                  <VerifiedIcon fontSize="inherit" sx={{ mr: 0.5 }} /> Verified: {verifiedLegalName}
                </Typography>
              )}
              {gstStatus === "invalid" && gstValue && (
                <Typography variant="caption" color="error.main" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                  <HighlightOffIcon fontSize="inherit" sx={{ mr: 0.5 }} /> Invalid GST Format
                </Typography>
              )}
            </Box>
          </Box>

          {/* Subdomain */}
          <Box>
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
                    <Typography variant="body2" sx={{ ml: 1, mt: 0.2 }}>https://kaeropresibe.com/?client=</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        <Box mb={1} minHeight={24} display="flex" alignItems="center" px={1}>
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
              {errors.subdomain?.message}
            </Typography>
          )}
        </Box>

        <Box mb={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasReferral}
                onChange={(e) => {
                  setHasReferral(e.target.checked);
                  if (!e.target.checked) updateData({ referralCode: "" });
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                I have a referral code
              </Typography>
            }
          />

          <Collapse in={hasReferral}>
            <Box sx={{ mt: 2, maxWidth: 400 }}>
              <TextField
                fullWidth
                id="referralCode"
                label="Referral Code / EMP ID"
                placeholder="KRP-XXXX"
                {...register("referralCode")}
                error={mrStatus === "invalid"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color={mrStatus === "valid" ? "success" : "action"} />
                    </InputAdornment>
                  ),
                  endAdornment: mrStatus === "loading" ? (
                    <InputAdornment position="end">
                      <CircularProgress size={16} />
                    </InputAdornment>
                  ) : null
                }}
              />
              <Box mt={1} minHeight={20}>
                {mrStatus === "valid" && (
                  <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                    <VerifiedIcon fontSize="inherit" sx={{ mr: 0.5 }} /> Verified: MR {verifiedMrName}
                  </Typography>
                )}
                {mrStatus === "invalid" && (
                  <Typography variant="caption" color="error.main" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                    <HighlightOffIcon fontSize="inherit" sx={{ mr: 0.5 }} /> Invalid referral code
                  </Typography>
                )}
              </Box>
            </Box>
          </Collapse>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={!isValid || subdomainStatus !== "available" || reserving || isReferralInvalid || isReferralLoading || isGstInvalid || gstStatus === "loading"}
          endIcon={reserving ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
          sx={{ mb: 2 }}
        >
          {reserving ? "Reserving..." : "Next: Configure Modules"}
        </Button>
      </form>
    </Box>
  );
}
