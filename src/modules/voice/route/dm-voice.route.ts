import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { voiceController } from "#modules/voice/controller/voice.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /api/dm/{channelId}/call/token:
 *   post:
 *     summary: Menerbitkan token LiveKit untuk DM call
 *     tags: [Voice]
 *     description: Menerbitkan access token LiveKit untuk voice/video call pada DM atau Group DM. Hanya participant dengan status accepted yang dapat memperoleh token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: channelId
 *         in: path
 *         required: true
 *         description: UUID channel DM atau Group DM
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
 *         description: Token LiveKit DM berhasil diterbitkan
 *       400:
 *         description: Channel ID atau request body tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan participant aktif pada DM
 *       404:
 *         description: DM tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/:channelId/call/token", (req, res, next) =>
  voiceController.createDmToken(req, res, next),
);

export default router;
