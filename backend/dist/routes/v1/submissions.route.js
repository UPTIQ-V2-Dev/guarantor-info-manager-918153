import { guarantorSubmissionController } from "../../controllers/index.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { guarantorSubmissionValidation } from "../../validations/index.js";
import express from 'express';
const router = express.Router();
// GET /api/submissions/list
router.get('/list', auth('getGuarantors'), validate(guarantorSubmissionValidation.getGuarantorSubmissions), guarantorSubmissionController.getGuarantorSubmissions);
// DELETE /api/submissions/:id
router.delete('/:id', auth('manageGuarantors'), validate(guarantorSubmissionValidation.deleteGuarantorSubmission), guarantorSubmissionController.deleteGuarantorSubmission);
export default router;
/**
 * @swagger
 * tags:
 *   name: Submissions
 *   description: Guarantor submission list management
 */
/**
 * @swagger
 * /api/submissions/list:
 *   get:
 *     summary: Get paginated list of guarantor submissions with filters
 *     description: Retrieve all guarantor submissions with optional filters and pagination
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page (default 10)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for guarantor name, occupation, or employer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending_verification, verified, rejected]
 *         description: Filter by record status
 *       - in: query
 *         name: submitted_by
 *         schema:
 *           type: string
 *         description: Filter by submitter name
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GuarantorSubmission'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "422":
 *         $ref: '#/components/responses/ValidationError'
 */
/**
 * @swagger
 * /api/submissions/{id}:
 *   delete:
 *     summary: Delete guarantor submission by ID
 *     description: Remove a guarantor submission from the system
 *     tags: [Submissions]
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
 *       "204":
 *         description: No Content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
