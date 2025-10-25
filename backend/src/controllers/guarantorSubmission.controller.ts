import { guarantorSubmissionService } from '../services/index.ts';
import ApiError from '../utils/ApiError.ts';
import catchAsyncWithAuth from '../utils/catchAsyncWithAuth.ts';
import pick from '../utils/pick.ts';
import httpStatus from 'http-status';

const createGuarantorSubmission = catchAsyncWithAuth(async (req, res) => {
    const {
        guarantor_name,
        relationship_to_borrower,
        address,
        date_of_birth,
        occupation,
        employer_or_business,
        linkedin_profile,
        company_registration_number,
        known_associations,
        comments
    } = req.body;

    const submissionData = {
        guarantorName: guarantor_name,
        relationshipToBorrower: relationship_to_borrower,
        streetAddress: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        dateOfBirth: new Date(date_of_birth),
        occupation,
        employerOrBusiness: employer_or_business,
        linkedinProfile: linkedin_profile || undefined,
        companyRegistrationNumber: company_registration_number || undefined,
        knownAssociations: known_associations,
        comments
    };

    const submission = await guarantorSubmissionService.createGuarantorSubmission(submissionData, req.user.id);

    // Transform response to match API specification
    const response = {
        id: submission.id,
        guarantor_name: submission.guarantorName,
        relationship_to_borrower: submission.relationshipToBorrower,
        address: {
            street: submission.streetAddress,
            city: submission.city,
            state: submission.state,
            zip: submission.zip
        },
        date_of_birth: submission.dateOfBirth.toISOString().split('T')[0],
        occupation: submission.occupation,
        employer_or_business: submission.employerOrBusiness,
        linkedin_profile: submission.linkedinProfile || '',
        company_registration_number: submission.companyRegistrationNumber || '',
        known_associations: submission.knownAssociations,
        comments: submission.comments,
        attachments: submission.attachments.map(att => ({
            id: att.id,
            filename: att.filename,
            url: att.url,
            fileType: att.fileType,
            fileSize: att.fileSize
        })),
        submission_timestamp: submission.submissionTimestamp.toISOString(),
        submitted_by: req.user.name || 'Unknown',
        record_status: submission.recordStatus,
        last_updated: submission.lastUpdated.toISOString()
    };

    res.status(httpStatus.CREATED).send(response);
});

const getGuarantorSubmissions = catchAsyncWithAuth(async (req, res) => {
    const filter = {};
    const options = pick(req.validatedQuery, [
        'page',
        'limit',
        'search',
        'status',
        'submitted_by',
        'sortBy',
        'sortType'
    ]);

    const result = await guarantorSubmissionService.queryGuarantorSubmissions(filter, options);

    // Transform response to match API specification
    const response = {
        data: result.data.map(submission => ({
            id: submission.id,
            guarantor_name: submission.guarantorName,
            relationship_to_borrower: submission.relationshipToBorrower,
            address: {
                street: submission.streetAddress,
                city: submission.city,
                state: submission.state,
                zip: submission.zip
            },
            date_of_birth: submission.dateOfBirth.toISOString().split('T')[0],
            occupation: submission.occupation,
            employer_or_business: submission.employerOrBusiness,
            linkedin_profile: submission.linkedinProfile || '',
            company_registration_number: submission.companyRegistrationNumber || '',
            known_associations: submission.knownAssociations,
            comments: submission.comments,
            attachments: submission.attachments.map(att => ({
                id: att.id,
                filename: att.filename,
                url: att.url,
                fileType: att.fileType,
                fileSize: att.fileSize
            })),
            submission_timestamp: submission.submissionTimestamp.toISOString(),
            submitted_by: 'CurrentUser', // This would need to be populated from the relation
            record_status: submission.recordStatus,
            last_updated: submission.lastUpdated.toISOString()
        })),
        total: result.total,
        page: result.page,
        limit: result.limit
    };

    res.send(response);
});

const getGuarantorSubmission = catchAsyncWithAuth(async (req, res) => {
    const submission = await guarantorSubmissionService.getGuarantorSubmissionById(req.params.id);
    if (!submission) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Guarantor not found');
    }

    // Transform response to match API specification
    const response = {
        id: submission.id,
        guarantor_name: submission.guarantorName,
        relationship_to_borrower: submission.relationshipToBorrower,
        address: {
            street: submission.streetAddress,
            city: submission.city,
            state: submission.state,
            zip: submission.zip
        },
        date_of_birth: submission.dateOfBirth.toISOString().split('T')[0],
        occupation: submission.occupation,
        employer_or_business: submission.employerOrBusiness,
        linkedin_profile: submission.linkedinProfile || '',
        company_registration_number: submission.companyRegistrationNumber || '',
        known_associations: submission.knownAssociations,
        comments: submission.comments,
        attachments: submission.attachments.map(att => ({
            id: att.id,
            filename: att.filename,
            url: att.url,
            fileType: att.fileType,
            fileSize: att.fileSize
        })),
        submission_timestamp: submission.submissionTimestamp.toISOString(),
        submitted_by: 'CurrentUser', // This would need to be populated from the relation
        record_status: submission.recordStatus,
        last_updated: submission.lastUpdated.toISOString()
    };

    res.send(response);
});

