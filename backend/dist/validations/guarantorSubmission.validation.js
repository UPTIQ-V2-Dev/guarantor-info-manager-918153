import Joi from 'joi';
const createGuarantorSubmission = {
    body: Joi.object().keys({
        guarantor_name: Joi.string().required(),
        relationship_to_borrower: Joi.string().required(),
        address: Joi.object()
            .keys({
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zip: Joi.string().required()
        })
            .required(),
        date_of_birth: Joi.string().isoDate().required(),
        occupation: Joi.string().required(),
        employer_or_business: Joi.string().required(),
        linkedin_profile: Joi.string().uri().allow(''),
        company_registration_number: Joi.string().allow(''),
        known_associations: Joi.array().items(Joi.string()).required(),
        comments: Joi.string().required()
    })
};
const getGuarantorSubmissions = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        search: Joi.string(),
        status: Joi.string().valid('pending_verification', 'verified', 'rejected'),
        submitted_by: Joi.string(),
        sortBy: Joi.string().default('submissionTimestamp'),
        sortType: Joi.string().valid('asc', 'desc').default('desc')
    })
};
const getGuarantorSubmission = {
    params: Joi.object().keys({
        id: Joi.string().uuid().required()
    })
};
const updateGuarantorSubmission = {
    params: Joi.object().keys({
        id: Joi.string().uuid().required()
    }),
    body: Joi.object()
        .keys({
        guarantor_name: Joi.string(),
        relationship_to_borrower: Joi.string(),
        address: Joi.object().keys({
            street: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            zip: Joi.string()
        }),
        date_of_birth: Joi.string().isoDate(),
        occupation: Joi.string(),
        employer_or_business: Joi.string(),
        linkedin_profile: Joi.string().uri().allow(''),
        company_registration_number: Joi.string().allow(''),
        known_associations: Joi.array().items(Joi.string()),
        comments: Joi.string()
    })
        .min(1)
};
const deleteGuarantorSubmission = {
    params: Joi.object().keys({
        id: Joi.string().uuid().required()
    })
};
const uploadAttachment = {
    body: Joi.object().keys({
        guarantorId: Joi.string().uuid()
    })
};
export default {
    createGuarantorSubmission,
    getGuarantorSubmissions,
    getGuarantorSubmission,
    updateGuarantorSubmission,
    deleteGuarantorSubmission,
    uploadAttachment
};
