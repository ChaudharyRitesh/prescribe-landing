"use client";

import { TrendingUp, AdsClick, AutoGraph, MonetizationOn, Public, Business } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboard } from "../context/DashboardContext";
import { LinearProgress, Card, CardContent, Grid, Box, Typography, Divider } from "@mui/material";

const PerformanceCard = ({ title, value, icon, color }: any) => (
  <Card sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
    <Box sx={{ position: "absolute", top: -20, right: -20, opacity: 0.05, transform: "scale(2.5)", color: color }}>
      {icon}
    </Box>
    <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}15`, color: color, display: "flex" }}>{icon}</Box>
        <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 600 }}>{title}</Typography>
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 700, color: "text.primary" }}>{value}</Typography>
    </CardContent>
  </Card>
);

export default function PerformancePage() {
  const { performanceData, pitches, loading } = useDashboard();

  if (loading || !performanceData) {
    return (
      <Box sx={{ width: "100%", py: 8, textAlign: "center" }}>
        <LinearProgress sx={{ maxWidth: 400, mx: "auto", mb: 2, borderRadius: 2 }} />
        <Typography variant="body2" color="text.secondary">Analyzing your pitching performance...</Typography>
      </Box>
    );
  }

  const pStats = performanceData;

  // Group pitches by hospitalName for 'Territory Coverage' visualization
  const territoryStats: Record<string, number> = {};
  pitches.forEach(p => {
    const area = p.hospitalName || "Unknown";
    territoryStats[area] = (territoryStats[area] || 0) + 1;
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
          Performance Metrics
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Analyze your pitching success rate and territory coverage.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PerformanceCard title="Pitches Delivered" value={pStats.totalPitches} icon={<AdsClick />} color="#3B82F6" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PerformanceCard title="Win Rate" value={`${pStats.winRate}%`} icon={<AutoGraph />} color="#10B981" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PerformanceCard title="Avg. Deal Cycle" value={pStats.avgDealCycle} icon={<TrendingUp />} color="#F59E0B" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PerformanceCard title="Generated Potential" value={`₹${(pStats.generatedValue || 0).toLocaleString()}`} icon={<MonetizationOn />} color="#8B5CF6" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Win Rate & Pitches Trend (Last 6 Months)</Typography>
            <Box sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pStats.trend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line yAxisId="left" type="monotone" dataKey="pitches" name="Pitches Delivered" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="winRate" name="Win Rate (%)" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Public sx={{ color: 'primary.main' }} />
                Territory Coverage
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pitch distribution across hospitals
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {Object.entries(territoryStats).length > 0 ? Object.entries(territoryStats).slice(0, 5).map(([name, count]) => (
                <Box key={name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {pStats.totalPitches > 0 ? Math.round((count / pStats.totalPitches) * 100) : 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={pStats.totalPitches > 0 ? (count / pStats.totalPitches) * 100 : 0} 
                    sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.05)' }} 
                  />
                </Box>
              )) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Business sx={{ fontSize: 40, color: 'divider', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">No pitches recorded yet</Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ p: 2, bgcolor: 'primary.main', borderRadius: 2, color: 'white' }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>Account Concentration</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{Object.keys(territoryStats).length}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Active Hospital accounts</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
