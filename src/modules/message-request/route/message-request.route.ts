import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { messageRequestController } from "#modules/message-request/controller/message-request.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Message Request
 *   description: Manajemen permintaan pesan dari pengguna non-teman
 */

/**
 * @swagger
 * /api/message-requests:
 *   post:
 *     summary: Mengirim message request
 *     description: Mengirim permintaan untuk memulai DM kepada pengguna lain. Jika pengguna sudah berteman atau request sebelumnya sudah ada, endpoint akan mengembalikan conflict.
 *     tags: [Message Request]
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
 *                 description: ID pengguna yang ingin dikirimi message request
 *     responses:
 *       201:
 *         description: Message request berhasil dikirim
 *       400:
 *         description: Data message request tidak valid
 *       401:
 *         description: Pengguna belum login
 *       403:
 *         description: Pengguna tidak dapat mengirim message request
 *       404:
 *         description: User tidak ditemukan
 *       409:
 *         description: Request conflict, misalnya sudah berteman atau request sudah ada
 */
router.post("/", (req, res, next) => messageRequestController.create(req, res, next));

/**
 * @swagger
 * /api/message-requests:
 *   get:
 *     summary: Mengambil message request yang masuk
 *     description: Mengambil seluruh message request berstatus PENDING yang diterima oleh pengguna yang sedang login.
 *     tags: [Message Request]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar message request berhasil diambil
 *       401:
 *         description: Pengguna belum login
 */
router.get("/", (req, res, next) => messageRequestController.getPending(req, res, next));

/**
 * @swagger
 * /api/message-requests/{requestId}:
 *   get:
 *     summary: Mengambil detail message request
 *     description: Mengambil detail message request jika pengguna merupakan sender atau receiver.
 *     tags: [Message Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: requestId
 *         in: path
 *         required: true
 *         description: ID message request
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detail message request berhasil diambil
 *       400:
 *         description: Message request ID tidak valid
 *       401:
 *         description: Pengguna belum login
 *       403:
 *         description: Pengguna bukan sender atau receiver
 *       404:
 *         description: Message request tidak ditemukan
 */
router.get("/:requestId", (req, res, next) => messageRequestController.getById(req, res, next));

/**
 * @swagger
 * /api/message-requests/{requestId}/accept:
 *   patch:
 *     summary: Menerima message request
 *     description: Menerima message request yang masuk. Hanya receiver yang dapat menerima request.
 *     tags: [Message Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: requestId
 *         in: path
 *         required: true
 *         description: ID message request
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Message request berhasil diterima
 *       400:
 *         description: Message request ID tidak valid
 *       401:
 *         description: Pengguna belum login
 *       403:
 *         description: Pengguna bukan receiver dari request
 *       404:
 *         description: Message request tidak ditemukan
 *       409:
 *         description: Message request sudah tidak berstatus pending
 */
router.patch("/:requestId/accept", (req, res, next) =>
  messageRequestController.accept(req, res, next),
);

/**
 * @swagger
 * /api/message-requests/{requestId}/reject:
 *   patch:
 *     summary: Menolak message request
 *     description: Menolak message request yang masuk. Hanya receiver yang dapat menolak request.
 *     tags: [Message Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: requestId
 *         in: path
 *         required: true
 *         description: ID message request
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Message request berhasil ditolak
 *       400:
 *         description: Message request ID tidak valid
 *       401:
 *         description: Pengguna belum login
 *       403:
 *         description: Pengguna bukan receiver dari request
 *       404:
 *         description: Message request tidak ditemukan
 *       409:
 *         description: Message request sudah tidak berstatus pending
 */
router.patch("/:requestId/reject", (req, res, next) =>
  messageRequestController.reject(req, res, next),
);

export default router;
