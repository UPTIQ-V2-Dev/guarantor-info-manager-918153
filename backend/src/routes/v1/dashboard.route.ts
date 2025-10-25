import { guarantorSubmissionController } from '../../controllers/index.ts';
import auth from '../../middlewares/auth.ts';
import express from 'express';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', auth('getGuarantors'), guarantorSubmissionController.getDashboardStats);

export default router;

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard statistics and analytics
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics for guarantor submissions
 *     description: Retrieve aggregated statistics and recent submissions for dashboard display
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_submissions:
 *                   type: integer
 *                   description: Total number of submissions
 *                 pending_verification:
 *                   type: integer
 *                   description: Number of submissions pending verification
 *                 verified:
 *                   type: integer
 *                   description: Number of verified submissions
 *                 rejected:
 *                   type: integer
 *                   description: Number of rejected submissions
 *                 recent_submissions:
 *                   type: array
 *                   description: List of recent submissions
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       guarantor_name:
 *                         type: string
 *                       relationship_to_borrower:
 *                         type: string
 *                       record_status:
 *                         type: string
 *                       submission_timestamp:
 *                         type: string
 *                         format: date-time
 *                       submitted_by:
 *                         type: string
 *               example:
 *                 total_submissions: 15
 *                 pending_verification: 8
 *                 verified: 5
 *                 rejected: 2
 *                 recent_submissions:
 *                   - id: "g123"
 *                     guarantor_name: "John Smith"
 *                     relationship_to_borrower: "Business partner"
 *                     record_status: "pending_verification"
 *                     submission_timestamp: "2025-10-25T10:30:00Z"
 *                     submitted_by: "CurrentUser"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
