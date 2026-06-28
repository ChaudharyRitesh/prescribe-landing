"use client";

import React from "react";
import { Box, Skeleton, Grid, Card, CardContent } from "@mui/material";

export const AdmissionRecordSkeleton = () => {
  return (
    <Box>
      {/* Breadcrumb & Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={150} height={20} sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Skeleton variant="text" width={300} height={40} />
            <Skeleton variant="text" width={400} height={24} />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton variant="rounded" width={180} height={40} />
            <Skeleton variant="rounded" width={160} height={40} />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Summary Section */}
          <Box sx={{ mb: 4, borderRadius: "12px", border: "1px solid #E5E7EB" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 1.5 }}>
              <Skeleton variant="rounded" width={36} height={36} />
              <Skeleton variant="text" width={200} height={28} />
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                    <Skeleton variant="text" width={100} height={16} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="80%" height={24} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* Clinical Findings */}
          <Box sx={{ mb: 4, borderRadius: "12px", border: "1px solid #E5E7EB" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 1.5 }}>
              <Skeleton variant="rounded" width={36} height={36} />
              <Skeleton variant="text" width={200} height={28} />
            </Box>
            <Box sx={{ p: 3 }}>
              {[1, 2].map((i) => (
                <Box key={i} sx={{ mb: 3 }}>
                  <Skeleton variant="text" width={150} height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Right Rail */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Provenance */}
          <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Skeleton variant="rounded" width={24} height={24} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          {/* History */}
          <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Skeleton variant="rounded" width={36} height={36} />
                <Skeleton variant="text" width={150} height={28} />
              </Box>
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ mb: 2, ml: 2, pl: 2, borderLeft: "2px solid #E5E7EB" }}>
                  <Skeleton variant="text" width={100} height={16} />
                  <Skeleton variant="text" width="90%" height={20} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
