"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Tabs,
  Tab,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { CreditCard, CheckCircle, AlertCircle, FileText } from "lucide-react";

const useOutstandingBillsQuery = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData([
        {
          id: "inv_1",
          date: new Date(Date.now() - 2 * 86400000),
          facility: "Kaero Multispeciality Clinic",
          description: "OPD Consultation - Dr. Meera Sharma",
          amount: 850,
          currency: "INR",
          status: "Unpaid"
        }
      ]);
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  return { data, isLoading };
};

const usePaidBillsQuery = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData([
        {
          id: "inv_2",
          date: new Date(Date.now() - 10 * 86400000),
          facility: "Kaero Multispeciality Clinic",
          description: "OPD Consultation - Dr. Sanjay Gupta",
          amount: 1200,
          currency: "INR",
          status: "Paid"
        }
      ]);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return { data, isLoading };
};

export default function BillsPage() {
  const [tab, setTab] = useState("outstanding");
  const { data: outstanding, isLoading: outLoading } = useOutstandingBillsQuery();
  const { data: paid, isLoading: paidLoading } = usePaidBillsQuery();

  const currentData = tab === "outstanding" ? outstanding : paid;
  const isLoading = tab === "outstanding" ? outLoading : paidLoading;

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3, lg: 4 }, py: { xs: 3, md: 5 } }}>
      <Typography variant="h4" component="h1" fontWeight="700" color="#172B3A" gutterBottom>
        Bills & Payments
      </Typography>
      <Typography variant="body1" color="#4E6170" sx={{ mb: 4 }}>
        View and manage your medical invoices.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)}
          sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "1rem" } }}
        >
          <Tab label="Outstanding" value="outstanding" />
          <Tab label="Paid" value="paid" />
        </Tabs>
      </Box>

      {isLoading ? (
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={140} sx={{ borderRadius: "16px" }} />
          <Skeleton variant="rectangular" height={140} sx={{ borderRadius: "16px" }} />
        </Stack>
      ) : currentData.length === 0 ? (
        <Alert severity="success" icon={<CheckCircle />} sx={{ borderRadius: "12px", border: "1px solid #18785A", bgcolor: "#E6F4EA", color: "#18785A" }}>
          No {tab} bills found.
        </Alert>
      ) : (
        <Stack spacing={3}>
          {currentData.map((inv) => (
            <Card key={inv.id} sx={{ borderRadius: "16px", border: "1px solid #DFE6EB", boxShadow: "none" }}>
               <Box sx={{ bgcolor: tab === "outstanding" ? "#FEF2F2" : "#F8FAFC", px: 3, py: 1.5, display: "flex", alignItems: "center", gap: 1, borderBottom: "1px solid #DFE6EB" }}>
                 {tab === "outstanding" ? <AlertCircle size={18} color="#B84248" /> : <CheckCircle size={18} color="#18785A" />}
                 <Typography variant="subtitle2" color={tab === "outstanding" ? "#B84248" : "#18785A"} fontWeight="700">
                   {inv.status.toUpperCase()}
                 </Typography>
               </Box>
               <CardContent sx={{ p: 3, pb: "24px !important" }}>
                 <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={3}>
                   <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
                     <Box sx={{ bgcolor: "#EAF6F7", p: 1.5, borderRadius: "10px", color: "#087F8C", display: { xs: "none", sm: "block" } }}>
                       <FileText size={24} />
                     </Box>
                     <Box>
                       <Typography variant="h6" fontWeight="700" color="#172B3A" gutterBottom>{inv.description}</Typography>
                       <Typography variant="body2" color="#4E6170">{inv.facility}</Typography>
                       <Typography variant="caption" color="#71808C" sx={{ mt: 0.5, display: "block" }}>
                         Issued: {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(inv.date)}
                       </Typography>
                     </Box>
                   </Box>
                   <Box sx={{ display: "flex", flexDirection: { xs: "row", md: "column" }, alignItems: { xs: "center", md: "flex-end" }, gap: { xs: 3, md: 1 }, width: { xs: "100%", md: "auto" }, justifyContent: "space-between" }}>
                     <Typography variant="h5" fontWeight="700" color={tab === "outstanding" ? "#B84248" : "#172B3A"}>
                       {new Intl.NumberFormat("en-IN", { style: "currency", currency: inv.currency }).format(inv.amount)}
                     </Typography>
                     <Stack direction="row" spacing={1}>
                       {tab === "outstanding" ? (
                         <>
                           <Button variant="outlined" size="small" sx={{ textTransform: "none", color: "#172B3A", borderColor: "#DFE6EB", fontWeight: 600 }}>Download</Button>
                           <Button variant="contained" size="small" disabled sx={{ textTransform: "none", fontWeight: 600 }}>Pay Now</Button>
                         </>
                       ) : (
                         <Button variant="outlined" size="small" sx={{ textTransform: "none", color: "#087F8C", borderColor: "#DFE6EB", fontWeight: 600 }}>Download Receipt</Button>
                       )}
                     </Stack>
                   </Box>
                 </Stack>
               </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
