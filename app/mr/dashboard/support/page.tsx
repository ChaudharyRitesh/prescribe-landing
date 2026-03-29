"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Chat as ChatIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { apiClient as axios } from "@/lib/api/axios";
import { socketService } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/app/mr/dashboard/context/DashboardContext";
import { toast } from "sonner";

interface Ticket {
  _id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  lastMessageAt: string;
  createdAt: string;
}

export default function SupportTicketsPage() {
  const { userData } = useDashboard();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  
  // New Ticket Form State
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Other");
  const [priority, setPriority] = useState("medium");
  const [initialMessage, setInitialMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/mr-chat/tickets");
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!subject.trim()) return;
    try {
      setSubmitting(true);
      const res = await axios.post("/mr-chat/tickets", {
        subject,
        category,
        priority,
        initialMessage
      });
      if (res.data.success) {
        toast.success("Support ticket created!");
        const ticketId = res.data.data._id;
        setOpenModal(false);
        setSubject("");
        setInitialMessage("");
        router.push(`/mr/dashboard/support/${ticketId}`);
      }
    } catch (err) {
      console.error("Error creating ticket:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "success";
      case "in_progress": return "warning";
      case "closed": return "default";
      default: return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#10b981";
      default: return "#94a3b8";
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
            Support & Tickets
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Track and manage your inquiries and issues with the Super Admin.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{
            bgcolor: "#0D9488",
            "&:hover": { bgcolor: "#0B7A6F" },
            borderRadius: "12px",
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(13, 148, 136, 0.2)"
          }}
        >
          New Ticket
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#0D9488" }} />
        </Box>
      ) : tickets.length === 0 ? (
        <Card sx={{ borderRadius: "24px", textAlign: "center", py: 10, bgcolor: "rgba(13, 148, 136, 0.02)", border: "1px dashed #0D9488" }}>
          <HistoryIcon sx={{ fontSize: 64, color: "#CBD5E1", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#475569", mb: 1 }}>No Tickets Found</Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>You haven't opened any support tickets yet.</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {tickets.map((ticket) => (
            <Grid key={ticket._id} size={{ xs: 12 }}>
              <Card 
                sx={{ 
                  borderRadius: "20px", 
                  border: "1px solid #E2E8F0", 
                  transition: "all 0.3s ease",
                  "&:hover": { boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", transform: "translateY(-2px)" },
                  cursor: "pointer"
                }}
                onClick={() => router.push(`/mr/dashboard/support/${ticket._id}`)}
              >
                <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {ticket.subject}
                        </Typography>
                        <Chip 
                          label={ticket.status.toUpperCase()} 
                          size="small" 
                          color={getStatusColor(ticket.status) as any}
                          sx={{ fontWeight: 800, fontSize: "10px", borderRadius: "6px" }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: "#64748B", display: "flex", alignItems: "center", gap: 1 }}>
                        Category: <span style={{ fontWeight: 600, color: "#334155" }}>{ticket.category}</span>
                        • ID: <span style={{ fontFamily: "monospace", fontSize: "12px" }}>#{ticket._id.slice(-6).toUpperCase()}</span>
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                        <Box sx={{ w: 8, h: 8, borderRadius: "50%", bgcolor: getPriorityColor(ticket.priority) }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                          {ticket.priority} Priority
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                        Last activity: {new Date(ticket.lastMessageAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2, opacity: 0.6 }} />
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button 
                      size="small" 
                      endIcon={<ChatIcon sx={{ fontSize: "16px !important" }} />}
                      sx={{ color: "#0D9488", fontWeight: 700, textTransform: "none" }}
                    >
                      View Conversation
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* New Ticket Modal */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        PaperProps={{ sx: { borderRadius: "24px", width: "100%", maxWidth: 500 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#1E293B", pb: 1 }}>Open New Support Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth
              label="Subject"
              placeholder="e.g., Delay in payment processing"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              variant="outlined"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                select
                fullWidth
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="Payment">Payment</MenuItem>
                <MenuItem value="Inventory">Inventory</MenuItem>
                <MenuItem value="App Issue">App Issue</MenuItem>
                <MenuItem value="Field Support">Field Support</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Detailed Message"
              placeholder="Please describe your issue in detail..."
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 4 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: "#64748B", fontWeight: 600 }}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={!subject.trim() || submitting}
            onClick={handleCreateTicket}
            sx={{ bgcolor: "#0D9488", "&:hover": { bgcolor: "#0B7A6F" }, borderRadius: "10px", px: 4, py: 1 }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : "Create Ticket"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
