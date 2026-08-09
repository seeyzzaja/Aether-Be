import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { reactionController } from "#modules/reaction/controller/reaction.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Reaction
 *   description: Manajemen reaksi emoji pada pesan Aether
 */

/**
 * @swagger
 * /api/message/{messageId}/reactions:
 *   get:
 *     summary: Mengambil reaksi pada pesan
 *     tags: [Reaction]
 *     description: Mengambil seluruh reaksi emoji yang diberikan pada sebuah pesan.
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
 *         description: Reaksi berhasil diambil
 *       400:
 *         description: Message ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       404:
 *         description: Pesan tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get("/:messageId/reactions", (req, res, next) => reactionController.list(req, res, next));

/**
 * @swagger
 * /api/message/{messageId}/reactions:
 *   post:
 *     summary: Menambahkan reaksi emoji
 *     tags: [Reaction]
 *     description: Menambahkan reaksi emoji pada sebuah pesan. User tidak dapat memberikan emoji yang sama dua kali pada pesan yang sama.
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
 *               - emoji
 *             properties:
 *               emoji:
 *                 type: string
 *                 maxLength: 32
 *                 example: "👍"
 *                 description: Emoji yang ingin diberikan pada pesan
 *     responses:
 *       201:
 *         description: Reaksi berhasil ditambahkan
 *       400:
 *         description: Data request atau Message ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan member server
 *       404:
 *         description: Pesan tidak ditemukan
 *       409:
 *         description: User sudah memberikan emoji tersebut pada pesan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/:messageId/reactions", (req, res, next) => reactionController.add(req, res, next));

/**
 * @swagger
 * /api/message/{messageId}/reactions:
 *   delete:
 *     summary: Menghapus reaksi emoji
 *     tags: [Reaction]
 *     description: Menghapus reaksi emoji milik user pada sebuah pesan.
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
 *               - emoji
 *             properties:
 *               emoji:
 *                 type: string
 *                 maxLength: 32
 *                 example: "👍"
 *                 description: Emoji yang ingin dihapus
 *     responses:
 *       200:
 *         description: Reaksi berhasil dihapus
 *       400:
 *         description: Data request atau Message ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan member server
 *       404:
 *         description: Pesan atau reaksi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.delete("/:messageId/reactions", (req, res, next) =>
  reactionController.remove(req, res, next),
);

export default router;
