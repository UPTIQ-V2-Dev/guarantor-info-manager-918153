import { guarantorSubmissionController } from '../../controllers/index.ts';
import auth from '../../middlewares/auth.ts';
import validate from '../../middlewares/validate.ts';
import { guarantorSubmissionValidation } from '../../validations/index.ts';
import express from 'express';

const router = express.Router();

// POST /api/guarantor/submit
router.post(
    '/submit',
    auth('manageGuarantors'),
    validate(guarantorSubmissionValidation.createGuarantorSubmission),
    guarantorSubmissionController.createGuarantorSubmission
);

// PUT /api/guarantor/:id
router.put(
    '/:id',
    auth('manageGuarantors'),
    validate(guarantorSubmissionValidation.updateGuarantorSubmission),
    guarantorSubmissionController.updateGuarantorSubmission
);

// GET /api/guarantor/:id
router.get(
    '/:id',
    auth('getGuarantors'),
    validate(guarantorSubmissionValidation.getGuarantorSubmission),
    guarantorSubmissionController.getGuarantorSubmission
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Guarantor
 *   description: Guarantor submission management
 */

/**
 * @swagger
 * /api/guarantor/submit:
 *   post:
 *     summary: Submit new guarantor information
 *     description: Create a new guarantor submission
 *     tags: [Guarantor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guarantor_name
 *               - relationship_to_borrower
 *               - address
 *               - date_of_birth
 *               - occupation
 *               - employer_or_business
 *               - known_associations
 *               - comments
 *             properties:
 *               guarantor_name:
 *                 type: string
 *               relationship_to_borrower:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zip:
 *                     type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               occupation:
 *                 type: string
 *               employer_or_business:
 *                 type: string
 *               linkedin_profile:
 *                 type: string
 *               company_registration_number:
 *                 type: string
 *               known_associations:
 *                 type: array
 *                 items:
 *                   type: string
 *               comments:
 *                 type: string
 *             example:
 *               guarantor_name: "John Smith"
 *               relationship_to_borrower: "Business partner"
 *               address:
 *                 street: "123 Main St"
 *                 city: "New York"
 *                 state: "NY"
 *                 zip: "10001"
 *               date_of_birth: "1980-01-01"
 *               occupation: "Engineer"
 *               employer_or_business: "Tech Corp"
 *               linkedin_profile: "https://linkedin.com/in/johnsmith"
 *               company_registration_number: ""
 *               known_associations: ["Tech Association"]
 *               comments: "Reliable guarantor"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuarantorSubmission'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "422":
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/guarantor/{id}:
 *   get:
 *     summary: Get guarantor submission by ID
 *     description: Retrieve a specific guarantor submission
 *     tags: [Guarantor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guarantor submission ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuarantorSubmission'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update existing guarantor information
 *     description: Update a guarantor submission
 *     tags: [Guarantor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guarantor submission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guarantor_name:
 *                 type: string
 *               relationship_to_borrower:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zip:
 *                     type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               occupation:
 *                 type: string
 *               employer_or_business:
 *                 type: string
 *               linkedin_profile:
 *                 type: string
 *               company_registration_number:
 *                 type: string
 *               known_associations:
 *                 type: array
 *                 items:
 *                   type: string
 *               comments:
 *                 type: string
 *             example:
 *               comments: "Updated comments"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuarantorSubmission'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "422":
 *         $ref: '#/components/responses/ValidationError'
 */
