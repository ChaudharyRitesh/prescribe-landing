"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  X, 
  Send, 
  MessageCircle, 
  Check, 
  CheckCheck, 
  Clock,
  HeadphonesIcon,
  Minimize2
} from "lucide-react";
import { socketService } from "@/lib/socket";
import { apiClient as axios } from "@/lib/api/axios";
import { useDashboard } from "@/app/mr/dashboard/context/DashboardContext";

interface Message {
  _id: string;
  mrId: string;
  senderId: string;
  senderRole: "mr" | "super_admin";
  text: string;
  status: "sent" | "delivered" | "seen";
  createdAt: string;
  seenAt?: string;
  deliveredAt?: string;
}

export default function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  const { userData } = useDashboard();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (unreadCount > 0) {
        markAllAsSeen();
      }
    }
  }, [messages, isOpen]);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get("/mr-chat/history");
      if (res.data.success) {
        setMessages(prev => {
          const messageMap = new Map(prev.map(m => [m._id, m]));
          (res.data.data as Message[]).forEach(msg => {
            if (msg._id) messageMap.set(msg._id, msg);
          });
          return Array.from(messageMap.values()).sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
      }
    } catch (err) {
      console.error("Chat history error:", err);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await axios.get("/mr-chat/unread-count");
      if (res.data.success) {
        setUnreadCount(res.data.data.unreadCount);
      }
    } catch (err) {
      console.error("Unread count error:", err);
    }
  }, []);

  const markAllAsSeen = async () => {
    try {
      if (!userData?._id) return;
      await axios.post("/mr-chat/mark-seen", { mrId: userData._id });
      setUnreadCount(0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userData?._id) return;

    const socket = socketService.connect();
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socketService.joinChat(userData._id);
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("new_mr_message", (msg: Message) => {
      setMessages(prev => {
        const messageMap = new Map(prev.map(m => [m._id, m]));
        messageMap.set(msg._id, msg);
        return Array.from(messageMap.values()).sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      if (isOpen) {
        socket.emit("mr_message_seen", { 
          messageId: msg._id, 
          mrId: userData._id, 
          seenByRole: "mr" 
        });
      } else {
        setUnreadCount(prev => prev + 1);
      }
    });

    socket.on("message_sent", (msg: Message) => {
      setMessages(prev => {
        const messageMap = new Map(prev.map(m => [m._id, m]));
        messageMap.set(msg._id, msg);
        return Array.from(messageMap.values()).sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    });

    socket.on("message_delivered", ({ messageId, deliveredAt }: any) => {
      setMessages(prev => {
        const messageMap = new Map(prev.map(m => [m._id, m]));
        const msg = messageMap.get(messageId);
        if (msg) {
          messageMap.set(messageId, { ...msg, status: "delivered", deliveredAt });
        }
        return Array.from(messageMap.values()).sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    });

    socket.on("message_seen_update", ({ messageId, seenAt }: any) => {
      setMessages(prev => {
        const messageMap = new Map(prev.map(m => [m._id?.toString(), m]));
        const msg = messageMap.get(messageId?.toString());
        if (msg) {
          messageMap.set(messageId?.toString(), { ...msg, status: "seen", seenAt });
        }
        return Array.from(messageMap.values()).sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    });

    fetchHistory();
    fetchUnreadCount();

    return () => {
      socket.off("new_mr_message");
      socket.off("message_sent");
      socket.off("message_delivered");
      socket.off("message_seen_update");
    };
  }, [userData?._id, fetchHistory, fetchUnreadCount]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !userData?._id || !socketRef.current) return;

    const msgData = {
      mrId: userData._id,
      senderId: userData._id,
      senderRole: "mr",
      receiverId: "super_admin_placeholder", // Backend handles finding active admin or routing to global
      text: inputText
    };

    socketRef.current.emit("mr_send_message", msgData);
    setInputText("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return <Check className="w-3 h-3 text-white/60" />;
      case "delivered": return <CheckCheck className="w-3 h-3 text-white/60" />;
      case "seen": return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default: return <Clock className="w-3 h-3 text-white/40" />;
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40 ${
          unreadCount > 0 ? "bg-red-500 animate-bounce" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-500">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Drawer */}
      <div 
        className={`fixed bottom-4 right-4 w-[calc(100%-32px)] sm:w-[500px] h-[600px] bg-white shadow-[-10px_10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 ease-[cubic-bezier(0.4,0.2,0,1)] z-50 rounded-3xl border border-slate-100 overflow-hidden ${
          isOpen 
            ? "opacity-100 scale-100 [clip-path:circle(150%_at_calc(100%-36px)_calc(100%-36px))]" 
            : "opacity-0 scale-0 [clip-path:circle(0px_at_calc(100%-36px)_calc(100%-36px))] pointer-events-none"
        }`}
        style={{ transformOrigin: "calc(100% - 36px) calc(100% - 36px)" }}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <HeadphonesIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Operation Support</h3>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400" : "bg-red-400"}`}></span>
                <span className="text-[10px] font-medium opacity-80">{isConnected ? "Online" : "Connecting..."}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Minimize2 className="w-5 h-5" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Layout */}
        <div className="flex flex-col h-[calc(100%-80px)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Hot Query Support</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Send a message to our operations team for any field assistance.</p>
                </div>
              </div>
            ) : (() => {
              const seenIds = new Set<string>();
              return messages.map((msg, i) => {
                const msgId = msg._id?.toString();
                if (msgId && seenIds.has(msgId)) return null;
                if (msgId) seenIds.add(msgId);
                
                const isMe = msg.senderRole === "mr";
                return (
                  <div key={msgId || `temp-${i}`} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] space-y-1`}>
                      <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                        isMe 
                          ? "bg-blue-600 text-white rounded-tr-none" 
                          : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`flex items-center gap-1.5 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-200 focus-within:border-blue-500/50 transition-all shadow-sm">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your query..."
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm px-3 py-2 min-h-[44px]"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md active:scale-95 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
