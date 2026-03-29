"use client";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  LinearProgress,
  Divider,
  Chip,
} from "@mui/material";
import {
  LocalHospital,
  AssignmentTurnedIn,
  AttachMoney,
  MoreVert as MoreVertIcon,
  TrendingUp,
  Schedule,
  CalendarMonth,
  EventNote,
} from "@mui/icons-material";
import { useDashboard } from "./context/DashboardContext";
import { List, ListItem, ListItemText } from "@mui/material";

const StatCard = ({ title, value, subtitle, icon, trend, color }: any) => (
  <Card sx={{ height: "100%" }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: `${color}15`,
            color: color,
            display: "flex",
          }}
        >
          {icon}
        </Box>
        <IconButton size="small"><MoreVertIcon /></IconButton>
      </Box>
      <Typography variant="h4" sx={{ mb: 1, color: "text.primary" }}>{value}</Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, mb: 1 }}>{title}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 2 }}>
        <TrendingUp sx={{ color: "success.main", fontSize: 16 }} />
        <Typography variant="caption" sx={{ color: "success.main", fontWeight: 600 }}>{trend}</Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>{subtitle}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const recentLeads = [
  { id: 1, name: "City General Hospital", status: "Demo Scheduled", date: "Today", value: "$450/mo", progress: 60 },
  { id: 2, name: "Sunshine Clinic", status: "Follow up", date: "Yesterday", value: "$150/mo", progress: 30 },
  { id: 3, name: "Metro Health Center", status: "Closed Won", date: "Oct 24", value: "$850/mo", progress: 100 },
  { id: 4, name: "Northside Medical", status: "Initial Pitch", date: "Oct 22", value: "$300/mo", progress: 15 },
];

