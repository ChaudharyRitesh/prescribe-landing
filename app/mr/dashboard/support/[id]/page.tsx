"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  PriorityHigh as PriorityIcon,
} from "@mui/icons-material";
import { apiClient as axios } from "@/lib/api/axios";
import { socketService } from "@/lib/socket";
import { useDashboard } from "@/app/mr/dashboard/context/DashboardContext";

interface Message {
  _id: string;
  senderId: string;
  senderRole: "mr" | "super_admin";
  text: string;
  status: "sent" | "delivered" | "seen";
  createdAt: string;
}

interface TicketData {
  _id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function TicketDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { userData } = useDashboard();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchTicketDetails();
    
    // Socket Setup
    const socket = socketService.connect();
    socket.emit("join_ticket", id);

    socket.on("new_mr_message", (msg: Message) => {
      setMessages(prev => {
        const messageMap = new Map(prev.map(m => [m._id, m]));
        messageMap.set(msg._id, msg);
        return Array.from(messageMap.values()).sort((a,b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      // Auto mark as seen if it's from admin
      if (msg.senderRole === "super_admin") {
        socket.emit("mr_message_seen", { 
          messageId: msg._id, 
          mrId: userData._id, 
          seenByRole: "mr" 
        });
      }
    });

    socket.on("message_sent", (msg: Message) => {
      setMessages(prev => {
        const messageMap = new Map(prev.map(m => [m._id, m]));
        messageMap.set(msg._id, msg);
        return Array.from(messageMap.values()).sort((a,b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    });

    socket.on("message_delivered", ({ messageId, deliveredAt }: any) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, status: "delivered" } : m));
    });

    socket.on("message_seen_update", ({ messageId, seenAt }: any) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, status: "seen" } : m));
    });

    return () => {
      socket.off("new_mr_message");
      socket.off("message_sent");
      socket.off("message_delivered");
      socket.off("message_seen_update");
    };
  }, [id, userData._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/mr-chat/tickets/${id}`);
      if (res.data.success) {
        setTicket(res.data.data.ticket);
        setMessages(res.data.data.messages);
        
        // Mark as seen via Socket (no more API hit)
        const socket = socketService.getSocket();
        if (socket) {
          socket.emit("mr_message_seen", { 
             ticketId: id, 
             mrId: userData._id, 
             seenByRole: "mr" 
          });
        }
      }
    } catch (err) {
      console.error("Error fetching ticket details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !userData?._id || !ticket || ticket.status === 'closed') return;
    
    const socket = socketService.getSocket();
    if (!socket) return;

    const msgData = {
      ticketId: id,
      mrId: userData._id,
      senderId: userData._id,
      senderRole: "mr",
      receiverId: "super_admin",
      text: inputText
    };

    socket.emit("mr_send_message", msgData);
    setInputText("");
  };

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
      <CircularProgress sx={{ color: "#0D9488" }} />
    </Box>
  );

  if (!ticket) return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography color="error">Ticket not found</Typography>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/mr/dashboard/support")}>Back to Support</Button>
    </Box>
  );

  return (
    <Box sx={{ height: "calc(100vh - 100px)", display: "flex", flexDirection: "column", p: { xs: 1, md: 3 } }}>
      {/* Header */}
      <Card sx={{ borderRadius: "16px", mb: 2, border: "1px solid #E2E8F0" }}>
        <CardContent sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => router.push("/mr/dashboard/support")} sx={{ color: "#64748B" }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1E293B", lineHeight: 1.2 }}>
              {ticket.subject}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: "#64748B", display: "flex", alignItems: "center", gap: 0.5 }}>
                 <CategoryIcon sx={{ fontSize: 14 }} /> {ticket.category}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B", display: "flex", alignItems: "center", gap: 0.5 }}>
                 <PriorityIcon sx={{ fontSize: 14 }} /> {ticket.priority} priority
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={ticket.status.toUpperCase()} 
            color={ticket.status === 'open' ? 'success' : 'default'}
            size="small"
            sx={{ fontWeight: 800, fontSize: "10px", borderRadius: "8px" }}
          />
        </CardContent>
      </Card>

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 1, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {messages.map((msg, i) => {
          const isMe = msg.senderRole === "mr";
          return (
            <Box key={msg._id || i} sx={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
              <Box sx={{ maxWidth: "80%" }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                    bgcolor: isMe ? "#0D9488" : "white",
                    color: isMe ? "white" : "#1E293B",
                    border: isMe ? "none" : "1px solid #E2E8F0",
                    position: "relative"
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {msg.text}
                  </Typography>
                </Paper>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5, px: 1, justifyContent: isMe ? "flex-end" : "flex-start" }}>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "10px" }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  {isMe && (
                    <>
                      {msg.status === "seen" ? (
                        <Tooltip title="Seen">
                          <CheckCircleIcon sx={{ fontSize: 12, color: "#0D9488" }} />
                        </Tooltip>
                      ) : msg.status === "delivered" ? (
                        <Tooltip title="Delivered">
                          <CheckCircleIcon sx={{ fontSize: 12, color: "#94A3B8" }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Sent">
                          <CheckIcon sx={{ fontSize: 12, color: "#94A3B8" }} />
                        </Tooltip>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ pt: 2 }}>
        {ticket.status === 'closed' ? (
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#F1F5F9", borderRadius: "16px" }}>
            <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 600 }}>
              This ticket is closed. Please open a new ticket if you have further questions.
            </Typography>
          </Paper>
        ) : (
          <Paper 
            elevation={0}
            sx={{ 
              p: 1.5, 
              borderRadius: "20px", 
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "flex-end",
              gap: 1
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type your reply..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ px: 2, py: 1 }}
            />
            <IconButton 
              disabled={!inputText.trim()} 
              onClick={handleSendMessage}
              sx={{ 
                bgcolor: "#0D9488", 
                color: "white", 
                "&:hover": { bgcolor: "#0B7A6F" },
                "&.Mui-disabled": { bgcolor: "#F1F5F9", color: "#CBD5E1" },
                p: 1.5,
                borderRadius: "14px"
              }}
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
