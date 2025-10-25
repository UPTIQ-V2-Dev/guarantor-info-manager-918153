# Guarantor Background Information Collector - Technical Implementation Plan

## Tech Stack

- **React 19** with TypeScript
- **Vite** as build tool
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **React Hook Form** with **Zod** validation
- **React Router DOM** for navigation
- **TanStack Query** for data management
- **Axios** for API calls

## Application Structure

### Phase 1: Core Setup & Layout

**Files to implement:**

#### Layout & Navigation

- `src/components/layout/AppLayout.tsx` - Main app container with sidebar/header
- `src/components/layout/Sidebar.tsx` - Navigation sidebar
- `src/components/layout/Header.tsx` - App header with user info
- `src/components/ui/breadcrumb-nav.tsx` - Breadcrumb navigation component

#### Routing Setup

- `src/pages/Dashboard.tsx` - Dashboard/home page
- `src/pages/NewSubmission.tsx` - Guarantor form page
- `src/pages/SubmissionHistory.tsx` - View past submissions
- `src/pages/SubmissionDetails.tsx` - Individual submission view
- `src/router/AppRouter.tsx` - Main routing configuration

#### Types & Schemas

- `src/types/guarantor.ts` - Guarantor data types
- `src/schemas/guarantor.ts` - Zod validation schemas
- `src/types/submission.ts` - Submission status/metadata types

### Phase 2: Dashboard Page

**Files to implement:**

#### Dashboard Components

- `src/pages/Dashboard.tsx` - Overview with stats and recent submissions
- `src/components/dashboard/StatsCards.tsx` - Summary statistics cards
- `src/components/dashboard/RecentSubmissions.tsx` - Recent submissions table
- `src/components/dashboard/QuickActions.tsx` - Quick action buttons

#### Dashboard API

- `src/services/dashboard.ts` - Dashboard data fetching
- API endpoint: `GET /api/dashboard/stats`
- API endpoint: `GET /api/dashboard/recent-submissions`

### Phase 3: Guarantor Form Page

**Files to implement:**

#### Form Components

- `src/pages/NewSubmission.tsx` - Main form page container
- `src/components/forms/GuarantorForm.tsx` - Multi-step form wrapper
- `src/components/forms/PersonalInfoSection.tsx` - Personal details form section
- `src/components/forms/ContactSection.tsx` - Contact & identity section
- `src/components/forms/EmploymentSection.tsx` - Employment & business section
- `src/components/forms/AttachmentsSection.tsx` - File upload section
- `src/components/forms/ReviewSection.tsx` - Review before submission

#### Form Utilities

- `src/components/forms/FormField.tsx` - Reusable form field wrapper
- `src/components/forms/FileUpload.tsx` - File upload component
- `src/components/forms/AddressInput.tsx` - Address input with validation
- `src/utils/validation.ts` - Custom validation helpers
- `src/hooks/useFormPersist.tsx` - Form state persistence hook

#### Form API

- `src/services/guarantor.ts` - Form submission service
- API endpoint: `POST /api/guarantor/submit`
- API endpoint: `POST /api/guarantor/upload-attachment`
- API endpoint: `GET /api/guarantor/validate-address`

### Phase 4: Submission History Page

**Files to implement:**

#### History Components

- `src/pages/SubmissionHistory.tsx` - History page with search/filters
- `src/components/history/SubmissionTable.tsx` - Submissions data table
- `src/components/history/SearchFilters.tsx` - Search and filter controls
- `src/components/history/StatusBadge.tsx` - Status indicator component
- `src/components/history/ExportActions.tsx` - Export functionality

#### History API

- `src/services/submissions.ts` - Submissions data service
- API endpoint: `GET /api/submissions/list`
- API endpoint: `GET /api/submissions/search`
- API endpoint: `GET /api/submissions/export`

### Phase 5: Submission Details Page

**Files to implement:**

#### Details Components

- `src/pages/SubmissionDetails.tsx` - Individual submission view
- `src/components/details/GuarantorProfile.tsx` - Guarantor info display
- `src/components/details/SubmissionTimeline.tsx` - Status timeline
- `src/components/details/AttachmentsList.tsx` - Files/documents list
- `src/components/details/ActionButtons.tsx` - Edit/resubmit actions

#### Details API

- API endpoint: `GET /api/submissions/:id`
- API endpoint: `PUT /api/submissions/:id`
- API endpoint: `DELETE /api/submissions/:id`

### Phase 6: Common Components & Utilities

**Files to implement:**

#### Reusable Components

- `src/components/common/LoadingSpinner.tsx` - Loading indicator
- `src/components/common/ErrorBoundary.tsx` - Error handling wrapper
- `src/components/common/ConfirmDialog.tsx` - Confirmation dialogs
- `src/components/common/DataTable.tsx` - Reusable table component

#### Utilities

- `src/utils/formatters.ts` - Data formatting helpers
- `src/utils/constants.ts` - App constants (status codes, etc.)
- `src/utils/storage.ts` - Local storage utilities
- `src/hooks/useDebounce.tsx` - Debounce hook for search
- `src/hooks/useAsync.tsx` - Async operation hook

#### API Configuration

- `src/lib/api.ts` - Axios configuration and interceptors
- `src/lib/queryClient.ts` - TanStack Query setup
- `src/services/auth.ts` - Authentication service (if needed)

### Phase 7: Styling & Theme

**Files to implement:**

#### Custom Styles

- `src/styles/components.css` - Custom component styles
- `src/styles/forms.css` - Form-specific styling
- `src/components/ui/theme-provider.tsx` - Theme context provider

## API Endpoints Required

### Guarantor Management

- `POST /api/guarantor/submit` - Submit new guarantor info
- `PUT /api/guarantor/:id` - Update guarantor info
- `GET /api/guarantor/:id` - Get guarantor details

### Submissions Management

- `GET /api/submissions/list` - List all submissions with pagination
- `GET /api/submissions/search?q=name` - Search submissions
- `GET /api/submissions/:id` - Get submission details
- `PUT /api/submissions/:id/status` - Update submission status
- `DELETE /api/submissions/:id` - Delete submission

### File Management

- `POST /api/attachments/upload` - Upload files
- `GET /api/attachments/:id/download` - Download file
- `DELETE /api/attachments/:id` - Delete attachment

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-submissions` - Get recent submissions

## Data Models

### Guarantor

```typescript
interface Guarantor {
    id: string;
    guarantor_name: string;
    relationship_to_borrower: string;
    address: Address;
    date_of_birth: string;
    occupation: string;
    employer_or_business: string;
    linkedin_profile?: string;
    company_registration_number?: string;
    known_associations: string[];
    comments: string;
    attachments: Attachment[];
}
```

### Submission Metadata

```typescript
interface SubmissionMetadata {
    id: string;
    submission_timestamp: string;
    submitted_by: string;
    record_status: 'pending_verification' | 'verified' | 'rejected';
    last_updated: string;
}
```

## Implementation Order

1. **Phase 1**: Setup layout, routing, and core types
2. **Phase 2**: Dashboard with basic navigation
3. **Phase 3**: Guarantor form (most complex phase)
4. **Phase 4**: Submission history and search
5. **Phase 5**: Individual submission details
6. **Phase 6**: Polish with common components
7. **Phase 7**: Final styling and theme adjustments

## Key Features Per Phase

- **Multi-step form** with validation and persistence
- **File upload** with preview and validation
- **Real-time search** with debouncing
- **Data export** functionality
- **Responsive design** for mobile/desktop
- **Error handling** and loading states
- **Form auto-save** to prevent data loss
