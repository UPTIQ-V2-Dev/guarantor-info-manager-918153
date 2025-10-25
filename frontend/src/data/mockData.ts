import type { PaginatedResponse } from '@/types/api';
import type { AuthResponse, User } from '@/types/user';
import type { GuarantorSubmission, DashboardStats, GuarantorListResponse } from '@/types/guarantor';

export const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    name: 'John Doe',
    role: 'USER',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockAdminUser: User = {
    id: 2,
    email: 'admin@example.com',
    name: 'Jane Smith',
    role: 'ADMIN',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockUsers: User[] = [mockUser, mockAdminUser];

export const mockAuthResponse: AuthResponse = {
    user: mockUser,
    tokens: {
        access: {
            token: 'mock-access-token',
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        },
        refresh: {
            token: 'mock-refresh-token',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    }
};

export const mockPaginatedUsers: PaginatedResponse<User> = {
    results: mockUsers,
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 2
};

// Mock guarantor submissions
export const mockGuarantorSubmissions: GuarantorSubmission[] = [
    {
        id: '1',
        guarantor_name: 'Michael R. Davis',
        relationship_to_borrower: 'Personal guarantor for BlueRock Holdings LLC',
        address: {
            street: '123 Main Street',
            city: 'Phoenix',
            state: 'AZ',
            zip: '85001'
        },
        date_of_birth: '1978-03-22',
        occupation: 'Real Estate Investor',
        employer_or_business: 'Davis Capital Group',
        linkedin_profile: 'https://www.linkedin.com/in/michaeldavis',
        company_registration_number: 'AZ-LLC-2018-001234',
        known_associations: ['Phoenix Real Estate Association'],
        comments: "Primary contact for borrower's credit line renewal.",
        attachments: [
            {
                id: '1',
                filename: 'michael_davis_id.pdf',
                fileType: 'application/pdf',
                fileSize: 1024000,
                uploadedAt: '2025-10-20T10:30:00Z'
            }
        ],
        submission_timestamp: '2025-10-21T10:30:00Z',
        submitted_by: 'LoanOfficer123',
        record_status: 'pending_verification',
        last_updated: '2025-10-21T10:30:00Z'
    },
    {
        id: '2',
        guarantor_name: 'Sarah Johnson',
        relationship_to_borrower: 'Business partner and co-guarantor',
        address: {
            street: '456 Oak Avenue',
            city: 'Denver',
            state: 'CO',
            zip: '80202'
        },
        date_of_birth: '1985-07-15',
        occupation: 'Software Engineer',
        employer_or_business: 'TechCorp Inc.',
        linkedin_profile: 'https://www.linkedin.com/in/sarahjohnson',
        company_registration_number: '',
        known_associations: ['Denver Business Alliance', 'Colorado Tech Association'],
        comments: 'High net worth individual with strong credit history.',
        attachments: [
            {
                id: '2',
                filename: 'sarah_johnson_id.pdf',
                fileType: 'application/pdf',
                fileSize: 850000,
                uploadedAt: '2025-10-19T14:15:00Z'
            }
        ],
        submission_timestamp: '2025-10-19T14:15:00Z',
        submitted_by: 'LoanOfficer456',
        record_status: 'verified',
        last_updated: '2025-10-20T09:45:00Z'
    },
    {
        id: '3',
        guarantor_name: 'Robert Chen',
        relationship_to_borrower: 'Family member (brother-in-law)',
        address: {
            street: '789 Pine Street',
            city: 'Seattle',
            state: 'WA',
            zip: '98101'
        },
        date_of_birth: '1982-11-08',
        occupation: 'Medical Doctor',
        employer_or_business: 'Seattle General Hospital',
        linkedin_profile: '',
        company_registration_number: '',
        known_associations: ['American Medical Association'],
        comments: 'Stable employment, excellent credit score.',
        attachments: [],
        submission_timestamp: '2025-10-18T16:20:00Z',
        submitted_by: 'LoanOfficer789',
        record_status: 'rejected',
        last_updated: '2025-10-19T11:30:00Z'
    }
];

export const mockDashboardStats: DashboardStats = {
    total_submissions: 15,
    pending_verification: 8,
    verified: 5,
    rejected: 2,
    recent_submissions: mockGuarantorSubmissions.slice(0, 3)
};

export const mockGuarantorListResponse: GuarantorListResponse = {
    data: mockGuarantorSubmissions,
    total: 3,
    page: 1,
    limit: 10
};
