"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PaymentIcon from "@mui/icons-material/Payment";
import { usePlacesWidget } from "react-google-autocomplete";
import { OnboardingData } from "../OnboardingWizard";
import { useRegisterOrgMutation } from "@/hooks/queries/useOnboarding";
import { loadRazorpayScript } from "@/lib/services/razorpay.service";
import { Address } from "@/lib/api/types/onboarding.types";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function FinalReviewAndPayment({ onNext, onBack, updateData, data }: Props) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      contactPhone: "",
      gstNumber: "",
    }
  });

  const { mutate: registerOrg, isPending: registering } = useRegisterOrgMutation();
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [addressData, setAddressData] = useState<Address | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { ref: autocompleteRef } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    options: {
      types: ["address"],
      componentRestrictions: { country: "in" },
    },
    onPlaceSelected: (place: any) => {
      if (!place || !place.address_components) return;

      let building = "", street = "", city = "", district = "", state = "", country = "", postalCode = "";

      place.address_components.forEach((component: any) => {
        const types = component.types;
        if (types.includes("street_number")) building = component.long_name;
        if (types.includes("route")) street = component.long_name;
        if (types.includes("locality")) city = component.long_name;
        if (types.includes("administrative_area_level_2")) district = component.long_name;
        if (types.includes("administrative_area_level_1")) state = component.long_name;
        if (types.includes("country")) country = component.long_name;
        if (types.includes("postal_code")) postalCode = component.long_name;
      });

      setAddressData({
        building: building || undefined,
        street: street || undefined,
        city: city || undefined,
        district: district || undefined,
        state: state || undefined,
        country: country || undefined,
        postalCode: postalCode || undefined,
        pincode: postalCode || undefined,
      });
    },
  });

  const onSubmit = async (values: any) => {
    setErrorMsg(null);

    if (!data.verifiedToken || !data.orgName || !data.subdomain || !(data as any).selectionType) {
      setErrorMsg("Missing core identity details. Please go back and complete previous steps.");
      return;
    }

    const payload = {
      orgName: data.orgName,
      subdomain: data.subdomain,
      contactName: (data as any).contactName || "Administrator",
      contactPhone: values.contactPhone,
      address: addressData || undefined,
      gstNumber: values.gstNumber,
      selectionType: (data as any).selectionType,
      packageId: (data as any).packageId,
      selectedModules: (data as any).selectedModules,
      billingCycle: (data as any).billingCycle || "monthly",
    };

    registerOrg(
      { payload: payload as any, token: data.verifiedToken },
      {
        onSuccess: async (res) => {
          if (res.status === "pending_payment" && res.orderId) {
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
              order_id: res.orderId,
              prefill: {
                name: (data as any).contactName,
                email: data.email,
                contact: values.contactPhone,
              },
              handler: async function (response: any) {
                // Call verify-payment immediately after Razorpay handler fires.
                // Triggers provisioning without waiting for the async webhook.
                try {
                  const verifyRes = await fetch(`${BACKEND_URL}/onboarding/verify-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_order_id: response.razorpay_order_id,           // Order-based onboarding
                      razorpay_subscription_id: response.razorpay_subscription_id, // Subscription (if applicable)
                      razorpay_signature: response.razorpay_signature,
                      sessionId,
                    }),
                  });
                  const verifyData = await verifyRes.json();
                  if (verifyData.success) {
                    updateData({ sessionId });
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
                  // Fallback: move to status page to poll
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
            Phone Number (Optional)
          </Typography>
          <TextField
            fullWidth
            placeholder="+91 9876543210"
            {...register("contactPhone")}
          />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
            GST Number (Optional)
          </Typography>
          <TextField
            fullWidth
            placeholder="22AAAAA0000A1Z5"
            {...register("gstNumber")}
          />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
            Clinic/Hospital Address (Optional)
          </Typography>
          <TextField
            inputRef={autocompleteRef}
            fullWidth
            placeholder="Search on Google Maps..."
            helperText="Start typing to autosearch via Google Places"
          />
          {addressData && (
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, pt: 1, borderTop: "1px solid #e5e7eb", color: "text.secondary" }}
            >
              <strong>Extracted Details:</strong>{" "}
              {[addressData.street, addressData.city, addressData.state, addressData.pincode, addressData.country]
                .filter(Boolean)
                .join(", ")}
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isProcessing}
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
    </Box>
  );
}
