# Screen 01 Action Matrix - Patient Health Home

| Visible Action | Component | Destination/Mutation | Enabled/Disabled | Test Coverage |
|----------------|-----------|----------------------|------------------|---------------|
| Health Home | `PatientSidebar` / `MobilePatientDrawer` | `/portal/home` | Enabled | TBD |
| Medical Records | `PatientSidebar` / `MobilePatientDrawer` | `/portal/records` | Enabled | TBD |
| Appointments | `PatientSidebar` / `MobilePatientDrawer` | `/portal/appointments` | Enabled | TBD |
| Prescriptions | `PatientSidebar` / `MobilePatientDrawer` | `/portal/medicines` | Enabled | TBD |
| Lab Reports | `PatientSidebar` | `/portal/reports` | Disabled ("Available in a later phase") | TBD |
| Bills & Payments | `PatientSidebar` / `MobilePatientDrawer` | `/portal/bills` | Enabled | TBD |
| ABHA & Consents | `PatientSidebar` | `/portal/abha` | Disabled ("Available in a later phase") | TBD |
| Profile | `PatientSidebar` / `MobilePatientDrawer` | `/portal/profile` | Enabled | TBD |
| Help & Support | `PatientSidebar` | `/portal/support` | Disabled ("Available in a later phase") | TBD |
| Privacy | `PatientSidebar` | `/portal/privacy` | Disabled ("Available in a later phase") | TBD |
| Sign out | `PatientSidebar` | `logoutMutation` -> `/patient-portal` | Enabled | TBD |
| Global Search | `PatientHeader` | Search Results Modal | Disabled ("Search backend unavailable") | TBD |
| Notifications | `PatientHeader` | Notifications Drawer | Disabled ("Available in a later phase") | TBD |
| Avatar Menu | `PatientHeader` | Dropdown -> `/portal/profile` | Enabled | TBD |
| View Appointment | `CareTodayPanel` | `/portal/appointments/[id]` | Enabled | TBD |
| Get Directions | `CareTodayPanel` | External Maps | Disabled ("Action requires facility mapping") | TBD |
| Active Medicines Summary | `HealthSnapshot` | `/portal/medicines` | Enabled | TBD |
| New Reports Summary | `HealthSnapshot` | `/portal/records` | Enabled | TBD |
| Outstanding Balance Summary| `HealthSnapshot` | `/portal/bills` | Enabled | TBD |
| Last Consultation Summary | `HealthSnapshot` | `/portal/records` | Enabled | TBD |
| Quick Access (Records) | `QuickAccessGrid` | `/portal/records` | Enabled | TBD |
| Quick Access (Lab Reports)| `QuickAccessGrid` | `/portal/records?category=lab` | Enabled | TBD |
| Quick Access (Rx) | `QuickAccessGrid` | `/portal/medicines` | Enabled | TBD |
| Quick Access (Appts) | `QuickAccessGrid` | `/portal/appointments` | Enabled | TBD |
| Quick Access (Bills) | `QuickAccessGrid` | `/portal/bills` | Enabled | TBD |
| View details (Timeline) | `RecentMedicalRecords` | `/portal/records/[id]` | Enabled | TBD |
| Book Appointment | `UpcomingAppointments` | `bookAppointmentModal` | Disabled ("Booking flow pending") | TBD |
| View Recommendation | `PatientReminder` | `/portal/recommendation` | Disabled ("Clinical logic pending") | TBD |
| Download Health Records | `Sidebar` / `Header` | `useRequestHealthArchiveMutation` | Enabled | TBD |
