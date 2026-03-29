"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  IconButton,
  Button,
  Chip,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Event as EventIcon,
  Today,
  FiberManualRecord,
  Add as AddIcon,
  AccessTime,
} from "@mui/icons-material";
import { useDashboard } from "../context/DashboardContext";
import ScheduleVisitModal from "@/components/mr/dashboard/ScheduleVisitModal";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  eachDayOfInterval,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";

export default function CalendarPage() {
  const { scheduleEvents, pitches, refreshSchedule } = useDashboard();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const todayMidnight = startOfDay(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getDayEvents = (day: Date) => {
    const sEvents = scheduleEvents.filter((event) => {
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, day);
    }).map(e => ({ ...e, source: 'schedule' }));

    const pEvents = pitches.filter((pitch) => {
      const vDate = pitch.visitDate ? new Date(pitch.visitDate) : null;
      const fDate = pitch.nextFollowUpDate ? new Date(pitch.nextFollowUpDate) : null;
      return (vDate && isSameDay(vDate, day)) || (fDate && isSameDay(fDate, day));
    }).map(p => ({
      ...p,
      title: p.hospitalName,
      start: p.visitDate,
      type: p.status === 'Follow up' ? 'Follow-up' : 'Visit',
      source: 'pitch'
    }));

    return [...sEvents, ...pEvents];
  };

  const handleAddEvent = (day: Date) => {
    setSelectedDate(day);
    setIsScheduleModalOpen(true);
  };

  const renderHeader = () => (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
          Visit Schedule
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Manage your hospital visits and follow-up pipeline.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", bgcolor: "background.paper", borderRadius: 2, p: 0.5, border: "1px solid", borderColor: "divider" }}>
          <IconButton onClick={prevMonth} size="small"><ChevronLeft /></IconButton>
          <Typography sx={{ minWidth: 140, textAlign: "center", fontWeight: 600 }}>
            {format(currentMonth, "MMMM yyyy")}
          </Typography>
          <IconButton onClick={nextMonth} size="small"><ChevronRight /></IconButton>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedDate(new Date());
            setIsScheduleModalOpen(true);
          }}
          sx={{ bgcolor: "#0D9488", "&:hover": { bgcolor: "#0f766e" } }}
        >
          Schedule Visit
        </Button>
      </Box>
    </Box>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <Grid container columns={7} sx={{ mb: 1 }}>
        {days.map((day) => (
          <Grid key={day} size={{ xs: 1 }} sx={{ textAlign: "center", py: 1.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 1 }}>
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {renderHeader()}

      <Grid container spacing={3}>
        {/* Main Calendar */}
        <Grid size={{ xs: 12, lg: 9 }}>
          <Card sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
            {renderDays()}
            <Grid container columns={7} sx={{ borderTop: "1px solid", borderColor: "divider", borderLeft: "1px solid" }}>
              {calendarDays.map((day, i) => {
                const dayEvents = getDayEvents(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isActiveToday = isToday(day);

                const isPast = isBefore(startOfDay(day), todayMidnight);
                const canAdd = isCurrentMonth && !isPast;

                return (
                  <Grid
                    key={i}
                    size={{ xs: 1 }}
                    onClick={() => canAdd && handleAddEvent(day)}
                    sx={{
                      height: 120,
                      borderRight: "1px solid",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      p: 1,
                      bgcolor: !isCurrentMonth ? "rgba(0,0,0,0.02)" : (isPast ? "rgba(0,0,0,0.01)" : "transparent"),
                      cursor: canAdd ? "pointer" : "default",
                      opacity: isPast && !isActiveToday ? 0.7 : 1,
                      transition: "background-color 0.2s",
                      "&:hover": { bgcolor: canAdd ? "rgba(13, 148, 136, 0.03)" : "transparent" },
                      position: "relative",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActiveToday ? 800 : 500,
                          color: isActiveToday ? "#0D9488" : (isCurrentMonth ? "text.primary" : "text.disabled"),
                          bgcolor: isActiveToday ? "rgba(13, 148, 136, 0.1)" : "transparent",
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                        }}
                      >
                        {format(day, "d")}
                      </Typography>
                      {dayEvents.length > 0 && isCurrentMonth && (
                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                          {dayEvents.length} {dayEvents.length === 1 ? 'Event' : 'Events'}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ overflowY: "auto", maxHeight: 80, display: "flex", flexDirection: "column", gap: 0.5 }}>
                      {isCurrentMonth && dayEvents.slice(0, 3).map((event, idx) => (
                        <Tooltip title={`${event.title} - ${format(new Date(event.start), "h:mm a")}`} key={idx}>
                          <Box
                            sx={{
                              px: 0.8,
                              py: 0.3,
                              borderRadius: 1,
                              bgcolor: event.type === 'Demo' ? 'rgba(13, 148, 136, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              borderLeft: `3px solid ${event.type === 'Demo' ? '#0D9488' : '#3B82F6'}`,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="caption" sx={{ fontSize: "10px", fontWeight: 600, color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {event.title}
                            </Typography>
                          </Box>
                        </Tooltip>
                      ))}
                      {isCurrentMonth && dayEvents.length > 3 && (
                        <Typography variant="caption" sx={{ px: 0.5, color: "text.secondary", fontSize: "10px" }}>
                          + {dayEvents.length - 3} more
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Card>
        </Grid>

        {/* Side Panel: Upcoming */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
            <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
              <Today sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Upcoming Tasks</Typography>
            </Box>
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                ...scheduleEvents.map(e => ({ ...e, sortDate: new Date(e.start) })),
                ...pitches.filter(p => p.nextFollowUpDate).map(p => ({ 
                  title: p.hospitalName, 
                  start: p.nextFollowUpDate, 
                  type: 'Follow-up', 
                  sortDate: new Date(p.nextFollowUpDate) 
                }))
              ]
                .filter(e => !isBefore(startOfDay(e.sortDate), todayMidnight))
                .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
                .slice(0, 8)
                .map((event, idx) => (
                  <Box key={idx} sx={{ position: "relative", pl: 2, borderLeft: "2px solid", borderColor: "rgba(13, 148, 136, 0.2)" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
                      {event.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                      <AccessTime sx={{ fontSize: 12, color: "text.secondary" }} />
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {format(event.sortDate, "MMM d, h:mm a")}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 0.8 }}>
                      <Chip 
                        label={event.type} 
                        size="small" 
                        variant="outlined" 
                        sx={{ height: 18, fontSize: "9px", fontWeight: 700, color: event.type === 'Demo' ? 'primary.main' : 'text.secondary' }}
                      />
                    </Box>
                  </Box>
                ))}
              {scheduleEvents.length === 0 && pitches.length === 0 && (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <EventIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1, opacity: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">No upcoming tasks scheduled</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      <ScheduleVisitModal 
        open={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)} 
        initialDate={selectedDate}
      />
    </Box>
  );
}
