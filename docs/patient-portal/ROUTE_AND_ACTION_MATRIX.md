# Route and Action Matrix

## Required Routes
- `/portal/home`
- `/portal/records`
- `/portal/appointments`
- `/portal/medicines`
- `/portal/bills`
- `/portal/profile`

## Actions Audit

| Display Label | Source Component | Destination Route/Mutation | Status | Required Data | Loading/Error State | Permission |
|---------------|------------------|----------------------------|--------|---------------|---------------------|------------|
| Health Home | Desktop Top Nav | `/portal/home` | Pending Rewrite | User Session | TBD | Authenticated |
| Records | Nav / Quick Action | `/portal/records` | Missing Route | Records List | TBD | Authenticated |
| Appointments | Nav / Quick Action | `/portal/appointments` | Missing Route | Appointments List| TBD | Authenticated |
| Medicines | Nav / Quick Action | `/portal/medicines` | Missing Route | Medicines List | TBD | Authenticated |
| Bills | Nav / Quick Action | `/portal/bills` | Missing Route | Bills List | TBD | Authenticated |
| Profile | Menu | `/portal/profile` | Missing Route | User Details | TBD | Authenticated |
| Reschedule | Attention Panel | `useRescheduleMutation` | Mock/Dead | Appointment ID| TBD | Authenticated |
| Get Directions| Attention Panel | Maps URL (external) | Mock/Dead | Facility Address| TBD | Authenticated |
| View Prescription| Health Timeline | `/portal/records/[id]` | Mock/Dead | Record ID | TBD | Authenticated |
| View PDF | Health Timeline | `/portal/records/[id]/pdf` | Mock/Dead | Record ID | TBD | Authenticated |
