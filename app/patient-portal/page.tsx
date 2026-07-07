"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Link as MuiLink,
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import { Phone, Mail, ArrowLeft, ShieldCheck, HeartPulse } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const PRIMARY_BUTTON_SX = {
  mt: 4,
  height: 52,
  bgcolor: "#0D9488",
  color: "#FFFFFF",
  "&:hover": { bgcolor: "#0F766E" },
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 700,
  borderRadius: 2,
};

// Custom Hooks for Mutations (Mocked for this exercise)
const useRequestOtpMutation = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (identifier: string, type: "mobile" | "email") => {
    setIsPending(true);
    setError(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsPending(false);
        if (type === "mobile" && identifier.length < 10) {
          const err = "Invalid mobile number";
          setError(err);
          reject(err);
        } else if (type === "email" && !identifier.includes("@")) {
          const err = "Invalid email format";
          setError(err);
          reject(err);
        } else {
          resolve({ success: true });
        }
      }, 800);
    });
  };

  return { mutate, isPending, error };
};

const useVerifyOtpMutation = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const mutate = async (otp: string) => {
    setIsPending(true);
    setError(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsPending(false);
        if (otp === "123456") {
          localStorage.setItem("patient_session", "true");
          router.push("/portal/home");
          resolve({ success: true });
        } else {
          const err = "Invalid or expired OTP. Try 123456.";
          setError(err);
          reject(err);
        }
      }, 800);
    });
  };

  return { mutate, isPending, error };
};

// Components
const AuthSupportLinks = () => (
  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4, flexWrap: "wrap", gap: 2 }}>
    <MuiLink href="#" underline="hover" color="text.secondary" variant="body2">Privacy Policy</MuiLink>
    <MuiLink href="#" underline="hover" color="text.secondary" variant="body2">Terms of Use</MuiLink>
    <MuiLink href="#" underline="hover" color="text.secondary" variant="body2">Patient Support</MuiLink>
  </Stack>
);

const IdentifierForm = ({ onSuccess }: { onSuccess: (id: string, type: "mobile" | "email") => void }) => {
  const [method, setMethod] = useState<"mobile" | "email">("mobile");
  const [identifier, setIdentifier] = useState("");
  const { mutate, isPending, error } = useRequestOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutate(identifier, method);
      onSuccess(identifier, method);
    } catch (err) {
      // Handled by hook error state
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Tabs
        value={method}
        onChange={(_, val) => { setMethod(val); setIdentifier(""); }}
        variant="fullWidth"
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Mobile" value="mobile" sx={{ textTransform: "none", fontWeight: 600, fontSize: "1rem" }} />
        <Tab label="Email" value="email" sx={{ textTransform: "none", fontWeight: 600, fontSize: "1rem" }} />
      </Tabs>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {method === "mobile" ? (
        <TextField
          fullWidth
          label="Mobile Number"
          variant="outlined"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ""))}
          disabled={isPending}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>+91</Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 1.5, my: 1 }} />
                <Phone size={18} />
              </InputAdornment>
            ),
            sx: { height: 56, borderRadius: 2 }
          }}
          required
        />
      ) : (
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          variant="outlined"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          disabled={isPending}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><Mail size={18} /></InputAdornment>
            ),
            sx: { height: 56, borderRadius: 2 }
          }}
          required
        />
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isPending || !identifier}
        sx={PRIMARY_BUTTON_SX}
      >
        {isPending ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
      </Button>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
        By continuing, you agree to our <MuiLink href="#">Terms</MuiLink> and <MuiLink href="#">Privacy Policy</MuiLink>.
      </Typography>
    </Box>
  );
};

