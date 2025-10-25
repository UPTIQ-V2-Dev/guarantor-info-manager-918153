import prisma from "../client.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from 'http-status';
/**
 * Create a guarantor submission
 * @param {Object} submissionBody
 * @param {number} userId
 * @returns {Promise<GuarantorSubmission & { attachments: Attachment[] }>}
 */
const createGuarantorSubmission = async (submissionData, userId) => {
    return await prisma.guarantorSubmission.create({
        data: {
            ...submissionData,
            submittedById: userId
        },
        include: {
            attachments: true
        }
    });
};
/**
 * Query for guarantor submissions
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @returns {Promise<{data: GuarantorSubmission[], total: number, page: number, limit: number}>}
 */
const queryGuarantorSubmissions = async (filter, options) => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy ?? 'submissionTimestamp';
    const sortType = options.sortType ?? 'desc';
    // Build the where clause
    const whereClause = {
        ...filter,
        ...(options.search && {
            OR: [
                { guarantorName: { contains: options.search, mode: 'insensitive' } },
                { relationshipToBorrower: { contains: options.search, mode: 'insensitive' } },
                { occupation: { contains: options.search, mode: 'insensitive' } },
                { employerOrBusiness: { contains: options.search, mode: 'insensitive' } }
            ]
        }),
        ...(options.status && { recordStatus: options.status }),
        ...(options.submittedBy && {
            submittedBy: { name: { contains: options.submittedBy, mode: 'insensitive' } }
        })
    };
    const [submissions, total] = await Promise.all([
        prisma.guarantorSubmission.findMany({
            where: whereClause,
            include: {
                attachments: true
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { [sortBy]: sortType }
        }),
        prisma.guarantorSubmission.count({ where: whereClause })
    ]);
    return {
        data: submissions,
        total,
        page,
        limit
    };
};
/**
 * Get guarantor submission by id
 * @param {string} id
 * @returns {Promise<GuarantorSubmission & { attachments: Attachment[] } | null>}
 */
const getGuarantorSubmissionById = async (id) => {
    return await prisma.guarantorSubmission.findUnique({
        where: { id },
        include: {
            attachments: true
        }
    });
};
/**
 * Update guarantor submission by id
 * @param {string} submissionId
 * @param {Object} updateBody
 * @returns {Promise<GuarantorSubmission & { attachments: Attachment[] }>}
 */
const updateGuarantorSubmissionById = async (submissionId, updateBody) => {
    const submission = await getGuarantorSubmissionById(submissionId);
    if (!submission) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Guarantor submission not found');
    }
    return prisma.guarantorSubmission.update({
        where: { id: submissionId },
        data: updateBody,
        include: {
            attachments: true
        }
    });
};
/**
 * Delete guarantor submission by id
 * @param {string} submissionId
 * @returns {Promise<GuarantorSubmission>}
 */
const deleteGuarantorSubmissionById = async (submissionId) => {
    const submission = await getGuarantorSubmissionById(submissionId);
    if (!submission) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Guarantor submission not found');
    }
    // Delete associated attachments first
    await prisma.attachment.deleteMany({
        where: { guarantorSubmissionId: submissionId }
    });
    return prisma.guarantorSubmission.delete({
        where: { id: submissionId }
    });
};
/**
 * Create attachment for guarantor submission
 * @param {Object} attachmentData
 * @returns {Promise<Attachment>}
 */
const createAttachment = async (attachmentData) => {
    // Verify the guarantor submission exists
    const submission = await getGuarantorSubmissionById(attachmentData.guarantorSubmissionId);
    if (!submission) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Guarantor submission not found');
    }
    return prisma.attachment.create({
        data: attachmentData
    });
};
/**
 * Get dashboard statistics
 * @returns {Promise<Object>}
 */
const getDashboardStats = async () => {
    const [totalSubmissions, pendingVerification, verified, rejected, recentSubmissions] = await Promise.all([
        prisma.guarantorSubmission.count(),
        prisma.guarantorSubmission.count({
            where: { recordStatus: 'pending_verification' }
        }),
        prisma.guarantorSubmission.count({
            where: { recordStatus: 'verified' }
        }),
        prisma.guarantorSubmission.count({
            where: { recordStatus: 'rejected' }
        }),
        prisma.guarantorSubmission.findMany({
            include: {
                submittedBy: {
                    select: { name: true }
                }
            },
            orderBy: { submissionTimestamp: 'desc' },
            take: 5
        })
    ]);
    return {
        total_submissions: totalSubmissions,
        pending_verification: pendingVerification,
        verified,
        rejected,
        recent_submissions: recentSubmissions
    };
};
export default {
    createGuarantorSubmission,
    queryGuarantorSubmissions,
    getGuarantorSubmissionById,
    updateGuarantorSubmissionById,
    deleteGuarantorSubmissionById,
    createAttachment,
    getDashboardStats
};
