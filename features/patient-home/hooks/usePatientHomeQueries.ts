"use client";

import { useState, useEffect } from "react";

export const usePatientHomeQuery = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    setIsLoading(true);
    
    const t = setTimeout(() => {
      if (controller.signal.aborted) return;
      
      setData({
        patient: {
          firstName: "John",
        },
        healthSnapshot: {
          activePrescriptions: 4,
          pendingInvoices: 1240,
          nextAppointmentDate: new Date(2024, 9, 28), // Oct 28, 2024
          totalVisits: 12,
        },
        quickAccessCounts: {
          records: 28,
          prescriptions: 4,
          ipd: 1,
          opd: 12,
          labs: 8,
          billing: 15,
          visits: 12
        }
      });
      setIsLoading(false);
    }, 600);

    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, []);

  return { data, isLoading, error };
};

export const useRecentMedicalRecordsQuery = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const t = setTimeout(() => {
      if (controller.signal.aborted) return;

      setData([
        {
          id: "rec_1",
          date: new Date(2024, 9, 24),
          title: "Annual Physical",
          category: "General Health",
          provider: "Dr. Sarah Wilson",
          status: "Complete",
        },
        {
          id: "rec_2",
          date: new Date(2024, 9, 15),
          title: "Blood Panel Res.",
          category: "Lab Report",
          provider: "Dr. James Miller",
          status: "New",
        },
        {
          id: "rec_3",
          date: new Date(2024, 9, 2),
          title: "Chest X-Ray",
          category: "Radiology",
          provider: "Dr. Elena Rodriguez",
          status: "Complete",
        },
        {
          id: "rec_4",
          date: new Date(2024, 8, 28),
          title: "Dermatology Consult",
          category: "Specialist",
          provider: "Dr. Michael Chen",
          status: "Complete",
        },
        {
          id: "rec_5",
          date: new Date(2024, 8, 20),
          title: "Vaccination Record",
          category: "Immunization",
          provider: "Nurse Sarah",
          status: "Complete",
        }
      ]);
      setIsLoading(false);
    }, 800);

    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, []);

  return { data, isLoading, error };
};

export const useUpcomingAppointmentsQuery = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const t = setTimeout(() => {
      if (controller.signal.aborted) return;

      const apt1 = new Date(2024, 9, 28, 10, 30);
      const apt2 = new Date(2024, 10, 12, 14, 15);

      setData([
        {
          id: "apt_1",
          date: apt1,
          practitioner: "Dr. Emily Vance",
          specialty: "Cardiology",
        },
        {
          id: "apt_2",
          date: apt2,
          practitioner: "Dr. Robert Fox",
          specialty: "Ophthalmology",
        }
      ]);
      setIsLoading(false);
    }, 700);

    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, []);

  return { data, isLoading, error };
};
