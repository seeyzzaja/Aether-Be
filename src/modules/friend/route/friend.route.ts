import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { friendController } from "#modules/friend/controller/friend.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Friend
 *   description: Manajemen pertemanan pengguna
 */

/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: Mengambil daftar teman
 *     tags: [Friend]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: tab
 *         in: query
 *         required: false
 *         description: Filter daftar pertemanan
 *         schema:
 *           type: string
 *           enum: [online, all, pending, blocked]
 *           default: all
 *     responses:
 *       200:
 *         description: Daftar teman berhasil diambil
 *       400:
 *         description: Filter tidak valid
 *       401:
 *         description: Pengguna belum login
 */
router.get("/", (req, res, next) => friendController.getAll(req, res, next));

/**
 * @swagger
 * /api/friends/requests:
 *   post:
 *     summary: Mengirim permintaan pertemanan
 *     tags: [Friend]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Mutual request otomatis diterima
 *       201:
 *         description: Permintaan pertemanan berhasil dikirim
 *       400:
 *         description: Request tidak valid
 *       401:
 *         description: Pengguna belum login
 *       404:
 *         description: User tidak ditemukan
 *       409:
 *         description: Friendship conflict
 */
router.post("/requests", (req, res, next) => friendController.sendRequest(req, res, next));

/**
 * @swagger
 * /api/friends/requests/{id}/accept:
 *   patch:
 *     summary: Menerima permintaan pertemanan
 *     tags: [Friend]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Friendship ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Permintaan berhasil diterima
 *       400:
 *         description: Friendship ID tidak valid
 *       401:
 *         description: Pengguna belum login
 *       403:
 *         description: Pengguna tidak berhak menerima request
 *       404:
 *         description: Request tidak ditemukan
 *       409:
 *         description: Request sudah tidak pending
 */
router.patch("/requests/:id/accept", (req, res, next) =>
  friendController.acceptRequest(req, res, next),
);

/**
 * @swagger
 * /api/friends/requests/{id}:
 *   delete:
 *     summary: Membatalkan atau menolak permintaan pertemanan
 *     tags: [Friend]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Friendship ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Permintaan berhasil dihapus
 *       400:
 *         description: Friendship ID tidak valid
 *       401:
 *         description: Pengguna belum login
 *       403:
 *         description: Pengguna bukan bagian dari request
 *       404:
 *         description: Request tidak ditemukan
 *       409:
 *         description: Request tidak dapat dihapus
 */
router.delete("/requests/:id", (req, res, next) => friendController.deleteRequest(req, res, next));

/**
 * @swagger
 * /api/friends/{userId}:
 *   delete:
 *     summary: Menghapus teman
 *     tags: [Friend]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID teman
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Teman berhasil dihapus
 *       400:
 *         description: User ID tidak valid
 *       401:
 *         description: Pengguna belum login
 *       404:
 *         description: Pertemanan tidak ditemukan
 *       409:
 *         description: User bukan teman
 */
router.delete("/:userId", (req, res, next) => friendController.removeFriend(req, res, next));

export default router;
