"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiClient } from "@/lib/api/axios";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  profileImage?: string;
  status: string;
}

interface DashboardStats {
  stats: {
    totalHospitals: number;
    conversions: number;
    estimatedCommission: number;
    activePitches: number;
  };
  recentActivity: any[];
  recentPitches: any[];
}

interface DashboardContextType {
  isNewPitchModalOpen: boolean;
  openNewPitchModal: () => void;
  closeNewPitchModal: () => void;
  userData: any | null;
  dashboardStats: DashboardStats | null;
  performanceData: any | null;
  pitches: any[];
  scheduleEvents: any[];
  bankAccount: any | null;
  withdrawals: any[];
  expenses: any[];
  loading: boolean;
  refreshUserData: () => Promise<void>;
  refreshDashboardStats: () => Promise<void>;
  refreshPitches: () => Promise<void>;
  refreshPerformance: () => Promise<void>;
  refreshSchedule: (start?: string, end?: string) => Promise<void>;
  refreshBankAccount: () => Promise<void>;
  refreshWithdrawals: () => Promise<void>;
  refreshExpenses: () => Promise<void>;
  tickets: any[];
  supportUnreadCount: number;
  refreshTickets: () => Promise<void>;
  addExpense: (data: any | FormData) => Promise<any>;
  updateExpense: (id: string, data: any | FormData) => Promise<any>;
  deleteExpense: (id: string) => Promise<any>;
  handleLogout: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isNewPitchModalOpen, setIsNewPitchModalOpen] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [pitches, setPitches] = useState<any[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([]);
  const [bankAccount, setBankAccount] = useState<any | null>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [supportUnreadCount, setSupportUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const openNewPitchModal = () => setIsNewPitchModalOpen(true);
  const closeNewPitchModal = () => {
    setIsNewPitchModalOpen(false);
    refreshDashboardStats();
    refreshPitches();
    refreshPerformance();
    refreshSchedule();
  };

  const refreshUserData = async () => {
    try {
      const response: any = await apiClient.get("/mr/profile");
      if (response.success) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR user data:", error);
    }
  };

  const refreshDashboardStats = async () => {
    try {
      const response: any = await apiClient.get("/mr/dashboard/stats");
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPitches = async () => {
    try {
      const response: any = await apiClient.get("/mr/pitches");
      if (response.success) {
        setPitches(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR pitches:", error);
    }
  };

  const refreshPerformance = async () => {
    try {
      const response: any = await apiClient.get("/mr/performance");
      if (response.success) {
        setPerformanceData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR performance stats:", error);
    }
  };

  const refreshSchedule = async (start?: string, end?: string) => {
    try {
      const url = start && end ? `/mr/schedule?start=${start}&end=${end}` : "/mr/schedule";
      const response: any = await apiClient.get(url);
      if (response.success) {
        setScheduleEvents(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR schedule:", error);
    }
  };

  const refreshWithdrawals = async () => {
    try {
      const response: any = await apiClient.get("/mr/withdrawals");
      if (response.success) {
        setWithdrawals(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR withdrawals:", error);
    }
  };

  const refreshBankAccount = async () => {
    try {
      const response: any = await apiClient.get("/mr/bank-account");
      if (response.success) {
        setBankAccount(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR bank account:", error);
    }
  };

  const refreshExpenses = async () => {
    try {
      const response: any = await apiClient.get("/mr/expenses");
      if (response.success) {
        setExpenses(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR expenses:", error);
    }
  };

  const refreshTickets = async () => {
    try {
      const response: any = await apiClient.get("/mr-chat/tickets");
      if (response.success) {
        setTickets(response.data);
        // Calculate unread (placeholder logic or specific API)
        const unreadRes: any = await apiClient.get("/mr-chat/unread-count");
        if (unreadRes.success) {
          setSupportUnreadCount(unreadRes.data.unreadCount);
        }
      }
    } catch (error) {
      console.error("Failed to fetch MR tickets:", error);
    }
  };

  const addExpense = async (data: any | FormData) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response: any = await apiClient.post("/mr/expenses", data, config);
    if (response.success) refreshExpenses();
    return response;
  };

  const updateExpense = async (id: string, data: any | FormData) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response: any = await apiClient.put(`/mr/expenses/${id}`, data, config);
    if (response.success) refreshExpenses();
    return response;
  };

  const deleteExpense = async (id: string) => {
    const response: any = await apiClient.delete(`/mr/expenses/${id}`);
    if (response.success) refreshExpenses();
    return response;
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem("mr_token");
      localStorage.removeItem("mr_user");
      document.cookie = "mr_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      window.location.href = "/mr/login";
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshUserData();
      await Promise.all([
        refreshDashboardStats(),
        refreshPitches(),
        refreshPerformance(),
        refreshSchedule(),
        refreshBankAccount(),
        refreshWithdrawals(),
        refreshExpenses(),
        refreshTickets()
      ]);
    };
    init();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        isNewPitchModalOpen,
        openNewPitchModal,
        closeNewPitchModal,
        userData,
        dashboardStats,
        performanceData,
        pitches,
        scheduleEvents,
        bankAccount,
        withdrawals,
        expenses,
        loading,
        refreshUserData,
        refreshDashboardStats,
        refreshPitches,
        refreshPerformance,
        refreshSchedule,
        refreshBankAccount,
        refreshWithdrawals,
        refreshExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        tickets,
        supportUnreadCount,
        refreshTickets,
        handleLogout
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
