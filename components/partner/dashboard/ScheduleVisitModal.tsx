"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useDashboard } from "@/app/partner/dashboard/context/DashboardContext";
import { apiClient } from "@/lib/api/axios";
import { toast } from "sonner";

interface ScheduleVisitModalProps {
  open: boolean;
  onClose: () => void;
  initialDate?: Date;
}

const eventTypes = ["Visit", "Follow-up", "Demo", "Meeting", "Other"];

const toLocalISOString = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

export default function ScheduleVisitModal({ open, onClose, initialDate }: ScheduleVisitModalProps) {
  const { pitches, refreshSchedule } = useDashboard();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start: toLocalISOString(new Date()),
    end: toLocalISOString(new Date(Date.now() + 3600000)),
    type: "Visit",
    pitchId: "",
    location: ""
  });

  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        start: initialDate ? toLocalISOString(new Date(new Date(initialDate).setHours(9, 0, 0, 0))) : toLocalISOString(new Date()),
        end: initialDate ? toLocalISOString(new Date(new Date(initialDate).setHours(10, 0, 0, 0))) : toLocalISOString(new Date(Date.now() + 3600000)),
        type: "Visit",
        pitchId: "",
        location: ""
      });
    }
  }, [open, initialDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response: any = await apiClient.post("/mr/schedule", formData);
      if (response.success) {
        toast.success("Event scheduled successfully");
        await refreshSchedule();
        onClose();
        setFormData({
          title: "",
          description: "",
          start: toLocalISOString(new Date()),
          end: toLocalISOString(new Date(Date.now() + 3600000)),
          type: "Visit",
          pitchId: "",
          location: ""
        });
      }
    } catch (error) {
      toast.error("Failed to schedule event");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700 }}>Schedule Field Activity</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Demo at City General"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Event Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {eventTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Link to Pitch (Optional)"
                name="pitchId"
                value={formData.pitchId}
                onChange={handleChange}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {pitches.map((pitch: any) => (
                  <MenuItem key={pitch._id} value={pitch._id}>
                    {pitch.hospitalName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                name="start"
                required
                value={formData.start}
                onChange={handleChange}
                inputProps={{ min: toLocalISOString(new Date()) }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                name="end"
                required
                value={formData.end}
                onChange={handleChange}
                inputProps={{ min: formData.start || toLocalISOString(new Date()) }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Hospital wing, Department, etc."
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description / Notes"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ bgcolor: "#0D9488", "&:hover": { bgcolor: "#0f766e" } }}
          >
            {loading ? "Scheduling..." : "Save Event"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
