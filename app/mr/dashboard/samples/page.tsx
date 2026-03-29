"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Inventory,
  RemoveCircleOutline,
  AddCircleOutline,
  LocalHospital,
  History,
  Warning,
  CheckCircle,
} from "@mui/icons-material";

const mockInventory = [
  { id: 1, name: "Kaero OS Demo Kits", sku: "KOS-DK-01", stock: 12, minStock: 5, category: "Software Kits" },
  { id: 2, name: "HealthConnect Tablets", sku: "HC-TAB-05", stock: 3, minStock: 4, category: "Hardware" },
  { id: 3, name: "AI Diagnostic Sensors", sku: "AI-SEN-22", stock: 25, minStock: 10, category: "Peripherals" },
  { id: 4, name: "Patient Portal Vouchers", sku: "PP-VOU-99", stock: 50, minStock: 20, category: "Digital" },
];

const mockLogs = [
  { id: 1, date: "2026-03-24", product: "Kaero OS Demo Kit", hospital: "City General Hospital", quantity: 1, type: "Disbursement" },
  { id: 2, date: "2026-03-22", product: "AI Diagnostic Sensors", hospital: "Sunshine Clinic", quantity: 5, type: "Disbursement" },
  { id: 3, date: "2026-03-20", product: "HealthConnect Tablets", hospital: "Central Depot", quantity: 10, type: "Inward" },
];

export default function SamplesPage() {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleOpenDisburse = (item: any) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
            Sample & Asset Inventory
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Monitor your physical stock and log sample disbursements to healthcare providers.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          sx={{ bgcolor: "#0D9488", "&:hover": { bgcolor: "#0f766e" } }}
        >
          Request Refill
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Inventory Table */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            <Box sx={{ p: 2.5, bgcolor: "rgba(0,0,0,0.01)", borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1.5 }}>
              <Inventory sx={{ color: "primary.main" }} />
              <Typography variant="h6" fontWeight="700">Stock Levels</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>In-Hand</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockInventory.map((item) => {
                    const isLow = item.stock <= item.minStock;
                    return (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.sku}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={item.category} size="small" variant="outlined" sx={{ fontSize: "10px", height: 20 }} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ width: 100 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                              <Typography variant="caption" fontWeight="700">{item.stock}</Typography>
                              <Typography variant="caption" color="text.secondary">/ {item.minStock * 4}</Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={(item.stock / (item.minStock * 4)) * 100} 
                              color={isLow ? "warning" : "primary"}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          {isLow ? (
                            <Chip icon={<Warning sx={{ fontSize: "14px !important" }} />} label="Low Stock" size="small" color="warning" sx={{ fontWeight: 700, fontSize: "10px" }} />
                          ) : (
                            <Chip icon={<CheckCircle sx={{ fontSize: "14px !important" }} />} label="Adequate" size="small" color="success" sx={{ fontWeight: 700, fontSize: "10px" }} />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Button 
                            variant="text" 
                            size="small" 
                            startIcon={<RemoveCircleOutline />} 
                            onClick={() => handleOpenDisburse(item)}
                            sx={{ fontWeight: 600 }}
                          >
                            Disburse
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Recent Activity Logs */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1.5 }}>
              <History sx={{ color: "text.secondary" }} />
              <Typography variant="h6" fontWeight="700">Recent Logs</Typography>
            </Box>
            <Box sx={{ p: 0 }}>
              {mockLogs.map((log, idx) => (
                <Box 
                  key={idx} 
                  sx={{ 
                    p: 2, 
                    borderBottom: idx !== mockLogs.length - 1 ? "1px solid" : "none", 
                    borderColor: "divider",
                    display: "flex",
                    gap: 2
                  }}
                >
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: log.type === "Inward" ? "rgba(34, 197, 94, 0.1)" : "rgba(13, 148, 136, 0.1)", color: log.type === "Inward" ? "success.main" : "primary.main", height: "fit-content" }}>
                    {log.type === "Inward" ? <AddCircleOutline fontSize="small" /> : <LocalHospital fontSize="small" />}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="700">{log.product}</Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                      {log.type === "Inward" ? "Replenished from " : "Given to "}{log.hospital}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "text.disabled", mt: 0.5 }}>
                      {log.date} • {log.quantity} units
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Disburse Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Log Displacement</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Recording {selectedItem?.name} disbursement.
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Hospital / Clinic"
                placeholder="Select from your hospitals..."
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LocalHospital fontSize="small" /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                defaultValue={1}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Units</InputAdornment>,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notes"
                placeholder="Reason for sample provision..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleClose}>Confirm Log</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
