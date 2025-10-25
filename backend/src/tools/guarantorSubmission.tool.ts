import { guarantorSubmissionService } from '../services/index.ts';
import { MCPTool } from '../types/mcp.ts';
import pick from '../utils/pick.ts';
import { z } from 'zod';

// Reusable schemas
const attachmentSchema = z.object({
    id: z.string(),
    filename: z.string(),
    url: z.string().nullable(),
    fileType: z.string(),
    fileSize: z.number()
});

const guarantorSubmissionSchema = z.object({
    id: z.string(),
    guarantorName: z.string(),
    relationshipToBorrower: z.string(),
    streetAddress: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    dateOfBirth: z.string(),
    occupation: z.string(),
    employerOrBusiness: z.string(),
    linkedinProfile: z.string().nullable(),
    companyRegistrationNumber: z.string().nullable(),
    knownAssociations: z.array(z.string()),
    comments: z.string(),
    submissionTimestamp: z.string(),
    recordStatus: z.string(),
    lastUpdated: z.string(),
    attachments: z.array(attachmentSchema)
});

const createGuarantorSubmissionTool: MCPTool = {
    id: 'guarantor_create',
    name: 'Create Guarantor Submission',
    description: 'Create a new guarantor submission with all required information',
    inputSchema: z.object({
        guarantorName: z.string().min(1),
        relationshipToBorrower: z.string().min(1),
        streetAddress: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        zip: z.string().min(1),
        dateOfBirth: z.string().transform(str => new Date(str)),
        occupation: z.string().min(1),
        employerOrBusiness: z.string().min(1),
        linkedinProfile: z.string().optional(),
        companyRegistrationNumber: z.string().optional(),
        knownAssociations: z.array(z.string()),
        comments: z.string().min(1),
        userId: z.number().int() // ID of the user creating the submission
    }),
    outputSchema: guarantorSubmissionSchema,
    fn: async inputs => {
        const submissionData = {
            guarantorName: inputs.guarantorName,
            relationshipToBorrower: inputs.relationshipToBorrower,
            streetAddress: inputs.streetAddress,
            city: inputs.city,
            state: inputs.state,
            zip: inputs.zip,
            dateOfBirth: inputs.dateOfBirth,
            occupation: inputs.occupation,
            employerOrBusiness: inputs.employerOrBusiness,
            linkedinProfile: inputs.linkedinProfile,
            companyRegistrationNumber: inputs.companyRegistrationNumber,
            knownAssociations: inputs.knownAssociations,
            comments: inputs.comments
        };

        const result = await guarantorSubmissionService.createGuarantorSubmission(submissionData, inputs.userId);

        return {
            ...result,
            dateOfBirth: result.dateOfBirth.toISOString(),
            submissionTimestamp: result.submissionTimestamp.toISOString(),
            lastUpdated: result.lastUpdated.toISOString()
        };
    }
};

const getGuarantorSubmissionsTool: MCPTool = {
    id: 'guarantor_list',
    name: 'Get Guarantor Submissions',
    description: 'Get a paginated list of guarantor submissions with optional filters',
    inputSchema: z.object({
        page: z.number().int().min(1).optional(),
        limit: z.number().int().min(1).max(100).optional(),
        search: z.string().optional(),
        status: z.string().optional(),
        submittedBy: z.string().optional(),
        sortBy: z.string().optional(),
        sortType: z.enum(['asc', 'desc']).optional()
    }),
    outputSchema: z.object({
        data: z.array(guarantorSubmissionSchema),
        total: z.number(),
        page: z.number(),
        limit: z.number()
    }),
    fn: async inputs => {
        const filter = {};
        const options = pick(inputs, ['page', 'limit', 'search', 'status', 'submittedBy', 'sortBy', 'sortType']);

        const result = await guarantorSubmissionService.queryGuarantorSubmissions(filter, options);

        return {
            ...result,
            data: result.data.map(submission => ({
                ...submission,
                dateOfBirth: submission.dateOfBirth.toISOString(),
                submissionTimestamp: submission.submissionTimestamp.toISOString(),
                lastUpdated: submission.lastUpdated.toISOString()
            }))
        };
    }
};