export default function PartnerDashboardOverview() {
  const { userData, dashboardStats, loading } = useDashboard();

  if (loading) {
    return (
      <Box sx={{ width: "100%", py: 8, textAlign: "center" }}>
        <LinearProgress sx={{ maxWidth: 400, mx: "auto", mb: 2, borderRadius: 2 }} />
        <Typography variant="body2" color="text.secondary">Fetching your performance metrics...</Typography>
      </Box>
    );
  }

  const stats = dashboardStats?.stats || { totalHospitals: 0, conversions: 0, estimatedCommission: 0, activePitches: 0 };
  const recentActivityVisits = dashboardStats?.recentActivity || [];
  const recentPitches = (dashboardStats as any)?.recentPitches || [];

  // Merge and sort by date descending
  const unifiedActivity = [
    ...recentActivityVisits.map((v: any) => ({ ...v, type: 'visit' })),
    ...recentPitches.map((p: any) => ({ ...p, type: 'pitch' }))
  ].sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt || a.date || a.visitDate).getTime();
    const dateB = new Date(b.createdAt || b.date || b.visitDate).getTime();
    return dateB - dateA;
  }).slice(0, 5);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
          Welcome back, {userData?.name || 'Representative'}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          You are currently managing field operations for {userData?.companyName || 'your organization'}.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Hospitals"
            value={stats.totalHospitals?.toString() || "0"}
            subtitle="vs last month"
            trend="+0%"
            icon={<LocalHospital />}
            color="#3B82F6"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Pitches"
            value={stats.activePitches?.toString() || "0"}
            subtitle="Current leads"
            trend="New"
            icon={<Schedule />}
            color="#8B5CF6"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Conversions"
            value={stats.conversions?.toString() || "0"}
            subtitle="successful"
            trend="+0"
            icon={<AssignmentTurnedIn />}
            color="#00DACC"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Reconciled Balance"
            value={`₹${(dashboardStats as any)?.availableBalance?.toLocaleString() || '0'}`}
            subtitle={stats.estimatedCommission > 0 ? `After ₹${(dashboardStats as any)?.totalAdvances?.toLocaleString() || '0'} advances` : "Withdrawable funds"}
            trend={stats.conversions > 0 ? "Ready" : "Pending"}
            icon={<AttachMoney />}
            color="#F59E0B"
          />
        </Grid>
      </Grid>

      {/* Main Content: Activity + Agenda */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: "100%" }}>
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Pipeline & Field Activity</Typography>
          <Button variant="text" size="small" sx={{ fontWeight: 600 }}>View All</Button>
        </Box>
        <Divider />
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          {unifiedActivity.length > 0 ? unifiedActivity.map((activity: any, index) => (
            <Box
              key={activity._id}
              sx={{
                p: 3,
                borderBottom: index !== unifiedActivity.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 0 },
                transition: "background-color 0.2s",
                "&:hover": { bgcolor: "rgba(0,0,0,0.01)" }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
                    {activity.hospitalName || activity.tenantId?.name || "General Activity"}
                  </Typography>
                  <Chip 
                    label={activity.type === 'pitch' ? 'NEW PITCH' : 'VISIT'} 
                    size="small" 
                    variant="outlined"
                    sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                    color={activity.type === 'pitch' ? 'primary' : 'secondary'}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <Schedule sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {new Date(activity.createdAt || activity.visitDate).toLocaleDateString()} • {activity.status.toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ width: { xs: "100%", sm: "20%" }, mr: { sm: 4 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Win Probability</Typography>
                  <Typography variant="caption" fontWeight="600">
                    {activity.winProbability || (activity.status === 'converted' ? 100 : (activity.status === 'follow-up' ? 60 : 30))}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={activity.winProbability || (activity.status === 'converted' ? 100 : (activity.status === 'follow-up' ? 60 : 30))} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: "rgba(0,0,0,0.05)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: activity.status === 'converted' ? "success.main" : (activity.status === 'follow-up' ? "primary.main" : "warning.main"),
                      borderRadius: 3
                    }
                  }} 
                />
              </Box>

              <Box sx={{ textAlign: { xs: "left", sm: "right" }, minWidth: 100 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>₹{activity.potentialValue?.toLocaleString() || '0'}</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Pot. Value</Typography>
              </Box>
            </Box>
          )) : (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">No recent field activity found. Start pitching to hospitals!</Typography>
            </Box>
          )}
        </CardContent>
          </Card>
        </Grid>

        {/* Today's Agenda Widget */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
            <Box 
              sx={{ 
                p: 3, 
                pb: 2, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: "rgba(13, 148, 136, 0.1)", color: "primary.main", borderRadius: 2, display: "flex" }}>
                  <CalendarMonth fontSize="small" />
                </Box>
                <Typography variant="h6" fontWeight="700">Today's Agenda</Typography>
              </Box>
              <Button 
                variant="text" 
                size="small" 
                color="primary" 
                sx={{ fontWeight: 600 }}
                onClick={() => window.location.href = '/partner/dashboard/calendar'}
              >
                View Full
              </Button>
            </Box>
            
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ py: 1 }}>
                {unifiedActivity.filter((a: any) => {
                  const dateString = new Date(a.visitDate || a.date || a.createdAt).toDateString();
                  return dateString === new Date().toDateString();
                }).length > 0 ? (
                  unifiedActivity
                    .filter((a: any) => {
                      const dateString = new Date(a.visitDate || a.date || a.createdAt).toDateString();
                      return dateString === new Date().toDateString();
                    })
                    .map((activity: any, idx) => (
                      <Box 
                        key={idx}
                        sx={{ 
                          py: 2, 
                          px: 3,
                          borderLeft: activity.type === 'pitch' ? "4px solid #0D9488" : "4px solid #3B82F6",
                          mb: 0.5,
                          "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                          cursor: "pointer"
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="700" noWrap>
                          {activity.hospitalName || "Hospital Visit"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                          <Schedule sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {activity.status?.toUpperCase() || "SCHEDULED"}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                ) : (
                  <Box sx={{ p: 6, textAlign: "center" }}>
                    <EventNote sx={{ fontSize: 48, color: "text.disabled", mb: 2, opacity: 0.3 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      No visits for today.
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      Rest day or check your calendar.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
