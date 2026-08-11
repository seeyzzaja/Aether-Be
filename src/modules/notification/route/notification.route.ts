import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { notificationController } from "#modules/notification/controller/notification.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Manajemen notifikasi pengguna
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Mengambil daftar notifikasi pengguna
 *     tags: [Notification]
 *     description: Mengambil daftar notifikasi milik pengguna dengan offset pagination.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: offset
 *         in: query
 *         required: false
 *         description: Jumlah data yang dilewati
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Jumlah notifikasi yang diambil
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: Notifikasi berhasil diambil
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get("/", (req, res, next) => notificationController.getAll(req, res, next));

/**
 * @swagger
 * /api/notifications/{notificationId}/read:
 *   patch:
 *     summary: Menandai notifikasi sebagai telah dibaca
 *     tags: [Notification]
 *     description: Menandai notifikasi milik pengguna sebagai telah dibaca.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: notificationId
 *         in: path
 *         required: true
 *         description: UUID notifikasi
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notifikasi berhasil ditandai sebagai telah dibaca
 *       400:
 *         description: Notification ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan pemilik notifikasi
 *       404:
 *         description: Notifikasi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.patch("/:notificationId/read", (req, res, next) =>
  notificationController.markAsRead(req, res, next),
);

export default router;
