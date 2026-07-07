# Screen 03 — IPD Admission Record Detail — Action Matrix

| Action | Component | MUI Icon | Route/Mutation | Enabled State | Test |
|---|---|---|---|---|---|
| Back to records | AdmissionRecordHeader | ArrowBackOutlined | `/portal/records` | Enabled | Required |
| Download summary | AdmissionRecordHeader | PictureAsPdfOutlined | `useRequestAdmissionSummaryDownloadMutation` | Permission based (`canDownloadSummary`) | Required |
| Schedule follow-up | AdmissionRecordHeader | CalendarMonthOutlined | Booking route (mocked disabled) | Feature based (disabled) | Required |
| View invoice | AdmissionBillingSummary | OpenInNewOutlined | Bill route (mocked disabled) | Route based (disabled) | Required |
| Download document | RelatedDocuments | DownloadOutlined | `useRequestRelatedDocumentDownloadMutation` | Permission based (`canDownload`) | Required |
| Contact support | AdmissionSupportPanel | SupportAgentOutlined | Support route (mocked disabled) | Route based (disabled) | Required |
| View latest version | RecordCorrectionBanner | PublishedWithChangesOutlined | Detail route (mocked button) | Record based (superseded status) | Required |
