/**
 * Shared MUI icon mapping for the Patient Portal.
 * Single source of truth — import from here, never duplicate.
 * All icons: @mui/icons-material, outlined variant.
 */

// Sidebar Navigation
export { default as HomeOutlinedIcon } from "@mui/icons-material/HomeOutlined";
export { default as FolderSharedOutlinedIcon } from "@mui/icons-material/FolderSharedOutlined";
export { default as CalendarMonthOutlinedIcon } from "@mui/icons-material/CalendarMonthOutlined";
export { default as MedicationOutlinedIcon } from "@mui/icons-material/MedicationOutlined";
export { default as ScienceOutlinedIcon } from "@mui/icons-material/ScienceOutlined";
export { default as ReceiptLongOutlinedIcon } from "@mui/icons-material/ReceiptLongOutlined";
export { default as ShieldOutlinedIcon } from "@mui/icons-material/ShieldOutlined";
export { default as PersonOutlineIcon } from "@mui/icons-material/PersonOutline";
export { default as DownloadOutlinedIcon } from "@mui/icons-material/DownloadOutlined";
export { default as HelpOutlineIcon } from "@mui/icons-material/HelpOutline";
export { default as PrivacyTipOutlinedIcon } from "@mui/icons-material/PrivacyTipOutlined";
export { default as LogoutOutlinedIcon } from "@mui/icons-material/LogoutOutlined";
export { default as ChevronLeftOutlinedIcon } from "@mui/icons-material/ChevronLeftOutlined";
export { default as ChevronRightOutlinedIcon } from "@mui/icons-material/ChevronRightOutlined";

// Header
export { default as SearchOutlinedIcon } from "@mui/icons-material/SearchOutlined";
export { default as NotificationsOutlinedIcon } from "@mui/icons-material/NotificationsOutlined";
export { default as MenuIcon } from "@mui/icons-material/Menu";
export { default as CloseOutlinedIcon } from "@mui/icons-material/CloseOutlined";

// Medical Records — categories
export { default as DescriptionOutlinedIcon } from "@mui/icons-material/DescriptionOutlined";
// MedicationOutlinedIcon already exported above
// ScienceOutlinedIcon already exported above
export { default as LocalHospitalOutlinedIcon } from "@mui/icons-material/LocalHospitalOutlined";
// ReceiptLongOutlinedIcon already exported above

// Medical Records — actions
export { default as VisibilityOutlinedIcon } from "@mui/icons-material/VisibilityOutlined";
// DownloadOutlinedIcon already exported above
export { default as MoreHorizOutlinedIcon } from "@mui/icons-material/MoreHorizOutlined";
export { default as DownloadForOfflineOutlinedIcon } from "@mui/icons-material/DownloadForOfflineOutlined";
export { default as AddCircleOutlineIcon } from "@mui/icons-material/AddCircleOutline";
export { default as VerifiedOutlinedIcon } from "@mui/icons-material/VerifiedOutlined";
export { default as DateRangeOutlinedIcon } from "@mui/icons-material/DateRangeOutlined";
export { default as FilterListOutlinedIcon } from "@mui/icons-material/FilterListOutlined";
export { default as TuneOutlinedIcon } from "@mui/icons-material/TuneOutlined";

// Screen 3 - IPD Admission Detail
export { default as OpenInNewOutlinedIcon } from "@mui/icons-material/OpenInNewOutlined";
export { default as ArrowBackOutlinedIcon } from "@mui/icons-material/ArrowBackOutlined";
export { default as PictureAsPdfOutlinedIcon } from "@mui/icons-material/PictureAsPdfOutlined";
export { default as SupportAgentOutlinedIcon } from "@mui/icons-material/SupportAgentOutlined";
export { default as FactCheckOutlinedIcon } from "@mui/icons-material/FactCheckOutlined";
export { default as ChecklistOutlinedIcon } from "@mui/icons-material/ChecklistOutlined";
export { default as PublishedWithChangesOutlinedIcon } from "@mui/icons-material/PublishedWithChangesOutlined";
export { default as HistoryOutlinedIcon } from "@mui/icons-material/HistoryOutlined";
export { default as SourceOutlinedIcon } from "@mui/icons-material/SourceOutlined";
export { default as FolderOffOutlinedIcon } from "@mui/icons-material/FolderOffOutlined";

// Record type icon map — use for consistent category rendering
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import MedicationOutlined from "@mui/icons-material/MedicationOutlined";
import ScienceOutlined from "@mui/icons-material/ScienceOutlined";
import LocalHospitalOutlined from "@mui/icons-material/LocalHospitalOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

export const RECORD_TYPE_ICONS: Record<string, SvgIconComponent> = {
  clinical: DescriptionOutlined,
  prescription: MedicationOutlined,
  laboratory: ScienceOutlined,
  admission: LocalHospitalOutlined,
  billing: ReceiptLongOutlined,
} as const;

export const RECORD_TYPE_COLORS: Record<string, { bg: string; fg: string }> = {
  clinical: { bg: "#EEF2FF", fg: "#6366F1" },
  prescription: { bg: "#ECFEFF", fg: "#06B6D4" },
  laboratory: { bg: "#FEF9C3", fg: "#CA8A04" },
  admission: { bg: "#FEE2E2", fg: "#DC2626" },
  billing: { bg: "#F3F4F6", fg: "#4B5563" },
} as const;
