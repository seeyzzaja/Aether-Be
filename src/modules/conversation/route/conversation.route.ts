import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { conversationController } from "#modules/conversation/controller/conversation.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   - name: conversation
 *     description: Manajemen percakapan langsung dan percakapan grup
 */

/**
 * @swagger
 * /api/conversations/dm:
 *   post:
 *     summary: Membuat percakapan langsung
 *     description: Membuat percakapan langsung (Direct Message/DM) dengan pengguna lain.
 *     tags:
 *       - Percakapan
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
 *                 description: ID pengguna yang ingin diajak melakukan percakapan langsung
 *                 example: 127f60bb-b8a3-4d32-bb21-bee17c33fb2b
 *     responses:
 *       201:
 *         description: Percakapan langsung berhasil dibuat
 *       400:
 *         description: Data yang dikirim tidak valid
 *       401:
 *         description: Pengguna belum terautentikasi
 *       404:
 *         description: Pengguna tujuan tidak ditemukan
 *       409:
 *         description: Percakapan langsung dengan pengguna tersebut sudah ada
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.post("/dm", (req, res, next) => conversationController.createDirectMessage(req, res, next));

/**
 * @swagger
 * /api/conversations/group:
 *   post:
 *     summary: Membuat percakapan grup
 *     description: Membuat percakapan grup baru dengan beberapa pengguna.
 *     tags:
 *       - Percakapan
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - memberIds
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama percakapan grup
 *                 example: Tim Aether
 *               memberIds:
 *                 type: array
 *                 description: Daftar ID pengguna yang akan menjadi anggota grup
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example:
 *                   - 127f60bb-b8a3-4d32-bb21-bee17c33fb2b
 *                   - 8dee2bc4-b782-4f56-87dc-362324c1ffe8
 *     responses:
 *       201:
 *         description: Percakapan grup berhasil dibuat
 *       400:
 *         description: Data yang dikirim tidak valid
 *       401:
 *         description: Pengguna belum terautentikasi
 *       404:
 *         description: Salah satu pengguna tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.post("/group", (req, res, next) => conversationController.createGroup(req, res, next));

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: Mendapatkan semua percakapan
 *     description: Mengambil seluruh percakapan yang diikuti oleh pengguna yang sedang login.
 *     tags:
 *       - Percakapan
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar percakapan berhasil diambil
 *       401:
 *         description: Pengguna belum terautentikasi
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get("/", (req, res, next) => conversationController.getAll(req, res, next));

/**
 * @swagger
 * /api/conversations/{conversationId}:
 *   get:
 *     summary: Mendapatkan detail percakapan
 *     description: Mengambil detail percakapan berdasarkan ID percakapan.
 *     tags:
 *       - Percakapan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         description: ID percakapan yang ingin dilihat
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 127f60bb-b8a3-4d32-bb21-bee17c33fb2b
 *     responses:
 *       200:
 *         description: Detail percakapan berhasil diambil
 *       401:
 *         description: Pengguna belum terautentikasi
 *       403:
 *         description: Pengguna tidak memiliki akses ke percakapan ini
 *       404:
 *         description: Percakapan tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get("/:conversationId", (req, res, next) => conversationController.getById(req, res, next));

export default router;
