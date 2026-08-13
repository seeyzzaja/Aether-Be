import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { readReceiptController } from "#modules/read-receipt/controller/read-receipt.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Read Receipt
 *   description: Tracking pesan yang telah dibaca user
 */

/**
 * @swagger
 * /api/read-receipt/{channelId}:
 *   patch:
 *     summary: Memperbarui read receipt
 *     tags: [Read Receipt]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: channelId
 *         in: path
 *         required: true
 *         description: UUID channel
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
 *               - messageId
 *             properties:
 *               messageId:
 *                 type: string
 *                 format: uuid
 *                 description: UUID pesan terakhir yang telah dibaca
 *     responses:
 *       200:
 *         description: Read receipt berhasil diperbarui
 *       400:
 *         description: Data request tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pesan bukan bagian dari channel
 *       404:
 *         description: Channel atau pesan tidak ditemukan
 */
router.patch("/:channelId", (req, res, next) => readReceiptController.update(req, res, next));

/**
 * @swagger
 * /api/read-receipt/{channelId}:
 *   get:
 *     summary: Mengambil read receipt user
 *     tags: [Read Receipt]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: channelId
 *         in: path
 *         required: true
 *         description: UUID channel
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Read receipt berhasil diambil
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       404:
 *         description: Channel tidak ditemukan
 */
router.get("/:channelId", (req, res, next) => readReceiptController.get(req, res, next));

export default router;
