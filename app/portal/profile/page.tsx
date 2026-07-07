"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { User, Phone, Mail, ShieldCheck, Link2, ShieldAlert } from "lucide-react";

const usePatientProfileQuery = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData({
        name: "Aarav Sharma",
        dob: "1990-05-15",
        gender: "Male",
        bloodGroup: "O+",
        phone: "+91 98****3210",
        phoneVerified: true,
        email: "a***v.s@example.com",
        emailVerified: false,
        abha: {
          linked: true,
          id: "14-xxxx-xxxx-xxxx",
          lastSync: new Date(Date.now() - 3600000)
        }
      });
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return { data, isLoading };
};

export default function ProfilePage() {
  const { data, isLoading } = usePatientProfileQuery();

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3, lg: 4 }, py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "16px" }} />
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "16px" }} />
        </Stack>
      </Container>
    );
  }

  if (!data) return null;

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3, lg: 4 }, py: { xs: 3, md: 5 } }}>
      <Typography variant="h4" component="h1" fontWeight="700" color="#172B3A" gutterBottom>
        Patient Profile
      </Typography>
      <Typography variant="body1" color="#4E6170" sx={{ mb: 4 }}>
        Manage your personal information and health accounts.
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(12, 1fr)" }, gap: 4 }}>
        
        {/* Main Details */}
        <Box sx={{ gridColumn: { xs: "span 1", lg: "span 8" } }}>
          <Card sx={{ borderRadius: "16px", border: "1px solid #DFE6EB", boxShadow: "none", mb: 4 }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #DFE6EB" }}>
              <Typography variant="h6" fontWeight="700" color="#172B3A">Personal Details</Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, p: 3, gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="#71808C" display="block">Full Name</Typography>
                  <Typography variant="body1" color="#172B3A" fontWeight="600">{data.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="#71808C" display="block">Date of Birth</Typography>
                  <Typography variant="body1" color="#172B3A" fontWeight="600">
                    {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(data.dob))}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="#71808C" display="block">Gender</Typography>
                  <Typography variant="body1" color="#172B3A" fontWeight="600">{data.gender}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="#71808C" display="block">Blood Group</Typography>
                  <Typography variant="body1" color="#172B3A" fontWeight="600">{data.bloodGroup}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "16px", border: "1px solid #DFE6EB", boxShadow: "none" }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #DFE6EB" }}>
              <Typography variant="h6" fontWeight="700" color="#172B3A">Contact Information</Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: "1px solid #DFE6EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box sx={{ bgcolor: "#F5F7FA", p: 1, borderRadius: "8px", color: "#4E6170" }}><Phone size={20} /></Box>
                  <Box>
                    <Typography variant="body1" color="#172B3A" fontWeight="600">{data.phone}</Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 0.5, alignItems: "center" }}>
                      {data.phoneVerified ? (
                        <Typography variant="caption" color="#18785A" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><ShieldCheck size={14} /> Verified</Typography>
                      ) : (
                         <Typography variant="caption" color="#B84248" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><ShieldAlert size={14} /> Unverified</Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Button variant="outlined" size="small" sx={{ textTransform: "none", color: "#172B3A", borderColor: "#DFE6EB" }}>Update</Button>
              </Box>
              <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box sx={{ bgcolor: "#F5F7FA", p: 1, borderRadius: "8px", color: "#4E6170" }}><Mail size={20} /></Box>
                  <Box>
                    <Typography variant="body1" color="#172B3A" fontWeight="600">{data.email}</Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 0.5, alignItems: "center" }}>
                      {data.emailVerified ? (
                        <Typography variant="caption" color="#18785A" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><ShieldCheck size={14} /> Verified</Typography>
                      ) : (
                         <Typography variant="caption" color="#B84248" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><ShieldAlert size={14} /> Unverified</Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Button variant="outlined" size="small" sx={{ textTransform: "none", color: "#172B3A", borderColor: "#DFE6EB" }}>Update</Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Rail */}
        <Box sx={{ gridColumn: { xs: "span 1", lg: "span 4" } }}>
          <Card sx={{ borderRadius: "16px", border: "1px solid #DFE6EB", boxShadow: "none", mb: 4 }}>
             <Box sx={{ p: 3, borderBottom: "1px solid #DFE6EB", display: "flex", gap: 2, alignItems: "center" }}>
               <Link2 size={24} color="#087F8C" />
               <Typography variant="h6" fontWeight="700" color="#172B3A">Health Accounts</Typography>
             </Box>
             <CardContent sx={{ p: 3 }}>
               <Box sx={{ mb: 2 }}>
                 <Typography variant="subtitle2" fontWeight="700" color="#172B3A" gutterBottom>ABHA Network</Typography>
                 {data.abha.linked ? (
                   <Box>
                     <Chip label="Linked & Active" size="small" sx={{ bgcolor: "#EAF6F7", color: "#087F8C", fontWeight: 600, mb: 1 }} />
                     <Typography variant="body2" color="#4E6170">Your Ayushman Bharat Health Account is synchronized.</Typography>
                     <Typography variant="caption" color="#71808C" sx={{ mt: 1, display: "block" }}>
                       Last Sync: {new Intl.DateTimeFormat("en-IN", { timeStyle: "short", dateStyle: "short" }).format(data.abha.lastSync)}
                     </Typography>
                   </Box>
                 ) : (
                   <Box>
                     <Typography variant="body2" color="#4E6170" gutterBottom>Link your ABHA to fetch records from other providers.</Typography>
                     <Button variant="contained" size="small" sx={{ textTransform: "none", bgcolor: "#087F8C", fontWeight: 600, mt: 1 }}>Link ABHA</Button>
                   </Box>
                 )}
               </Box>
             </CardContent>
          </Card>

          <Card sx={{ borderRadius: "16px", border: "1px solid #DFE6EB", boxShadow: "none" }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #DFE6EB" }}>
               <Typography variant="h6" fontWeight="700" color="#172B3A">Privacy & Consent</Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="#4E6170" gutterBottom>
                Review and manage your data sharing preferences and connected facilities.
              </Typography>
              <Button variant="outlined" fullWidth sx={{ textTransform: "none", color: "#172B3A", borderColor: "#DFE6EB", fontWeight: 600, mt: 2 }}>
                Manage Consent
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
