export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface Attachment {
    id: string;
    filename: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
    url?: string;
}

export interface Guarantor {
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

export interface SubmissionMetadata {
    id: string;
    submission_timestamp: string;
    submitted_by: string;
    record_status: 'pending_verification' | 'verified' | 'rejected';
    last_updated: string;
}

export interface GuarantorSubmission extends Guarantor, SubmissionMetadata {}

// Form data types
export interface CreateGuarantorInput {
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
}

export interface UpdateGuarantorInput extends Partial<CreateGuarantorInput> {
    id: string;
}

// API request/response types
export interface GuarantorListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    submitted_by?: string;
}

export interface GuarantorListResponse {
    data: GuarantorSubmission[];
    total: number;
    page: number;
    limit: number;
}

export interface DashboardStats {
    total_submissions: number;
    pending_verification: number;
    verified: number;
    rejected: number;
    recent_submissions: GuarantorSubmission[];
}

export interface FileUploadResponse {
    id: string;
    filename: string;
    url: string;
    fileType: string;
    fileSize: number;
}