const getGuarantorSubmissionTool: MCPTool = {
    id: 'guarantor_get_by_id',
    name: 'Get Guarantor Submission By ID',
    description: 'Get a specific guarantor submission by its ID',
    inputSchema: z.object({
        id: z.string().uuid()
    }),
    outputSchema: guarantorSubmissionSchema,
    fn: async inputs => {
        const submission = await guarantorSubmissionService.getGuarantorSubmissionById(inputs.id);
        if (!submission) {
            throw new Error('Guarantor submission not found');
        }

        return {
            ...submission,
            dateOfBirth: submission.dateOfBirth.toISOString(),
            submissionTimestamp: submission.submissionTimestamp.toISOString(),
            lastUpdated: submission.lastUpdated.toISOString()
        };
    }
};

const updateGuarantorSubmissionTool: MCPTool = {
    id: 'guarantor_update',
    name: 'Update Guarantor Submission',
    description: 'Update an existing guarantor submission',
    inputSchema: z.object({
        id: z.string().uuid(),
        guarantorName: z.string().min(1).optional(),
        relationshipToBorrower: z.string().min(1).optional(),
        streetAddress: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        state: z.string().min(1).optional(),
        zip: z.string().min(1).optional(),
        dateOfBirth: z
            .string()
            .transform(str => new Date(str))
            .optional(),
        occupation: z.string().min(1).optional(),
        employerOrBusiness: z.string().min(1).optional(),
        linkedinProfile: z.string().optional(),
        companyRegistrationNumber: z.string().optional(),
        knownAssociations: z.array(z.string()).optional(),
        comments: z.string().min(1).optional()
    }),
    outputSchema: guarantorSubmissionSchema,
    fn: async inputs => {
        const updateBody = pick(inputs, [
            'guarantorName',
            'relationshipToBorrower',
            'streetAddress',
            'city',
            'state',
            'zip',
            'dateOfBirth',
            'occupation',
            'employerOrBusiness',
            'linkedinProfile',
            'companyRegistrationNumber',
            'knownAssociations',
            'comments'
        ]);

        const result = await guarantorSubmissionService.updateGuarantorSubmissionById(inputs.id, updateBody);

        if (!result) {
            throw new Error('Guarantor submission not found');
        }

        return {
            ...result,
            dateOfBirth: result.dateOfBirth.toISOString(),
            submissionTimestamp: result.submissionTimestamp.toISOString(),
            lastUpdated: result.lastUpdated.toISOString()
        };
    }
};

const deleteGuarantorSubmissionTool: MCPTool = {
    id: 'guarantor_delete',
    name: 'Delete Guarantor Submission',
    description: 'Delete a guarantor submission by its ID',
    inputSchema: z.object({
        id: z.string().uuid()
    }),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string()
    }),
    fn: async inputs => {
        await guarantorSubmissionService.deleteGuarantorSubmissionById(inputs.id);
        return {
            success: true,
            message: 'Guarantor submission deleted successfully'
        };
    }
};

const createAttachmentTool: MCPTool = {
    id: 'guarantor_attachment_create',
    name: 'Create Attachment',
    description: 'Create an attachment for a guarantor submission',
    inputSchema: z.object({
        filename: z.string().min(1),
        fileType: z.string().min(1),
        fileSize: z.number().int().min(1),
        url: z.string().url().optional(),
        guarantorSubmissionId: z.string().uuid()
    }),
    outputSchema: attachmentSchema,
    fn: async inputs => {
        const attachment = await guarantorSubmissionService.createAttachment(inputs);
        return attachment;
    }
};

const getDashboardStatsTool: MCPTool = {
    id: 'guarantor_dashboard_stats',
    name: 'Get Dashboard Statistics',
    description: 'Get dashboard statistics for guarantor submissions including totals by status and recent submissions',
    inputSchema: z.object({}),
    outputSchema: z.object({
        total_submissions: z.number(),
        pending_verification: z.number(),
        verified: z.number(),
        rejected: z.number(),
        recent_submissions: z.array(
            z.object({
                id: z.string(),
                guarantorName: z.string(),
                relationshipToBorrower: z.string(),
                recordStatus: z.string(),
                submissionTimestamp: z.string(),
                submittedBy: z.object({
                    name: z.string().nullable()
                })
            })
        )
    }),
    fn: async () => {
        const stats = await guarantorSubmissionService.getDashboardStats();

        return {
            ...stats,
            recent_submissions: stats.recent_submissions.map(submission => ({
                ...submission,
                submissionTimestamp: submission.submissionTimestamp.toISOString()
            }))
        };
    }
};

export const guarantorSubmissionTools: MCPTool[] = [
    createGuarantorSubmissionTool,
    getGuarantorSubmissionsTool,
    getGuarantorSubmissionTool,
    updateGuarantorSubmissionTool,
    deleteGuarantorSubmissionTool,
    createAttachmentTool,
    getDashboardStatsTool
];
