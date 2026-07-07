# Screen 02 — Medical Records — Action Matrix

| Action | Component | Icon | Route/Mutation | State | Test |
|---|---|---|---|---|---|
| Change category | RecordCategoryTabs | Category MUI icon | URL `?category=` update | Enabled | Required |
| Search | RecordFilters | SearchOutlined | URL `?search=` (debounced 350ms) | Enabled | Required |
| Clear search | RecordFilters | CloseOutlined | URL clear `search` | Enabled | Required |
| Date filter | RecordFilters | DateRangeOutlined | URL `?dateRange=` | Enabled | Required |
| Status filter | RecordFilters | FilterListOutlined | URL `?status=` | Enabled | Required |
| Remove filter chip | RecordFilters | Chip onDelete | URL param removal | Enabled | Required |
| Clear all filters | RecordFilters | Button | URL reset | Enabled | Required |
| Mobile filters | MobileRecordFilters | TuneOutlined | Bottom drawer | Enabled | Required |
| Select record | RecordTableRow / RecordMobileCard | Checkbox | Local state (Set) | Depends on `canSelect` | Required |
| Select all | RecordsTable | Checkbox (indeterminate) | Local state | Enabled | Required |
| View record | RecordTableRow / RecordMobileCard | VisibilityOutlined | Placeholder (no detail route) | Depends on `canView` | Required |
| Download record | RecordTableRow / RecordMobileCard | DownloadOutlined | `useRecordDownloadMutation` | Depends on `canDownload` | Required |
| Download selected | MedicalRecordsPageHeader | DownloadForOfflineOutlined | `useRecordExportMutation` | Disabled when 0 selected | Required |
| Book appointment | MedicalRecordsPageHeader | AddCircleOutline | `/portal/appointments/book` | Disabled (route not impl) | Required |
| Pagination | RecordsPagination | ChevronLeft/RightOutlined | URL `?page=` | Enabled | Required |
| Clear filters (panel) | MissingRecordPanel | Button | URL reset | Enabled | Required |
| Contact support | MissingRecordPanel | HelpOutline | Disabled (route not impl) | Disabled | Required |
| Retry on error | Alert | Button | `refetch()` | Enabled | Required |
