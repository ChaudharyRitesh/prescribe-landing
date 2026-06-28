# Accessibility — Patient Portal

Target: WCAG 2.1 AA (claim only with test evidence).

## Baseline (every screen)
- Semantic landmarks (`header/nav/main`), one `h1`, logical heading order.
- Keyboard operable; visible focus; logical tab order; skip-to-content.
- Labels/`aria-*` on controls; OTP input announced; status via text + icon (not color alone).
- Touch targets ≥ 44px; reduced-motion honored (`prefers-reduced-motion`).
- Forms: associated labels, error messaging, `aria-describedby`.
- Sufficient contrast; supports zoom/large fonts; screen-reader tested for core flows.

## Verification
axe / jest-axe in component tests; manual keyboard + screen-reader pass per slice.
Record evidence in PROGRESS.
