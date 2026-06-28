# Design System — Patient Portal

Patient product, not an admin dashboard. Calm, trustworthy, mobile-first.

## Foundation
- MUI 7 + centralized theme. Portal extends/scopes the host `@/theme`.
- Solid restrained colors; status = label + icon + color (never color alone).
- Generous whitespace, readable type, single icon set (MUI icons), consistent.
- Skeleton loaders, purposeful empty states, recoverable errors, subtle motion + reduced-motion support, touch-friendly targets, bottom sheets on mobile.

## Avoid
Decorative gradients (unless brand), excessive cards/shadows, dense tables on
mobile, clutter, multiple competing primary actions, emoji icons, multiple icon
libraries, unexplained medical jargon, animation that delays data.

## Status tokens
kp_native (verified), abdm_linked, awaiting_consent, awaiting_sync, link_failed,
patient_uploaded, unverified — each a labeled chip with icon + accessible text.

## Components (Slice 1)
AppShell, SideNav (desktop), BottomNav (mobile), TopBar, RecordCard, StatusChip,
SkeletonList, EmptyState, ErrorState, PermissionDeniedState.
