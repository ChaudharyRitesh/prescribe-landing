"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  InputAdornment,
  Divider,
} from "@mui/material";
import { AccountBalance, AccountBalanceWallet, Payment } from "@mui/icons-material";
import { useDashboard } from "@/app/partner/dashboard/context/DashboardContext";
import { apiClient } from "@/lib/api/axios";

export default function WithdrawalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { userData, bankAccount, refreshWithdrawals, refreshUserData, dashboardStats } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  const availableBalance = (dashboardStats as any)?.wallet?.available || 0;

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amount > availableBalance) {
      setError("Insufficient balance");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response: any = await apiClient.post("/mr/withdrawals", { amount });
      if (response.success) {
        setSuccess(true);
        await refreshWithdrawals();
        await refreshUserData();
      }
    } catch (err: any) {
      setError(err.message || "Withdrawal request failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <Box sx={{ p: 2, bgcolor: "success.light", color: "success.main", borderRadius: "50%", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
            <AccountBalanceWallet fontSize="large" />
          </Box>
          <Typography variant="h6" gutterBottom>Request Submitted!</Typography>
          <Typography variant="body2" color="text.secondary">
            Your withdrawal request of ₹{withdrawalAmount} has been received and is being processed by the Super Admin.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button variant="contained" onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Payment color="primary" />
        Withdraw Funds
      </DialogTitle>
      
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {!bankAccount ? (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <Box sx={{ p: 2, bgcolor: "warning.light", color: "warning.dark", borderRadius: "50%", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
              <AccountBalance fontSize="large" />
            </Box>
            <Typography variant="h6" gutterBottom>Bank Account Required</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You haven't configured your payout bank account yet. Please setup your bank details in the Settings page to withdraw funds.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => {
                onClose();
                window.location.href = "/partner/dashboard/settings";
              }}
              sx={{ borderRadius: 2 }}
            >
              Go to Settings
            </Button>
          </Box>
        ) : (
          <Box sx={{ py: 1 }}>
            <Box sx={{ bgcolor: "rgba(0, 218, 204, 0.05)", p: 3, borderRadius: 3, textAlign: "center", mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                Available for Withdrawal
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main", mt: 0.5, mb: 1 }}>
                ₹{availableBalance.toLocaleString()}
              </Typography>
              
              <Divider sx={{ my: 1.5, opacity: 0.5 }} />
              
              <Box sx={{ display: "flex", justifyContent: "space-between", px: 1 }}>
                <Typography variant="caption" color="text.secondary">Total Earned:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>₹{(dashboardStats as any)?.wallet?.totalEarned?.toLocaleString() || 0}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", px: 1 }}>
                <Typography variant="caption" color="text.secondary">Advances Taken:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "error.main" }}>- ₹{(dashboardStats as any)?.wallet?.totalAdvances?.toLocaleString() || 0}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", px: 1 }}>
                <Typography variant="caption" color="text.secondary">Already Pending:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>- ₹{(dashboardStats as any)?.wallet?.pending?.toLocaleString() || 0}</Typography>
              </Box>
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Withdrawal Amount</Typography>
            <TextField
              fullWidth
              placeholder="Enter amount"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              sx={{ mb: 3 }}
            />

            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Recipient Bank</Typography>
                <Typography variant="caption" color="text.secondary">
                  {bankAccount?.bankName} • Account ending in {bankAccount?.accountNumber?.slice(-4)}
                </Typography>
              </Box>
              <Button 
                size="small" 
                variant="text" 
                onClick={() => {
                  onClose();
                  window.location.href = "/partner/dashboard/settings";
                }}
              >
                Change
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        {bankAccount && (
          <Button
            variant="contained"
            onClick={handleWithdraw}
            disabled={loading}
            startIcon={loading && <CircularProgress size={16} />}
            sx={{ minWidth: 120 }}
          >
            {loading ? "Processing..." : "Request Withdrawal"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
