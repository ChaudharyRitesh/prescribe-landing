"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
  Menu,
} from "@mui/material";
import {
  Add as AddIcon,
  AttachMoney,
  Receipt,
  MoreVert,
  LocalTaxi,
  Restaurant,
  MoreHoriz,
  Edit,
  Delete,
  CheckCircle,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useDashboard } from "../context/DashboardContext";

export default function ExpensesPage() {
  const { expenses, expensesPagination, refreshExpenses, addExpense, updateExpense, deleteExpense, loading, pitches } = useDashboard();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "Travel",
    amount: "",
    description: "",
    pitchId: "",
    isAdvance: false,
  });

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  const handleOpen = (expense?: any) => {
    if (expense) {
      setEditingId(expense._id);
      const reverseMap: any = { "travel": "Travel", "food": "Meal", "lodging": "Lodging", "misc": "Other" };
      setFormData({
        date: new Date(expense.date).toISOString().split("T")[0],
        category: reverseMap[expense.type] || "Other",
        amount: expense.amount.toString(),
        description: expense.remarks || "",
        pitchId: expense.pitchId || "",
        isAdvance: expense.isAdvance || false,
      });
    } else {
      setEditingId(null);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        category: "Travel",
        amount: "",
        description: "",
        pitchId: "",
        isAdvance: false,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setReceiptFile(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, expense: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpense(expense);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExpense(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Travel": return <LocalTaxi sx={{ fontSize: 18 }} />;
      case "Meal": return <Restaurant sx={{ fontSize: 18 }} />;
      default: return <MoreHoriz sx={{ fontSize: 18 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "success";
      case "Approved": return "info";
      case "Pending": return "warning";
      case "Rejected": return "error";
      default: return "default";
    }
  };

  const handleSave = async () => {
    try {
      const categoryMap: any = {
        "Travel": "travel",
        "Meal": "food",
        "Lodging": "lodging",
        "Other": "misc"
      };

      const data = new FormData();
      data.append('type', categoryMap[formData.category] || "misc");
      data.append('amount', formData.amount);
      data.append('date', formData.date);
      data.append('remarks', formData.description);
      data.append('pitchId', formData.pitchId);
      data.append('isAdvance', formData.isAdvance.toString());
      
      if (receiptFile) {
        data.append('receipt', receiptFile);
      }

      if (editingId) {
        await updateExpense(editingId, data);
      } else {
        await addExpense(data);
      }
      handleClose();
    } catch (err) {
      console.error("Failed to save expense:", err);
    }
  };

  const handleDelete = async () => {
    if (selectedExpense) {
      if (window.confirm("Are you sure you want to delete this expense?")) {
        await deleteExpense(selectedExpense._id);
        handleMenuClose();
      }
    }
  };

  // Calculate totals from actual data
  const totalPending = expenses
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const approvedThisMonth = expenses
    .filter(e => {
      const d = new Date(e.date);
      const now = new Date();
      return e.status === 'approved' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const paidLifetime = expenses
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
            Expenses & Reimbursements
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Track your travel, meals, and miscellaneous field expenses.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ bgcolor: "#0D9488", "&:hover": { bgcolor: "#0f766e" } }}
        >
          Log Expense
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5, bgcolor: "rgba(13, 148, 136, 0.05)", border: "1px solid", borderColor: "rgba(13, 148, 136, 0.2)", boxShadow: "none" }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Pending</Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 800, color: "primary.main" }}>₹{totalPending.toFixed(2)}</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5, bgcolor: "rgba(59, 130, 246, 0.05)", border: "1px solid", borderColor: "rgba(59, 130, 246, 0.2)", boxShadow: "none" }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Approved This Month</Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 800, color: "#3B82F6" }}>₹{approvedThisMonth.toFixed(2)}</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5, bgcolor: "rgba(34, 197, 94, 0.05)", border: "1px solid", borderColor: "rgba(34, 197, 94, 0.2)", boxShadow: "none" }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Paid (Lifetime)</Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 800, color: "success.main" }}>₹{paidLifetime.toFixed(2)}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Expense List */}
      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "rgba(0,0,0,0.01)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => {
                // Map backend type back to UI categories
                const reverseMap: any = { "travel": "Travel", "food": "Meal", "lodging": "Lodging", "misc": "Other" };
                const displayCategory = reverseMap[expense.type] || "Other";
                const displayStatus = expense.status.charAt(0).toUpperCase() + expense.status.slice(1);

                return (
                  <TableRow key={expense._id} hover>
                    <TableCell variant="body">{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ p: 0.5, borderRadius: 1.5, bgcolor: "rgba(0,0,0,0.05)", display: "flex", color: "text.secondary" }}>
                          {getCategoryIcon(displayCategory)}
                        </Box>
                        <Typography variant="body2" fontWeight={500}>{displayCategory}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell variant="body">{expense.remarks}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>₹{expense.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={displayStatus}
                        size="small"
                        color={getStatusColor(displayStatus) as any}
                        sx={{ fontWeight: 700, fontSize: "10px", height: 20 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuOpen(e, expense)}
                        disabled={expense.status !== 'pending'}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {expensesPagination && expensesPagination.pages > 1 && (
          <Box sx={{ 
            p: 2, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "rgba(0,0,0,0.01)"
          }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Showing Page {expensesPagination.page} of {expensesPagination.pages} ({expensesPagination.total} total)
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                disabled={expensesPagination.page === 1}
                onClick={() => refreshExpenses(expensesPagination.page - 1)}
                sx={{ minWidth: 80, borderRadius: 2 }}
              >
                Previous
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={expensesPagination.page === expensesPagination.pages}
                onClick={() => refreshExpenses(expensesPagination.page + 1)}
                sx={{ minWidth: 80, borderRadius: 2 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleOpen(selectedExpense); handleMenuClose(); }}>
          <Edit fontSize="small" sx={{ mr: 1, color: 'blue' }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Log Expense Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Log Field Expense</DialogTitle>
        <DialogContent>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="Travel">Travel / Logistics</MenuItem>
                  <MenuItem value="Meal">Meals & Entertainment</MenuItem>
                  <MenuItem value="Lodging">Hotel / Lodging</MenuItem>
                  <MenuItem value="Other">Other Miscellaneous</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Log Against Pitch (Lead)"
                  value={formData.pitchId}
                  onChange={(e) => setFormData({ ...formData, pitchId: e.target.value })}
                >
                  <MenuItem value="">Select a Pitch...</MenuItem>
                  {pitches.map((pitch: any) => (
                    <MenuItem key={pitch._id} value={pitch._id}>
                      {pitch.hospitalName} ({pitch.status})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  p: 2, 
                  bgcolor: 'rgba(13, 148, 136, 0.05)', 
                  borderRadius: 2,
                  border: '1px solid rgba(13, 148, 136, 0.1)'
                }}>
                  <input
                    type="checkbox"
                    id="isAdvance"
                    checked={formData.isAdvance}
                    onChange={(e) => setFormData({ ...formData, isAdvance: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#0D9488' }}
                  />
                  <Typography 
                    component="label" 
                    htmlFor="isAdvance" 
                    variant="body2" 
                    sx={{ fontWeight: 600, color: '#0f766e', cursor: 'pointer' }}
                  >
                    Request this as an Advance Payment
                  </Typography>
                </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="e.g. Uber ride to conference"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                fullWidth
                component="label"
                variant="outlined"
                startIcon={receiptFile ? <CheckCircle color="success" /> : <Receipt />}
                sx={{ 
                  py: 1.5, 
                  borderStyle: "dashed", 
                  borderColor: receiptFile ? "success.main" : "rgba(0,0,0,0.2)",
                  color: receiptFile ? "success.main" : "inherit"
                }}
              >
                {receiptFile ? `Receipt: ${receiptFile.name}` : "Attach Receipt (Photo/PDF)"}
                <input 
                  type="file" 
                  hidden 
                  accept="image/*,application/pdf"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save Expense</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
