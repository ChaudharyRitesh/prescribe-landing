"use client";

import { Box, Typography, Card, CardContent, Button, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import { AccountBalanceWallet, CallReceived, AccountBalance } from "@mui/icons-material";

import { useDashboard } from "@/app/mr/dashboard/context/DashboardContext";
import WithdrawalModal from "@/components/mr/dashboard/WithdrawalModal";
import { format } from "date-fns";
import { useState } from "react";

export default function EarningsPage() {
  const { userData, withdrawals, loading } = useDashboard();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  const wallet = userData?.wallet || { earnedCommission: 0, withdrawnAmount: 0, pendingWithdrawals: 0 };
  const availableBalance = wallet.earnedCommission - wallet.pendingWithdrawals;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
            My Earnings
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Track your commissions and manage payouts.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AccountBalanceWallet />}
          sx={{ px: 3, py: 1.2, boxShadow: "0px 4px 12px rgba(0, 218, 204, 0.3)" }}
          onClick={() => setIsWithdrawalModalOpen(true)}
        >
          Withdraw Funds
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" }, mb: 4 }}>
        <Card sx={{ flex: 1, bgcolor: "#051114", color: "white" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>Available Balance</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>₹{availableBalance.toLocaleString()}</Typography>
            <Typography variant="caption" sx={{ color: "#00DACC" }}>₹{wallet.pendingWithdrawals.toLocaleString()} pending clearance</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>Total Lifetime Earned</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>₹{wallet.earnedCommission.toLocaleString()}</Typography>
            <Typography variant="caption" sx={{ color: "success.main", fontWeight: 600 }}>Already Withdrawn: ₹{wallet.withdrawnAmount.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>Withdrawal History & Activity</Typography>
      <Card>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {withdrawals.length > 0 ? (
            withdrawals.map((withdrawal, idx) => (
              <Box key={withdrawal._id}>
                <ListItem sx={{ py: 2, px: 3 }}>
                  <ListItemAvatar>
                    <Avatar sx={{
                      bgcolor: withdrawal.status === "processed" ? "success.light" : (withdrawal.status === "rejected" ? "error.light" : "warning.light"),
                      color: withdrawal.status === "processed" ? "success.dark" : (withdrawal.status === "rejected" ? "error.dark" : "warning.dark")
                    }}>
                      <AccountBalance />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Withdrawal to {withdrawal.bankDetails?.bankName}</Typography>}
                    secondary={`${format(new Date(withdrawal.createdAt), "MMM d, yyyy")} • ${withdrawal.status.toUpperCase()}`}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    -₹{withdrawal.amount.toLocaleString()}
                  </Typography>
                </ListItem>
                {idx !== withdrawals.length - 1 && <Divider variant="inset" component="li" />}
              </Box>
            ))
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">No withdrawal history available.</Typography>
            </Box>
          )}
        </List>
      </Card>

      <WithdrawalModal
        open={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
      />
    </Box>
  );
}
