"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Avatar,
  IconButton,
  CircularProgress,
  Tab,
  Tabs,
  Paper,
  Stack
} from "@mui/material";
import {
  CameraAlt,
  Person,
  Security,
  Notifications,
  Payment,
  Language,
  Save,
  CloudUpload,
  VerifiedUser,
  NavigateNext
} from "@mui/icons-material";
import { apiClient } from "@/lib/api/axios";
import { useToast } from "@/hooks/use-toast";
import { useDashboard } from "../context/DashboardContext";
import { toast as sonnerToast } from "sonner";

export default function SettingsPage() {
  const { toast } = useToast();
  const { refreshUserData, userData, bankAccount, refreshBankAccount, loading: contextLoading } = useDashboard();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [bankForm, setBankForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    accountType: "Savings",
  });

  useEffect(() => {
    if (bankAccount) {
      setBankForm({
        accountHolderName: bankAccount.accountHolderName || "",
        accountNumber: bankAccount.accountNumber || "",
        ifscCode: bankAccount.ifscCode || "",
        bankName: bankAccount.bankName || "",
        accountType: bankAccount.accountType || "Savings",
      });
    }
  }, [bankAccount]);

  const handleSaveBank = async () => {
    setSavingBank(true);
    try {
      const response: any = await apiClient.post("/mr/bank-account", bankForm);
      if (response.success) {
        await refreshBankAccount();
        sonnerToast.success("Bank details updated successfully!");
      }
    } catch (error: any) {
      sonnerToast.error(error.message || "Failed to save bank details.");
    } finally {
      setSavingBank(false);
    }
  };

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    targetArea: "",
    bio: "",
    profileImage: "",
    specialization: "",
    employeeId: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    }
  });

  const loadProfile = async () => {
    try {
      const response: any = await apiClient.get("/mr/profile");
      if (response.success) {
        setProfile({
          ...response.data,
          address: response.data.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
          }
        });
      }
    } catch (error: any) {
      sonnerToast.error("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id.includes("address.")) {
      const field = id.split(".")[1];
      setProfile({
        ...profile,
        address: { ...profile.address, [field]: value }
      });
    } else {
      setProfile({ ...profile, [id]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response: any = await apiClient.post("/mr/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.success) {
        setProfile({ ...profile, profileImage: response.data.profileImage });
        await refreshUserData();
        sonnerToast.success("Profile image updated!");
      }
    } catch (error: any) {
      sonnerToast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    // Basic phone validation
    const digitsOnly = profile.phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 8) {
      sonnerToast.error("Phone number must be at least 8 digits including country code.");
      setSaving(false);
      return;
    }

    setSaving(true);
    try {
      const response: any = await apiClient.put("/mr/profile", profile);
      if (response.success) {
        await refreshUserData();
        sonnerToast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      sonnerToast.error(error.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || contextLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress thickness={5} size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "secondary.main", letterSpacing: '-0.5px' }}>
          Settings
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Manage your account preferences and professional profile.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Tabs
              orientation="vertical"
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{
                mb: 2,
                '& .MuiTabs-indicator': { left: 0, width: 3, borderRadius: '0 4px 4px 0' },
                '& .MuiTab-root': {
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  py: 1.5,
                  px: 2,
                  minHeight: 48,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  mb: 0.5,
                  '&.Mui-selected': { 
                    color: 'primary.main', 
                    bgcolor: 'rgba(13, 148, 136, 0.08)',
                    fontWeight: 600
                  },
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }
                }
              }}
            >
              <Tab icon={<Person sx={{ fontSize: 20, mr: 1.5 }} />} iconPosition="start" label="Personal" />
              <Tab icon={<Security sx={{ fontSize: 20, mr: 1.5 }} />} iconPosition="start" label="Security" />
              <Tab icon={<Notifications sx={{ fontSize: 20, mr: 1.5 }} />} iconPosition="start" label="Notifications" />
              <Tab icon={<Payment sx={{ fontSize: 20, mr: 1.5 }} />} iconPosition="start" label="Billing" />
              <Tab icon={<Language sx={{ fontSize: 20, mr: 1.5 }} />} iconPosition="start" label="Preferences" />
            </Tabs>

            <Box sx={{ 
              p: 2, 
              borderRadius: 3, 
              bgcolor: 'rgba(13, 148, 136, 0.05)', 
              border: '1px solid rgba(13, 148, 136, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <VerifiedUser sx={{ color: 'primary.main', fontSize: 20 }} />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1 }}>Verified</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>Full Access Active</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Content Area */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Tab 0: Personal Refined */}
          {activeTab === 0 && (
            <Box className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Integrated Profile Header */}
              <Box sx={{ 
                mb: 3, 
                p: 3, 
                borderRadius: 4, 
                background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.05) 0%, rgba(20, 184, 166, 0.02) 100%)',
                border: '1px solid rgba(13, 148, 136, 0.1)',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 3,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Subtle Background Accent */}
                <Box sx={{ 
                  position: 'absolute', 
                  right: -50, 
                  top: -50, 
                  width: 150, 
                  height: 150, 
                  bgcolor: 'primary.main', 
                  opacity: 0.03, 
                  borderRadius: '50%' 
                }} />

                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={profile.profileImage}
                    sx={{
                      width: 90,
                      height: 90,
                      border: '3px solid white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      bgcolor: 'secondary.main',
                      fontSize: '2rem'
                    }}
                  >
                    {profile.name.charAt(0)}
                  </Avatar>
                  <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                  <IconButton
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'white',
                      boxShadow: 2,
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    {uploading ? <CircularProgress size={14} /> : <CameraAlt sx={{ fontSize: 14 }} color="primary" />}
                  </IconButton>
                </Box>

                <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Stack direction="row" alignItems="center" spacing={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{profile.name}</Typography>
                    <Box sx={{ px: 1, py: 0.25, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
                      <Typography variant="caption" fontWeight="800" sx={{ fontSize: '9px', textTransform: 'uppercase' }}>PRO</Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1.5 }} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>Account Status</Typography>
                      <Typography variant="caption" fontWeight="700" color="success.main">Active • Fully Verified</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderStyle: 'dashed' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>Member Since</Typography>
                      <Typography variant="caption" fontWeight="700">March 2024</Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Button variant="outlined" size="small" sx={{ borderRadius: 2, borderColor: 'rgba(0,0,0,0.1)', color: 'text.secondary' }}>View Public Profile</Button>
                </Box>
              </Box>

              {/* Form Sections */}
              <Stack spacing={3}>
                {/* Section 1: Public Identity */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>Public Identity</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Basic account information visible across the platform.</Typography>
                  <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth size="small" id="name" label="Full Name" value={profile.name} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth size="small" id="phone" label="Phone" value={profile.phone} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField fullWidth size="small" id="bio" label="Professional Headline" placeholder="Briefly describe your experience..." multiline rows={2} value={profile.bio} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>

                {/* Section 2: Professional Logistics */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>Operations & Territory</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Logistical details for territory management and hub assignments.</Typography>
                  <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth size="small" id="companyName" label="Agency / Organization" value={profile.companyName} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth size="small" id="specialization" label="Clinical Focus" value={profile.specialization} onChange={handleChange} placeholder="e.g., Cardiology" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                          <TextField fullWidth size="small" id="address.street" label="Operational Address" value={profile.address.street} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField fullWidth size="small" id="targetArea" label="Assigned Hub" value={profile.targetArea} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(13, 148, 136, 0.02)' } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField fullWidth size="small" id="address.city" label="City" value={profile.address.city} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField fullWidth size="small" id="address.state" label="State" value={profile.address.state} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField fullWidth size="small" id="address.zipCode" label="Post Code" value={profile.address.zipCode} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>

              <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="text" sx={{ borderRadius: 2, fontWeight: 700, px: 3, color: 'text.secondary' }}>Reset Changes</Button>
                <Button variant="contained" color="primary" disabled={saving} onClick={handleSave} sx={{ px: 4, py: 1, borderRadius: 2, fontWeight: 700 }}>
                  {saving ? "Saving..." : "Update Account"}
                </Button>
              </Box>
            </Box>
          )}

          {/* Tab 1: Security & Login */}
          {activeTab === 1 && (
            <Box className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Security & Password</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                    Protect your account by using a strong password.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField fullWidth size="small" label="Current Password" type="password" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth size="small" label="New Password" type="password" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth size="small" label="Confirm Password" type="password" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button variant="contained" color="secondary" size="small" sx={{ borderRadius: 2, px: 3 }}>Update Password</Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Two-Factor Auth</Typography>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" fontWeight="600">SMS Verification</Typography>
                        <Typography variant="caption" color="text.secondary">Secure login via mobile code.</Typography>
                      </Box>
                      <Switch size="small" defaultChecked />
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" fontWeight="600">Authenticator App</Typography>
                        <Typography variant="caption" color="text.secondary">Google Authenticator or Authy.</Typography>
                      </Box>
                      <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}>Setup</Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Recent Sessions</Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Person sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Windows PC - Chrome</Typography>
                          <Typography variant="caption" color="text.secondary">Current session • active</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid rgba(0,0,0,0.05)', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Person sx={{ fontSize: 18, color: 'text.disabled' }} />
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>iPhone 15 Pro</Typography>
                          <Typography variant="caption" color="text.secondary">Mumbai • 2h ago</Typography>
                        </Box>
                      </Box>
                      <Button size="small" color="error" sx={{ fontSize: '10px' }}>Log Out</Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Tab 2: Notifications */}
          {activeTab === 2 && (
            <Box className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Notification Hub</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                    Control how you receive alerts and updates.
                  </Typography>
                  <Stack spacing={1}>
                    <FormControlLabel control={<Switch size="small" defaultChecked />} label={<Typography variant="body2">Performance Reports</Typography>} />
                    <FormControlLabel control={<Switch size="small" defaultChecked />} label={<Typography variant="body2">New Assignments</Typography>} />
                    <FormControlLabel control={<Switch size="small" />} label={<Typography variant="body2">Marketing Updates</Typography>} />
                    <FormControlLabel control={<Switch size="small" defaultChecked />} label={<Typography variant="body2">Security Alerts</Typography>} />
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>App Alerts</Typography>
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <FormControlLabel control={<Switch size="small" defaultChecked />} label={<Typography variant="body2">Direct Messages</Typography>} />
                    <FormControlLabel control={<Switch size="small" defaultChecked />} label={<Typography variant="body2">Payout Confirmation</Typography>} />
                  </Stack>
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 2, textAlign: 'center' }}>
                    <Button size="small" variant="text" color="primary">Test Notification</Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Tab 3: Billing & Payouts */}
          {activeTab === 3 && (
            <Box className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Payout Settings</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                    Commissions will be settled to this account.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="A/C Holder Name"
                        value={bankForm.accountHolderName}
                        onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Bank Name"
                        value={bankForm.bankName}
                        onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="IFSC Code"
                        value={bankForm.ifscCode}
                        onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Account Number"
                        value={bankForm.accountNumber}
                        onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Account Type"
                        value={bankForm.accountType}
                        onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })}
                        SelectProps={{ native: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      >
                        <option value="Savings">Savings Account</option>
                        <option value="Current">Current Account</option>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSaveBank}
                        disabled={savingBank}
                        sx={{ borderRadius: 2, px: 3 }}
                      >
                        {savingBank ? "Saving..." : "Verify & Save"}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Tax Identity</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth size="small" label="PAN No." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth size="small" label="GSTIN (Optional)" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, p: 1.5, bgcolor: '#FEF3C7', color: '#92400E', borderRadius: 2, display: 'flex', gap: 1.5 }}>
                    <Security sx={{ fontSize: 16 }} />
                    <Typography variant="caption">Information is encrypted for regulatory compliance.</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Tab 4: Preferences */}
          {activeTab === 4 && (
            <Box className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Localization</Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" fontWeight="600" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Language</Typography>
                      <TextField select fullWidth size="small" value="English (US)" SelectProps={{ native: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                        <option>English (US)</option>
                        <option>Hindi (IN)</option>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" fontWeight="600" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Timezone</Typography>
                      <TextField select fullWidth size="small" value="IST (GMT+05:30)" SelectProps={{ native: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                        <option>IST (GMT+05:30)</option>
                        <option>UTC</option>
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Comm. Channels</Typography>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" startIcon={<Language sx={{ fontSize: 16 }} />} sx={{ borderRadius: 6, flex: 1, fontSize: '11px' }}>WhatsApp</Button>
                    <Button variant="contained" size="small" color="secondary" startIcon={<Person sx={{ fontSize: 16 }} />} sx={{ borderRadius: 6, flex: 1, fontSize: '11px' }}>Portal</Button>
                    <Button variant="outlined" size="small" startIcon={<Notifications sx={{ fontSize: 16 }} />} sx={{ borderRadius: 6, flex: 1, fontSize: '11px' }}>Phone</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
