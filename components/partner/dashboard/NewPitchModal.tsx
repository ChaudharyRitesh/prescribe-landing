"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  IconButton,
  Slider,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  LocalHospital,
  Person,
  Notes,
  Event as EventIcon,
  Category,
  MoreTime
} from "@mui/icons-material";
import { useDashboard } from "@/app/partner/dashboard/context/DashboardContext";
import { toast } from "sonner";
import { apiClient as api } from "@/lib/api/axios";

const statusOptions = [
  "Initial Pitch",
  "Demo Scheduled",
  "Follow up",
  "Proposal Sent",
  "Contract Pending",
  "Closed Won",
  "Closed Lost",
];

const priorityOptions = [
  "Low",
  "Medium",
  "High"
];

const visitTypeOptions = [
  "In-person Meeting",
  "Phone Call",
  "Virtual Demo",
  "Facility Event",
  "Sample Delivery",
];

const mockProducts = [
  "Kaero Prescribe",
  "AI Scribe",
  "Pharmacy Module",
];

const toLocalDateString = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
};

export default function NewPitchModal() {
  const { isNewPitchModalOpen, closeNewPitchModal } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hospitalName: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    department: "",
    status: "Initial Pitch",
    priority: "Medium",
    visitType: "In-person Meeting",
    visitDate: toLocalDateString(new Date()),
    followUpDate: "",
    potentialValue: "",
    probability: 20,
    products: [] as string[],
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = "Hospital name is required";
    }

    if (formData.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactEmail)) {
        newErrors.contactEmail = "Invalid email format";
      }
    }

    if (formData.contactPhone) {
      // Basic Indian phone validation (10 digits, optional +91)
      const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
      if (!phoneRegex.test(formData.contactPhone.replace(/\s/g, ""))) {
        newErrors.contactPhone = "Invalid Indian phone number (10 digits)";
      }
    }

    if (formData.potentialValue && Number(formData.potentialValue) < 0) {
      newErrors.potentialValue = "Potential value cannot be negative";
    }

    if (!formData.visitDate) {
      newErrors.visitDate = "Visit date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (_: any, newValue: number | number[]) => {
    setFormData((prev) => ({ ...prev, probability: newValue as number }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        winProbability: formData.probability,
        productsPitched: formData.products,
        nextFollowUpDate: formData.followUpDate || undefined
      };

      const response: any = await api.post("/mr/pitches", payload);

      if (response.success) {
        toast.success("New pitch logged successfully!");
        closeNewPitchModal();

        // Reset form
        setFormData({
          hospitalName: "",
          contactPerson: "",
          contactEmail: "",
          contactPhone: "",
          department: "",
          status: "Initial Pitch",
          priority: "Medium",
          visitType: "In-person Meeting",
          visitDate: toLocalDateString(new Date()),
          followUpDate: "",
          potentialValue: "",
          probability: 20,
          products: [],
          notes: "",
        });
        setErrors({});
      }
    } catch (error: any) {
      console.error("Pitch logging error:", error);
      toast.error(error.response?.data?.message || "Failed to log pitch");
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (product: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter(p => p !== product)
        : [...prev.products, product]
    }));
  };

  return (
    <Dialog
      open={isNewPitchModalOpen}
      onClose={closeNewPitchModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: "rgba(13, 148, 136, 0.1)",
              color: "primary.main",
              borderRadius: 2,
              display: "flex"
            }}
          >
            <LocalHospital fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight="700">Log New Pitch</Typography>
        </Box>
        <IconButton onClick={closeNewPitchModal} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderBottom: "none" }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                id="pitch-hospital-name"
                label="Hospital / Clinic Name"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                error={!!errors.hospitalName}
                helperText={errors.hospitalName}
                placeholder="e.g. City General Hospital"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalHospital sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="pitch-contact-person"
                label="Contact Person"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Dr. Smith"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="pitch-department"
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Cardiology"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="pitch-contact-email"
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                error={!!errors.contactEmail}
                helperText={errors.contactEmail}
                placeholder="doctor@hospital.com"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="pitch-contact-phone"
                label="Contact Phone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                error={!!errors.contactPhone}
                helperText={errors.contactPhone}
                placeholder="+91..."
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                id="pitch-priority"
                size="small"
                label="Lead Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                id="pitch-status"
                size="small"
                label="Pitch Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                id="pitch-visit-type"
                size="small"
                label="Visit Type"
                name="visitType"
                value={formData.visitType}
                onChange={handleChange}
              >
                {visitTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id="pitch-visit-date"
                size="small"
                label="Visit Date"
                name="visitDate"
                type="date"
                value={formData.visitDate}
                onChange={handleChange}
                error={!!errors.visitDate}
                helperText={errors.visitDate}
                inputProps={{ min: toLocalDateString(new Date()) }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="pitch-follow-up-date"
                size="small"
                label="Next Follow-up"
                name="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange}
                inputProps={{ min: formData.visitDate || toLocalDateString(new Date()) }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoreTime sx={{ color: "text.secondary", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="pitch-potential-value"
                size="small"
                label="Potential Value"
                name="potentialValue"
                type="number"
                value={formData.potentialValue}
                onChange={handleChange}
                error={!!errors.potentialValue}
                helperText={errors.potentialValue}
                placeholder="₹"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: "text.secondary", fontSize: 18, mr: 1 }}>₹</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ px: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Win Probability: {formData.probability}%
                </Typography>
                <Slider
                  size="small"
                  value={formData.probability}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  sx={{ color: "primary.main" }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Products Pitched
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {mockProducts.map(product => (
                  <Box
                    key={product}
                    onClick={() => toggleProduct(product)}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: formData.products.includes(product) ? 'primary.main' : 'rgba(0,0,0,0.1)',
                      bgcolor: formData.products.includes(product) ? 'rgba(13, 148, 136, 0.05)' : 'transparent',
                      color: formData.products.includes(product) ? 'primary.main' : 'text.secondary',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <Category sx={{ fontSize: 14 }} />
                    {product}
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                id="pitch-notes"
                rows={3}
                label="Notes & Next Steps"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                      <Notes sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={closeNewPitchModal} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ px: 4, py: 1 }}
          >
            {loading ? "Saving..." : "Save Pitch"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
