import * as z from 'zod';

// Step 1: Initiate via Email
export const InitiateSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export type InitiateFormValues = z.infer<typeof InitiateSchema>;

// Step 2: Verify OTP
export const VerifyOtpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits." }).regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyOtpFormValues = z.infer<typeof VerifyOtpSchema>;

// Step 3: Organization & Subdomain (Identity)
export const IdentitySchema = z.object({
  orgName: z.string().min(2, { message: "Organisation name must be at least 2 characters." }),
  subdomain: z.string()
    .min(3, { message: "Subdomain must be at least 3 characters." })
    .max(30, { message: "Subdomain must not exceed 30 characters." })
    .regex(/^[a-z0-9-]+$/, { message: "Only lowercase letters, numbers, and hyphens are allowed." }),
  logoUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
});

export type IdentityFormValues = z.infer<typeof IdentitySchema>;

// Step 4: Contact & Billing Information
export const ContactSchema = z.object({
  contactName: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  contactPhone: z.string().regex(/^\+?[1-9]\d{9,14}$/, { message: "Please enter a valid phone number." }).optional().or(z.literal('')),
  
  // Address info
  address: z.object({
    building: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),

  // Legal / Tax info
  licenseNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof ContactSchema>;

// Step 5: Module Selection happens via UI picking. However, we combine all to a master submit schema.
export const UnifiedRegistrationSchema = z.object({
  orgName: z.string(),
  subdomain: z.string(),
  logoUrl: z.string().optional(),
  contactName: z.string(),
  contactPhone: z.string().optional(),
  address: z.object({
    building: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
  licenseNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  
  // Selection
  selectionType: z.enum(['package', 'individual']),
  packageId: z.string().optional(),
  selectedModules: z.array(z.string()).optional(),
  billingCycle: z.enum(['monthly', 'yearly']),
  subscriptionPlan: z.string().optional(),
}).refine(data => {
  if (data.selectionType === 'package' && !data.packageId) return false;
  if (data.selectionType === 'individual' && (!data.selectedModules || data.selectedModules.length === 0)) return false;
  return true;
}, {
  message: "Please select a package or at least one module.",
  path: ["selectionType"], // Attach error to selectionType
});