const OtpVerificationForm = ({ identifier, type, onBack }: { identifier: string; type: "mobile" | "email"; onBack: () => void }) => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(30);
  const { mutate, isPending, error } = useVerifyOtpMutation();
  const submittedOtpRef = useRef("");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const verifyOtp = async (nextOtp: string) => {
    if (nextOtp.length !== 6 || isPending || submittedOtpRef.current === nextOtp) return;

    submittedOtpRef.current = nextOtp;

    try {
      await mutate(nextOtp);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleOtpChange = (value: string) => {
    const nextOtp = value.replace(/\D/g, "").slice(0, 6);

    setOtp(nextOtp);

    if (nextOtp.length < 6) {
      submittedOtpRef.current = "";
      return;
    }

    void verifyOtp(nextOtp);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    handleOtpChange(event.clipboardData.getData("text"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtp(otp);
  };

  useEffect(() => {
    if (error) submittedOtpRef.current = "";
  }, [error]);

  const displayId = type === "mobile" ? `+91 ******${identifier.slice(-4)}` : identifier.replace(/^(.)(.*)(.@.*)$/, "$1***$3");

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Button
        startIcon={<ArrowLeft size={16} />}
        onClick={onBack}
        sx={{ mb: 3, color: "text.secondary", textTransform: "none" }}
      >
        Change {type}
      </Button>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Enter the 6-digit code sent to <strong>{displayId}</strong>
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Box sx={{ width: "100%" }}>
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={handleOtpChange}
          disabled={isPending}
          pattern={REGEXP_ONLY_DIGITS}
          inputMode="numeric"
          autoComplete="one-time-code"
          onPaste={handlePaste}
          containerClassName="w-full justify-center"
        >
          <InputOTPGroup className="grid w-full grid-cols-6 gap-2 sm:gap-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className={[
                  "h-14 w-full rounded-lg border-2 bg-white text-2xl font-bold text-slate-900 transition-all duration-200 sm:h-16",
                  otp.length === index ? "border-[#0D9488] ring-4 ring-[#0D9488]/10" : "border-slate-200",
                  error ? "border-red-500 bg-red-50" : "",
                ].join(" ")}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isPending || otp.length !== 6}
        sx={PRIMARY_BUTTON_SX}
      >
        {isPending ? <CircularProgress size={24} color="inherit" /> : "Verify and continue"}
      </Button>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        {countdown > 0 ? (
          <Typography variant="body2" color="text.secondary">
            Resend code in 00:{countdown.toString().padStart(2, "0")}
          </Typography>
        ) : (
          <MuiLink
            component="button"
            type="button"
            variant="body2"
            underline="hover"
            onClick={() => {
              setOtp("");
              submittedOtpRef.current = "";
              setCountdown(30);
            }}
            sx={{ color: "#0D9488", fontWeight: 700 }}
          >
            Resend OTP
          </MuiLink>
        )}
      </Box>
    </Box>
  );
};

export default function PatientPortalAuth() {
  const [step, setStep] = useState<1 | 2>(1);
  const [authData, setAuthData] = useState<{ id: string; type: "mobile" | "email" } | null>(null);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#07111F", display: "flex", flexDirection: "column" }}>
      {/* Global Header */}
      <Box component="header" sx={{ p: { xs: 2, md: 4 }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <BrandLogo mark={32} />
        <Button variant="text" sx={{ color: "text.secondary", textTransform: "none", fontWeight: 500 }}>
          Need assistance?
        </Button>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ flex: 1, display: "flex", alignItems: "center", py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", md: "row" }, gap: { xs: 4, md: 8 }, width: "100%", alignItems: "center" }}>
          
          {/* Left Informational Panel */}
          <Box sx={{ flex: 1, px: { xs: 2, md: 0 }, pb: { xs: 4, md: 0 } }}>
            <Typography variant="h3" component="h1" fontWeight="700" color="#F8FAFC" gutterBottom sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>
              Access your healthcare journey
            </Typography>
            <Typography variant="h6" color="#94A3B8" sx={{ mb: 4, fontWeight: 400, maxWidth: 480 }}>
              View and manage your medical data securely in one place.
            </Typography>

            <Stack spacing={2} sx={{ mb: 6 }}>
              {[
                "Medical history & records",
                "Digital prescriptions",
                "Laboratory & diagnostic reports",
                "Appointments & follow-ups",
                "Bills and payments"
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ bgcolor: "rgba(13, 148, 136, 0.16)", p: 1, borderRadius: "50%", display: "flex", color: "#5EEAD4" }}>
                    <ShieldCheck size={20} />
                  </Box>
                  <Typography variant="body1" color="#E2E8F0" fontWeight="500">{item}</Typography>
                </Box>
              ))}
            </Stack>

            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2, color: "#94A3B8" }}>
              <HeartPulse size={24} />
              <Typography variant="body2">Trusted by 500+ clinics</Typography>
            </Box>
          </Box>

          {/* Right Authentication Surface */}
          <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: 460 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 5 },
                borderRadius: "16px",
                border: "1px solid #DCE4EC",
                bgcolor: "#FFFFFF",
                boxShadow: "0 12px 40px -12px rgba(0,0,0,0.05)"
              }}
            >
              <Typography variant="h5" component="h2" fontWeight="700" color="#152536" gutterBottom>
                Welcome to Patient Portal
              </Typography>
              <Typography variant="body1" color="#526273" sx={{ mb: 4 }}>
                {step === 1 ? "Sign in securely using a one-time password." : "Verify your identity."}
              </Typography>

              {step === 1 ? (
                <IdentifierForm
                  onSuccess={(id, type) => {
                    setAuthData({ id, type });
                    setStep(2);
                  }}
                />
              ) : (
                <OtpVerificationForm
                  identifier={authData!.id}
                  type={authData!.type}
                  onBack={() => setStep(1)}
                />
              )}
            </Paper>

            <AuthSupportLinks />
            <Typography variant="caption" display="block" align="center" color="#748394" sx={{ mt: 4 }}>
              Secure encrypted portal
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