const updateGuarantorSubmission = catchAsyncWithAuth(async (req, res) => {
    const updateData: any = {};

    // Transform incoming data to database field names
    if (req.body.guarantor_name) updateData.guarantorName = req.body.guarantor_name;
    if (req.body.relationship_to_borrower) updateData.relationshipToBorrower = req.body.relationship_to_borrower;
    if (req.body.address) {
        if (req.body.address.street) updateData.streetAddress = req.body.address.street;
        if (req.body.address.city) updateData.city = req.body.address.city;
        if (req.body.address.state) updateData.state = req.body.address.state;
        if (req.body.address.zip) updateData.zip = req.body.address.zip;
    }
    if (req.body.date_of_birth) updateData.dateOfBirth = new Date(req.body.date_of_birth);
    if (req.body.occupation) updateData.occupation = req.body.occupation;
    if (req.body.employer_or_business) updateData.employerOrBusiness = req.body.employer_or_business;
    if (req.body.linkedin_profile !== undefined) updateData.linkedinProfile = req.body.linkedin_profile || null;
    if (req.body.company_registration_number !== undefined)
        updateData.companyRegistrationNumber = req.body.company_registration_number || null;
    if (req.body.known_associations) updateData.knownAssociations = req.body.known_associations;
    if (req.body.comments) updateData.comments = req.body.comments;

    const submission = await guarantorSubmissionService.updateGuarantorSubmissionById(req.params.id, updateData);

    if (!submission) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Guarantor submission not found');
    }

    // Transform response to match API specification
    const response = {
        id: submission.id,
        guarantor_name: submission.guarantorName,
        relationship_to_borrower: submission.relationshipToBorrower,
        address: {
            street: submission.streetAddress,
            city: submission.city,
            state: submission.state,
            zip: submission.zip
        },
        date_of_birth: submission.dateOfBirth.toISOString().split('T')[0],
        occupation: submission.occupation,
        employer_or_business: submission.employerOrBusiness,
        linkedin_profile: submission.linkedinProfile || '',
        company_registration_number: submission.companyRegistrationNumber || '',
        known_associations: submission.knownAssociations,
        comments: submission.comments,
        attachments: submission.attachments.map(att => ({
            id: att.id,
            filename: att.filename,
            url: att.url,
            fileType: att.fileType,
            fileSize: att.fileSize
        })),
        submission_timestamp: submission.submissionTimestamp.toISOString(),
        submitted_by: 'CurrentUser', // This would need to be populated from the relation
        record_status: submission.recordStatus,
        last_updated: submission.lastUpdated.toISOString()
    };

    res.send(response);
});

const deleteGuarantorSubmission = catchAsyncWithAuth(async (req, res) => {
    await guarantorSubmissionService.deleteGuarantorSubmissionById(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
});

const uploadAttachment = catchAsyncWithAuth(async (req, res) => {
    // This is a simplified mock implementation - in a real app, you'd handle file upload
    // through middleware like multer and upload to cloud storage

    const guarantorId = req.body.guarantorId;
    if (!guarantorId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'GuarantorId is required');
    }

    // Mock file processing - in reality you'd upload to S3/Azure/GCS and validate file
    // For now, we'll create a mock attachment record
    const attachmentData = {
        filename: 'mock-document.pdf',
        fileType: 'application/pdf',
        fileSize: 1024000,
        url: `https://storage.example.com/files/${guarantorId}/mock-document.pdf`,
        guarantorSubmissionId: guarantorId
    };

    const attachment = await guarantorSubmissionService.createAttachment(attachmentData);

    const response = {
        id: attachment.id,
        filename: attachment.filename,
        url: attachment.url,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize
    };

    res.status(httpStatus.CREATED).send(response);
});

const getDashboardStats = catchAsyncWithAuth(async (req, res) => {
    const stats = await guarantorSubmissionService.getDashboardStats();

    // Transform recent submissions to match API specification
    const response = {
        total_submissions: stats.total_submissions,
        pending_verification: stats.pending_verification,
        verified: stats.verified,
        rejected: stats.rejected,
        recent_submissions: stats.recent_submissions.map(submission => ({
            id: submission.id,
            guarantor_name: submission.guarantorName,
            relationship_to_borrower: submission.relationshipToBorrower,
            record_status: submission.recordStatus,
            submission_timestamp: submission.submissionTimestamp.toISOString(),
            submitted_by: submission.submittedBy.name || 'Unknown'
        }))
    };

    res.send(response);
});

export default {
    createGuarantorSubmission,
    getGuarantorSubmissions,
    getGuarantorSubmission,
    updateGuarantorSubmission,
    deleteGuarantorSubmission,
    uploadAttachment,
    getDashboardStats
};
