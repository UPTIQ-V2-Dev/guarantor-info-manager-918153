import { mockApiDelay } from '@/lib/utils';
import { api } from '@/lib/api';
import { mockGuarantorSubmissions, mockDashboardStats } from '@/data/mockData';
import type {
    GuarantorSubmission,
    CreateGuarantorInput,
    UpdateGuarantorInput,
    GuarantorListParams,
    GuarantorListResponse,
    DashboardStats,
    FileUploadResponse
} from '@/types/guarantor';

export const guarantorService = {
    // Submit new guarantor information
    submit: async (data: CreateGuarantorInput): Promise<GuarantorSubmission> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: submit guarantor ---', data);
            await mockApiDelay();

            const mockSubmission: GuarantorSubmission = {
                ...data,
                id: Math.random().toString(36).substring(7),
                attachments: [],
                submission_timestamp: new Date().toISOString(),
                submitted_by: 'CurrentUser',
                record_status: 'pending_verification',
                last_updated: new Date().toISOString()
            };

            return mockSubmission;
        }

        const response = await api.post('/api/guarantor/submit', data);
        return response.data;
    },

    // Update existing guarantor information
    update: async (data: UpdateGuarantorInput): Promise<GuarantorSubmission> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: update guarantor ---', data);
            await mockApiDelay();

            const existing = mockGuarantorSubmissions.find(g => g.id === data.id);
            if (!existing) {
                throw new Error('Guarantor not found');
            }

            return {
                ...existing,
                ...data,
                last_updated: new Date().toISOString()
            };
        }

        const response = await api.put(`/api/guarantor/${data.id}`, data);
        return response.data;
    },

    // Get guarantor by ID
    getById: async (id: string): Promise<GuarantorSubmission> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: get guarantor by id ---', id);
            await mockApiDelay();

            const guarantor = mockGuarantorSubmissions.find(g => g.id === id);
            if (!guarantor) {
                throw new Error('Guarantor not found');
            }

            return guarantor;
        }

        const response = await api.get(`/api/guarantor/${id}`);
        return response.data;
    },

    // Get list of guarantor submissions with filters
    getList: async (params: GuarantorListParams = {}): Promise<GuarantorListResponse> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: get guarantor list ---', params);
            await mockApiDelay();

            let filteredData = [...mockGuarantorSubmissions];

            // Apply search filter
            if (params.search) {
                const searchLower = params.search.toLowerCase();
                filteredData = filteredData.filter(
                    g =>
                        g.guarantor_name.toLowerCase().includes(searchLower) ||
                        g.relationship_to_borrower.toLowerCase().includes(searchLower) ||
                        g.occupation.toLowerCase().includes(searchLower)
                );
            }

            // Apply status filter
            if (params.status) {
                filteredData = filteredData.filter(g => g.record_status === params.status);
            }

            // Apply pagination
            const page = params.page || 1;
            const limit = params.limit || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedData = filteredData.slice(startIndex, endIndex);

            return {
                data: paginatedData,
                total: filteredData.length,
                page,
                limit
            };
        }

        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.submitted_by) queryParams.append('submitted_by', params.submitted_by);

        const response = await api.get(`/api/submissions/list?${queryParams.toString()}`);
        return response.data;
    },

    // Delete guarantor submission
    delete: async (id: string): Promise<void> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: delete guarantor ---', id);
            await mockApiDelay();
            return;
        }

        await api.delete(`/api/submissions/${id}`);
    },

    // Upload attachment
    uploadAttachment: async (file: File, guarantorId?: string): Promise<FileUploadResponse> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: upload attachment ---', file.name, guarantorId);
            await mockApiDelay();

            return {
                id: Math.random().toString(36).substring(7),
                filename: file.name,
                url: `https://example.com/files/${file.name}`,
                fileType: file.type,
                fileSize: file.size
            };
        }

        const formData = new FormData();
        formData.append('file', file);
        if (guarantorId) {
            formData.append('guarantorId', guarantorId);
        }

        const response = await api.post('/api/attachments/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    },

    // Get dashboard statistics
    getDashboardStats: async (): Promise<DashboardStats> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: get dashboard stats ---');
            await mockApiDelay();
            return mockDashboardStats;
        }

        const response = await api.get('/api/dashboard/stats');
        return response.data;
    }
};
