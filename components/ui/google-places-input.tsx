"use client";

import { useState, useCallback } from "react";
import { Box, TextField, Grid } from "@mui/material";
import { Address } from "@/lib/api/types/onboarding.types";

interface AddressInputProps {
  onAddressChange: (address: Address) => void;
  initialAddress?: Address | null;
}

export function AddressInput({ onAddressChange, initialAddress }: AddressInputProps) {
  const [address, setAddress] = useState<Address>({
    building: initialAddress?.building || "",
    street: initialAddress?.street || "",
    city: initialAddress?.city || "",
    district: initialAddress?.district || "",
    state: initialAddress?.state || "",
    country: initialAddress?.country || "India",
    postalCode: initialAddress?.postalCode || "",
    pincode: initialAddress?.pincode || "",
  });

  const handleChange = useCallback(
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const updated = { ...address, [field]: value };

      // Keep pincode & postalCode in sync
      if (field === "postalCode" || field === "pincode") {
        updated.postalCode = value;
        updated.pincode = value;
      }

      setAddress(updated);
      onAddressChange(updated);
    },
    [address, onAddressChange]
  );

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
      "&.Mui-focused": {
        backgroundColor: "#fff",
        boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.08)",
      },
      "& fieldset": {
        borderColor: "#e2e8f0",
        transition: "border-color 0.2s ease",
      },
      "&:hover fieldset": {
        borderColor: "#cbd5e1",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#4F46E5",
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#64748b",
      fontWeight: 500,
      fontSize: "0.875rem",
      "&.Mui-focused": {
        color: "#4F46E5",
      },
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "0.9rem",
      padding: "14px 16px",
    },
  };

  return (
    <Box
      sx={{
        p: 2.5,
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 1px 8px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Full address / Building line */}
      <TextField
        fullWidth
        label="Building / Flat / Floor"
        placeholder="e.g. 302, Sunrise Tower, 3rd Floor"
        value={address.building || ""}
        onChange={handleChange("building")}
        sx={{ ...fieldSx, mb: 2 }}
        size="small"
      />

      <TextField
        fullWidth
        label="Street / Locality"
        placeholder="e.g. MG Road, Bandra West"
        value={address.street || ""}
        onChange={handleChange("street")}
        sx={{ ...fieldSx, mb: 2 }}
        size="small"
      />

      {/* City + District row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="City"
            placeholder="e.g. Mumbai"
            value={address.city || ""}
            onChange={handleChange("city")}
            sx={fieldSx}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="District"
            placeholder="e.g. Mumbai Suburban"
            value={address.district || ""}
            onChange={handleChange("district")}
            sx={fieldSx}
            size="small"
          />
        </Grid>
      </Grid>

      {/* State + Pincode row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="State"
            placeholder="e.g. Maharashtra"
            value={address.state || ""}
            onChange={handleChange("state")}
            sx={fieldSx}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Pin Code"
            placeholder="e.g. 400050"
            value={address.pincode || ""}
            onChange={handleChange("pincode")}
            inputProps={{ maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" }}
            sx={fieldSx}
            size="small"
          />
        </Grid>
      </Grid>

      {/* Country (pre-filled) */}
      <TextField
        fullWidth
        label="Country"
        value={address.country || "India"}
        onChange={handleChange("country")}
        sx={fieldSx}
        size="small"
      />
    </Box>
  );
}
