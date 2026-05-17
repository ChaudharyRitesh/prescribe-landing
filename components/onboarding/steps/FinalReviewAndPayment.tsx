"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { AddressInput } from "@/components/ui/google-places-input";
import { OnboardingData } from "../OnboardingWizard";
import { useRegisterOrgMutation, useVerifyGstMutation } from "@/hooks/queries/useOnboarding";
import { loadRazorpayScript } from "@/lib/services/razorpay.service";
import { Address } from "@/lib/api/types/onboarding.types";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsAndConditionsModal } from "../TermsAndConditionsModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema, ContactFormValues } from "@/lib/validations/onboarding-schema";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDebounce } from "@/hooks/useDebounce";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function FinalReviewAndPayment({ onNext, onBack, updateData, data }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isValid }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    mode: "onChange",
    defaultValues: {
      contactName: data.contactName || "",
      contactPhone: data.contactPhone || "",
      gstNumber: data.gstNumber || "",
    }
  });

  const { mutate: registerOrg, isPending: registering } = useRegisterOrgMutation();
  const { mutate: verifyGst, isPending: verifyingGst } = useVerifyGstMutation();

  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [addressData, setAddressData] = useState<Address | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // GST Verification State
  const gstValue = watch("gstNumber");
  const debouncedGst = useDebounce(gstValue, 600);
  const [gstStatus, setGstStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [legalName, setLegalName] = useState<string | null>(null);

  useEffect(() => {
    // Basic regex check before calling API
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!debouncedGst || !gstRegex.test(debouncedGst)) {
      setGstStatus("idle");
      setLegalName(null);
      return;
    }

    setGstStatus("loading");
    verifyGst(debouncedGst, {
      onSuccess: (res) => {
        if (res.success && res.exists) {
          setGstStatus("valid");
          setLegalName(res.legalName || "Verified Entity");
        } else {
          setGstStatus("invalid");
          setLegalName(null);
        }
      },
      onError: () => {
        setGstStatus("invalid");
        setLegalName(null);
      }
    });
  }, [debouncedGst, verifyGst]);

  const handleAddressChange = (addr: Address) => {
    setAddressData(addr);
    setValue("address", {
      building: addr.building,
      street: addr.street,
      city: addr.city,
      district: addr.district,
      state: addr.state,
      postalCode: addr.postalCode,
    });
  };

  const onSubmit = async (values: ContactFormValues) => {
    setErrorMsg(null);

    // If GST was entered but failed verification, block submission
    if (values.gstNumber && gstStatus === "invalid") {
      setErrorMsg("Please provide a valid and verifiable GST number.");
      return;
    }

    if (!data.verifiedToken || !data.orgName || !data.subdomain || !data.selectionType) {
      setErrorMsg("Missing core identity details. Please go back and complete previous steps.");
      return;
    }
    const payload = {
      ...data,
      organizationType: data.facilityType,
      contactPhone: values.contactPhone,
      gstNumber: values.gstNumber,
      address: addressData || undefined,
      termsAccepted: termsAccepted,
    };

    registerOrg(
      { payload: payload as any, token: data.verifiedToken },
      {
        onSuccess: async (res) => {
          const razorpayOrderId = res.orderId || res.razorpayOrderId;
          if (res.status === "pending_payment" && razorpayOrderId) {
            setRazorpayLoading(true);
            const loaded = await loadRazorpayScript();

            if (!loaded) {
              setRazorpayLoading(false);
              setErrorMsg("Payment SDK failed to load. Please check your internet connection and try again.");
              return;
            }

            const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            const sessionId = res.sessionId;

            const options = {
              key: res.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
              amount: res.amount,
              currency: res.currency,
              name: data.orgName,
              description: "Kaero Prescribe Subscription",
              order_id: razorpayOrderId,
              prefill: {
                name: data.contactName,
                email: data.email,
                contact: values.contactPhone,
              },
              handler: async function (response: any) {
                try {
                  const verifyRes = await fetch(`${BACKEND_URL}/onboarding/verify-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_signature: response.razorpay_signature,
                      sessionId: sessionId || data.sessionId,
                    }),
                  });
                  const verifyData = await verifyRes.json();
                  if (verifyData.success) {
                    const finalSessionId = verifyData.sessionId || sessionId || data.sessionId;
                    console.log(`[FinalReviewAndPayment] verify-payment SUCCESS. sessionID: ${finalSessionId}`);

                    if (typeof window !== "undefined" && finalSessionId) {
                      const current = localStorage.getItem("kaero_onboarding_session");
                      const parsed = current ? JSON.parse(current) : {};
                      localStorage.setItem("kaero_onboarding_session", JSON.stringify({ ...parsed, sessionId: finalSessionId }));
                    }

                    updateData({ sessionId: finalSessionId });
                    onNext();
                  } else {
                    setRazorpayLoading(false);
                    setErrorMsg(
                      "Payment succeeded but workspace setup encountered an issue. " +
                      "Please contact support@kaero.in with your transaction ID: " +
                      response.razorpay_payment_id
                    );
                  }
                } catch (err) {
                  console.error("verify-payment error:", err);
                  updateData({ sessionId });
                  onNext();
                }
              },
              modal: {
                ondismiss: () => setRazorpayLoading(false),
              },
              theme: { color: "#4F46E5" },
            };

            const rzp = new (window as any).Razorpay(options);

            rzp.on("payment.failed", function (response: any) {
              setRazorpayLoading(false);
              const reason =
                response.error?.description ||
                response.error?.reason ||
                "Your payment could not be processed. Please try a different payment method.";
              setErrorMsg(`Payment unsuccessful: ${reason}`);
            });

            rzp.open();
          } else {
            updateData({ sessionId: res.sessionId || data.sessionId });
            onNext();
          }
        },
        onError: (err: any) => {
          setErrorMsg(
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong. Please try again or contact support."
          );
        },
      }
    );
  };

  const isProcessing = registering || razorpayLoading;

  return (
    <Box className="animate-fade-up">
      <Box mb={4}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2, color: "text.secondary", fontWeight: 500 }}
          size="small"
        >
          Back to Modules
        </Button>
        <Typography variant="h4" color="text.primary" gutterBottom>
          Review &amp; Payment
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter billing details securely before finalizing the setup.
        </Typography>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      {data.subscriptionPlan === 'kaero-nexus' && data.quotedPrice && (
        <Box 
          className="mb-6 p-6 rounded-[20px] border border-blue-100 bg-gradient-to-br from-blue-50/60 to-indigo-50/30 backdrop-blur-md"
          sx={{
            boxShadow: '0 8px 32px 0 rgba(147, 197, 253, 0.08)',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className="px-3 py-1 text-[11px] font-bold text-blue-700 bg-blue-100 rounded-full uppercase tracking-wider">
                Approved Custom Proposal
              </span>
              <h4 className="text-xl font-extrabold text-slate-800 mt-2">
                Kaero Prescribe Nexus
              </h4>
            </div>
            <div className="text-left md:text-right">
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                ₹{data.quotedPrice.toLocaleString('en-IN')}
              </Typography>
              <span className="text-xs font-semibold text-slate-500 capitalize block mt-0.5">
                Billed {data.billingCycle}
              </span>
            </div>
          </div>

          <div className="h-px bg-slate-200/60 my-4" />

          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Tailored Limits & Capacities
          </h5>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-white/80 rounded-xl p-3 border border-slate-100/50 shadow-sm">
              <span className="text-[11px] text-slate-500 block">Doctor Accounts</span>
              <span className="text-sm font-bold text-slate-800">{data.customLimits?.maxDoctors || 0} max</span>
            </div>
            <div className="bg-white/80 rounded-xl p-3 border border-slate-100/50 shadow-sm">
              <span className="text-[11px] text-slate-500 block">Receptionists</span>
              <span className="text-sm font-bold text-slate-800">{data.customLimits?.maxReceptionists || 0} max</span>
            </div>
            <div className="bg-white/80 rounded-xl p-3 border border-slate-100/50 shadow-sm">
              <span className="text-[11px] text-slate-500 block">Lab Technicians</span>
              <span className="text-sm font-bold text-slate-800">{data.customLimits?.maxLabTechs || 0} max</span>
            </div>
            <div className="bg-white/80 rounded-xl p-3 border border-slate-100/50 shadow-sm">
              <span className="text-[11px] text-slate-500 block">Pharmacists</span>
              <span className="text-sm font-bold text-slate-800">{data.customLimits?.maxPharmacists || 0} max</span>
            </div>
            <div className="bg-white/80 rounded-xl p-3 border border-slate-100/50 shadow-sm">
              <span className="text-[11px] text-slate-500 block">Admin Accounts</span>
              <span className="text-sm font-bold text-slate-800">{data.customLimits?.maxAdmins || 0} max</span>
            </div>
            <div className="bg-white/80 rounded-xl p-3 border border-slate-100/50 shadow-sm">
              <span className="text-[11px] text-slate-500 block">Cloud Storage</span>
              <span className="text-sm font-bold text-slate-800">{data.customLimits?.maxStorageGB || 0} GB</span>
            </div>
          </div>
        </Box>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={3}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
            Phone Number
          </Typography>
          <Controller
            name="contactPhone"
            control={control}
            render={({ field }) => (
              <Box
                sx={{
                  '& .PhoneInput': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: '12px 14px',
                    border: '1px solid',
                    borderColor: !!errors.contactPhone ? 'error.main' : 'rgba(0,0,0,0.23)',
                    borderRadius: '12px',
                    bgcolor: 'background.paper',
                    '&:focus-within': {
                      borderColor: !!errors.contactPhone ? 'error.main' : 'primary.main',
                      borderWidth: '2px',
                      p: '11px 13px',
                    }
                  },
                  '& .PhoneInputInput': {
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem',
                    width: '100%',
                    bgcolor: 'transparent'
                  }
                }}
              >
                <PhoneInput
                  {...field}
                  international
                  defaultCountry="IN"
                  placeholder="Enter phone number"
                />
                {errors.contactPhone && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5, display: 'block' }}>
                    {errors.contactPhone.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
            GST Number (Optional)
          </Typography>
          <TextField
            fullWidth
            placeholder="22AAAAA0000A1Z5"
            error={!!errors.gstNumber || gstStatus === "invalid"}
            helperText={errors.gstNumber?.message || (gstStatus === "invalid" ? "GST identification failed existence check." : " ")}
            {...register("gstNumber")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {gstStatus === "loading" && <CircularProgress size={20} />}
                  {gstStatus === "valid" && <CheckCircleIcon color="success" />}
                  {gstStatus === "invalid" && <ErrorIcon color="error" />}
                </InputAdornment>
              ),
            }}
          />
          {gstStatus === "valid" && legalName && (
            <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
              Verified: {legalName}
            </Typography>
          )}
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}>
            Clinic / Hospital Address
          </Typography>
          <AddressInput onAddressChange={handleAddressChange} initialAddress={addressData} />
          {errors.address && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              Please select a valid address from the clinical suggestions.
            </Typography>
          )}
        </Box>

        <Box mb={4} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              className="mt-1 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <div className="flex flex-col gap-1">
              <label
                htmlFor="terms"
                className="text-sm font-medium text-slate-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I agree to the Software License and Terms of Service
              </label>
              <button
                type="button"
                onClick={() => setTermsModalOpen(true)}
                className="text-[12px] text-blue-600 font-bold hover:text-blue-700 underline underline-offset-4 text-left w-fit transition-all hover:scale-105 active:scale-95"
              >
                Read detailed policies & refund terms
              </button>
            </div>
          </div>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isProcessing || !termsAccepted || !isValid || gstStatus === "loading" || !!(gstValue && gstStatus === "invalid")}
          endIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : ((data.subscriptionPlan === 'kaero-nexus' && !(data.quotedPrice && data.quotedPrice > 0)) ? undefined : <PaymentIcon />)}
          sx={{
            mt: 2,
            mb: 2,
            bgcolor: "#111827",
            color: "white",
            "&:hover": { bgcolor: "#030712" },
          }}
        >
          {razorpayLoading
            ? "Finalising your workspace..."
            : registering
              ? "Processing..."
              : (data.quotedPrice && data.quotedPrice > 0
                  ? `Pay ₹${data.quotedPrice.toLocaleString('en-IN')} & Complete Setup`
                  : (data.subscriptionPlan === 'kaero-nexus' ? "Submit Quote Request" : "Pay & Complete Setup"))}
        </Button>
      </form>

      <TermsAndConditionsModal
        open={termsModalOpen}
        onOpenChange={setTermsModalOpen}
      />
    </Box>
  );
}
