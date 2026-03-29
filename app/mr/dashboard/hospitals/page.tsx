"use client";

import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Event as EventIcon,
  RequestQuote as RequestQuoteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useDashboard } from "../context/DashboardContext";
import { apiClient } from "@/lib/api/axios";
import { Select, MenuItem as MuiMenuItem, Menu } from "@mui/material";
import { useState } from "react";

const PITCH_STATUSES = [
  "Initial Pitch",
  "Demo Scheduled",
  "Follow up",
  "Proposal Sent",
  "Contract Pending",
  "Closed Won",
  "Closed Lost"
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Closed Won": return "success";
    case "Demo Scheduled": return "info";
    case "Warm Lead": return "warning";
    case "Follow up": return "warning";
    case "Proposal Sent": return "secondary";
    case "Contract Pending": return "info";
    case "Initial Pitch": return "primary";
    default: return "default";
  }
};

export default function HospitalsPage() {
  const { pitches, loading, openNewPitchModal, refreshPitches } = useDashboard();

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
            My Hospital Leads
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Track your sales pipeline and hospital outreach progress.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openNewPitchModal}
          sx={{ px: 3, py: 1.2, boxShadow: "0px 4px 12px rgba(13, 148, 136, 0.3)", bgcolor: "#0D9488", "&:hover": { bgcolor: "#0f766e" } }}
        >
          Add New Hospital
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "background.default" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Hospital Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Contact Person</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Est. Lead Value</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Win Prob.</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pitches.length > 0 ? pitches.map((pitch) => (
                <TableRow key={pitch._id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: "all 0.2s", "&:hover": { bgcolor: "rgba(0,0,0,0.02)" } }}>
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{pitch.hospitalName}</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>{pitch.department || 'General'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{pitch.contactPerson || "N/A"}</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>{pitch.contactPhone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={pitch.status}
                      size="small"
                      disabled={pitch.status === "Closed Won" || pitch.isConvertedToActive}
                      onChange={async (e) => {
                        try {
                          await apiClient.patch(`/mr/pitches/${pitch._id}`, { status: e.target.value });
                          refreshPitches();
                        } catch (err) {
                          console.error("Failed to update pitch status", err);
                        }
                      }}
                      sx={{
                        height: 32,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: 1.5,
                        '& .MuiSelect-select': {
                          py: 0.5,
                          px: 1.5,
                          color: `${getStatusColor(pitch.status)}.main`
                        }
                      }}
                    >
                      {PITCH_STATUSES.map(stat => (
                        <MuiMenuItem key={stat} value={stat} sx={{ fontSize: '0.75rem' }}>{stat}</MuiMenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>₹{pitch.potentialValue?.toLocaleString() || '0'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={pitch.winProbability || 0}
                        sx={{ width: 40, height: 4, borderRadius: 2 }}
                      />
                      <Typography variant="caption" fontWeight="bold">{pitch.winProbability || 0}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <LeadActions pitch={pitch} />
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      {loading ? "Loading lead pipeline..." : "No hospital leads found. Create your first pitch!"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
function LeadActions({ pitch }: { pitch: any }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { refreshPitches } = useDashboard();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: 180, borderRadius: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' } }}
      >
        <MuiMenuItem onClick={handleClose} sx={{ gap: 1.5, fontSize: '0.85rem' }}>
          <VisibilityIcon fontSize="small" color="action" /> View Details
        </MuiMenuItem>
        <MuiMenuItem onClick={() => { handleClose(); /* Future: openScheduleModal(pitch.id) */ }} sx={{ gap: 1.5, fontSize: '0.85rem' }}>
          <EventIcon fontSize="small" color="action" /> Schedule Visit
        </MuiMenuItem>

        {["Follow up", "Proposal Sent"].includes(pitch.status) && (
          <MuiMenuItem onClick={() => { handleClose(); /* Future: openAdvanceModal(pitch.id) */ }} sx={{ gap: 1.5, fontSize: '0.85rem' }}>
            <RequestQuoteIcon fontSize="small" color="action" /> Request Advance
          </MuiMenuItem>
        )}

        <Divider sx={{ my: 1 }} />

        <MuiMenuItem onClick={handleClose} sx={{ gap: 1.5, fontSize: '0.85rem', color: 'error.main' }}>
          <EditIcon fontSize="small" color="error" /> Edit Lead
        </MuiMenuItem>
      </Menu>
    </>
  );
}
