"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PaymentIcon from "@mui/icons-material/Payment";
import { AddressInput } from "@/components/ui/google-places-input";
import { OnboardingData } from "../OnboardingWizard";
import { useRegisterOrgMutation } from "@/hooks/queries/useOnboarding";
import { loadRazorpayScript } from "@/lib/services/razorpay.service";
import { Address } from "@/lib/api/types/onboarding.types";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsAndConditionsModal } from "../TermsAndConditionsModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema, ContactFormValues } from "@/lib/validations/onboarding-schema";

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
    formState: { errors, isValid } 
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    mode: "onChange",
    defaultValues: {
      contactName: (data as any).contactName || "",
      contactPhone: (data as any).contactPhone || "",
      gstNumber: (data as any).gstNumber || "",
    }
  });

  const { mutate: registerOrg, isPending: registering } = useRegisterOrgMutation();
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [addressData, setAddressData] = useState<Address | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

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

    if (!data.verifiedToken || !data.orgName || !data.subdomain || !(data as any).selectionType) {
      setErrorMsg("Missing core identity details. Please go back and complete previous steps.");
      return;
    }
    const payload = {
      ...data,
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
                name: (data as any).contactName,
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
                    
                    // Critical: Immediate localStorage persistence to avoid race condition 
                    // before Prop/State update propagates to the next step.
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={3}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
            Phone Number
          </Typography>
          <TextField
            fullWidth
            placeholder="+91 9876543210"
            error={!!errors.contactPhone}
            helperText={errors.contactPhone?.message || " "}
            {...register("contactPhone")}
          />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
            GST Number
          </Typography>
          <TextField
            fullWidth
            placeholder="22AAAAA0000A1Z5"
            error={!!errors.gstNumber}
            helperText={errors.gstNumber?.message || " "}
            {...register("gstNumber")}
          />
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
          disabled={isProcessing || !termsAccepted || !isValid}
          endIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
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
            : "Pay & Complete Setup"}
        </Button>
      </form>

      <TermsAndConditionsModal 
        open={termsModalOpen} 
        onOpenChange={setTermsModalOpen} 
      />
    </Box>
  );
}
