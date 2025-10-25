import { guarantorSubmissionController } from "../../controllers/index.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { guarantorSubmissionValidation } from "../../validations/index.js";
import express from 'express';
const router = express.Router();
// POST /api/attachments/upload
router.post('/upload', auth('manageGuarantors'), validate(guarantorSubmissionValidation.uploadAttachment), guarantorSubmissionController.uploadAttachment);
export default router;
/**
 * @swagger
 * tags:
 *   name: Attachments
 *   description: File attachment management
 */
/**
 * @swagger
 * /api/attachments/upload:
 *   post:
 *     summary: Upload file attachment for guarantor submission
 *     description: Upload a file and associate it with a guarantor submission
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               guarantorId:
 *                 type: string
 *                 description: The guarantor submission ID to associate the file with
 *             required:
 *               - file
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 filename:
 *                   type: string
 *                 url:
 *                   type: string
 *                 fileType:
 *                   type: string
 *                 fileSize:
 *                   type: integer
 *               example:
 *                 id: "att456"
 *                 filename: "document.pdf"
 *                 url: "https://storage.example.com/files/att456/document.pdf"
 *                 fileType: "application/pdf"
 *                 fileSize: 1024000
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "413":
 *         description: File too large
 */
