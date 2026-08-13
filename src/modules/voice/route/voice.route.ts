import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { voiceController } from "#modules/voice/controller/voice.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Voice
 *   description: LiveKit voice dan video
 */

/**
 * @swagger
 * /api/channels/{channelId}/voice/token:
 *   post:
 *     summary: Menerbitkan token LiveKit
 *     tags: [Voice]
 *     description: Menerbitkan access token LiveKit untuk bergabung ke voice/video room channel.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: channelId
 *         in: path
 *         required: true
 *         description: UUID channel voice/video
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               withVideo:
 *                 type: boolean
 *                 default: false
 *                 description: Meminta token untuk penggunaan video.
 *     responses:
 *       200:
 *         description: Token LiveKit berhasil diterbitkan
 *       400:
 *         description: Channel ID atau request body tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki permission CONNECT
 *       404:
 *         description: Channel tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/:channelId/voice/token", (req, res, next) =>
  voiceController.createToken(req, res, next),
);

export default router;
