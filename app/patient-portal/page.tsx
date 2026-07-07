"use client";

import React, { useState, useEffect } from "react";
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
        sx={{
          mt: 4,
          height: 52,
          bgcolor: "#0877C9",
          "&:hover": { bgcolor: "#0563AA" },
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
          borderRadius: 2,
        }}
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

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutate(otp);
    } catch (err) {
      // Error handled by hook
    }
  };

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

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        disabled={isPending}
        required
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
          maxLength: 6,
          style: { letterSpacing: "0.5em", textAlign: "center", fontSize: "1.25rem", fontWeight: 600 }
        }}
        InputProps={{ sx: { height: 56, borderRadius: 2 } }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isPending || otp.length !== 6}
        sx={{
          mt: 4,
          height: 52,
          bgcolor: "#0877C9",
          "&:hover": { bgcolor: "#0563AA" },
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
          borderRadius: 2,
        }}
      >
        {isPending ? <CircularProgress size={24} color="inherit" /> : "Verify and continue"}
      </Button>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        {countdown > 0 ? (
          <Typography variant="body2" color="text.secondary">
            Resend code in 00:{countdown.toString().padStart(2, "0")}
          </Typography>
        ) : (
          <MuiLink component="button" type="button" variant="body2" underline="hover" onClick={() => setCountdown(30)}>
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
                  <Box sx={{ bgcolor: "rgba(14, 165, 233, 0.15)", p: 1, borderRadius: "50%", display: "flex", color: "#38bdf8" }}>
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
