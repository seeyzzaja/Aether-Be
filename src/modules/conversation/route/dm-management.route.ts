import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { conversationController } from "#modules/conversation/controller/conversation.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /api/conversations/{channelId}:
 *   patch:
 *     summary: Update a Group DM
 *     description: Update the name and/or icon of a Group DM conversation.
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: Group DM channel ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: Project Team
 *               iconUrl:
 *                 type: string
 *                 format: uri
 *                 maxLength: 2048
 *                 nullable: true
 *                 example: https://example.com/group-icon.png
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Group DM updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized to update this Group DM
 *       404:
 *         description: Group DM not found
 */
router.patch("/:channelId", (req, res, next) => conversationController.updateGroup(req, res, next));

/**
 * @swagger
 * /api/conversations/{channelId}/participants:
 *   post:
 *     summary: Add participant to a Group DM
 *     description: Add a new participant to an existing Group DM conversation.
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: Group DM channel ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: User ID to add to the Group DM
 *                 example: 7d4b931b-19ef-4720-8c3e-123456789abc
 *     responses:
 *       200:
 *         description: Participant added successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized to add participants
 *       404:
 *         description: Group DM or user not found
 *       409:
 *         description: User is already a participant
 */
router.post("/:channelId/participants", (req, res, next) =>
  conversationController.addParticipant(req, res, next),
);

/**
 * @swagger
 * /api/conversations/{channelId}/participants:
 *   delete:
 *     summary: Remove participant from a Group DM
 *     description: Remove a participant from a Group DM. A participant can also remove themselves by providing their own user ID.
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: Group DM channel ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: User ID to remove from the Group DM
 *                 example: 7d4b931b-19ef-4720-8c3e-123456789abc
 *     responses:
 *       200:
 *         description: Participant removed successfully or current user left the Group DM
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized to remove participants
 *       404:
 *         description: Group DM or participant not found
 */
router.delete("/:channelId/participants", (req, res, next) =>
  conversationController.removeParticipant(req, res, next),
);

export default router;
