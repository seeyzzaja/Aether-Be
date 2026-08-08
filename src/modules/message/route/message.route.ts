import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { messageController } from "#modules/message/controller/message.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Manajemen pesan pada channel Aether
 */

/**
 * @swagger
 * /api/message/{channelId}:
 *   post:
 *     summary: Mengirim pesan
 *     tags: [Message]
 *     description: Mengirim pesan baru ke dalam channel.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: channelId
 *         in: path
 *         required: true
 *         description: UUID channel tempat pesan dikirim
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 4000
 *                 example: Halo semuanya!
 *               replyToId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: UUID pesan yang ingin dibalas
 *               threadRootId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: UUID root message dari thread
 *     responses:
 *       201:
 *         description: Pesan berhasil dikirim
 *       400:
 *         description: Data request atau Channel ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki permission SEND_MESSAGES
 *       404:
 *         description: Channel atau pesan reply tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/:channelId", (req, res, next) => messageController.create(req, res, next));

/**
 * @swagger
 * /api/message/{messageId}:
 *   patch:
 *     summary: Mengubah pesan
 *     tags: [Message]
 *     description: Mengubah isi pesan. Hanya pengirim asli atau pengguna dengan MANAGE_MESSAGES yang dapat mengubah pesan.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: UUID pesan
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 4000
 *                 example: Pesan sudah diperbarui.
 *     responses:
 *       200:
 *         description: Pesan berhasil diperbarui
 *       400:
 *         description: Data request atau Message ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan pengirim asli dan tidak memiliki MANAGE_MESSAGES
 *       404:
 *         description: Pesan tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.patch("/:messageId", (req, res, next) => messageController.update(req, res, next));

/**
 * @swagger
 * /api/message/{messageId}:
 *   delete:
 *     summary: Menghapus pesan
 *     tags: [Message]
 *     description: Menghapus pesan secara soft delete. Hanya pengirim asli atau pengguna dengan MANAGE_MESSAGES yang dapat menghapus pesan.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: UUID pesan
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pesan berhasil dihapus
 *       400:
 *         description: Message ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan pengirim asli dan tidak memiliki MANAGE_MESSAGES
 *       404:
 *         description: Pesan tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.delete("/:messageId", (req, res, next) => messageController.delete(req, res, next));

export default router;
