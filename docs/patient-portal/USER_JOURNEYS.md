# User Journeys — Patient Portal

## J1 Sign in (OTP)
Enter phone/email → receive OTP → verify → session (cookie) → Overview.
Edge: wrong OTP (attempts), expiry, resend cooldown, unknown account (generic).

## J2 Overview
See identity summary, upcoming appointments, recent visits/Rx/labs, outstanding
bills, ABHA status, pending consents — each with source + sync/verify status.

## J3 View a prescription / J4 View a lab report
List → detail; prescriber + facility + provenance; abnormal flags w/ accessible
text (no advice). Download/share where authorized (step-up for share).

## J5 View / pay a bill
Invoice → line items → pay (Razorpay redirect) → idempotent confirm →
receipt/refund/reconciliation states.

## J6 Consent / ABHA (later)
Link ABHA → care contexts → consent requests → grant/deny/revoke → sync states →
failure recovery. Never imply KP owns external records.

## J7 Privacy & support
Update profile/contacts (step-up) · data request · grievance/ticket · sessions &
devices · export request · logout (cache cleared).

## J8 Account switching (dependents, later)
Cancel in-flight, clear cache, prevent prior-account data bleed.

> Each journey lists loading/empty/error/partial-failure + a11y expectations in
> its slice.
