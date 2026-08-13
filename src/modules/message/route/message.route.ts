import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { messageController } from "#modules/message/controller/message.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /api/message/search:
 *   get:
 *     summary: Mencari pesan
 *     tags: [Message]
 *     description: Mencari pesan menggunakan PostgreSQL Full-Text Search.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: query
 *         required: true
 *         description: UUID server tempat pesan dicari
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: q
 *         in: query
 *         required: true
 *         description: Kata kunci pencarian
 *         schema:
 *           type: string
 *           minLength: 1
 *       - name: channelId
 *         in: query
 *         required: false
 *         description: UUID channel untuk membatasi pencarian
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Jumlah hasil per halaman
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - name: offset
 *         in: query
 *         required: false
 *         description: Offset hasil pencarian
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *     responses:
 *       200:
 *         description: Pencarian pesan berhasil
 *       400:
 *         description: Parameter pencarian tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki permission VIEW_CHANNEL
 *       404:
 *         description: Server atau channel tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get("/search", (req, res, next) => messageController.search(req, res, next));

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
 * /api/message/{messageId}/pin:
 *   post:
 *     summary: Menyematkan pesan
 *     tags: [Message]
 *     description: Menyematkan sebuah pesan. Hanya pengguna yang memiliki permission MANAGE_MESSAGES yang dapat menyematkan pesan.
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
 *         description: Pesan berhasil disematkan
 *       400:
 *         description: Message ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki permission MANAGE_MESSAGES
 *       404:
 *         description: Pesan atau server tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/:messageId/pin", (req, res, next) => messageController.pin(req, res, next));

/**
 * @swagger
 * /api/message/{messageId}/pin:
 *   delete:
 *     summary: Melepas sematan pesan
 *     tags: [Message]
 *     description: Melepas sematan sebuah pesan. Hanya pengguna yang memiliki permission MANAGE_MESSAGES yang dapat melepas sematan pesan.
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
 *         description: Pesan berhasil dilepas dari sematan
 *       400:
 *         description: Message ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki permission MANAGE_MESSAGES
 *       404:
 *         description: Pesan atau server tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.delete("/:messageId/pin", (req, res, next) => messageController.unpin(req, res, next));

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
/**
 * @swagger
 * /api/message/{messageId}/thread:
 *   get:
 *     summary: Mengambil thread dari sebuah pesan
 *     tags: [Message]
 *     description: Mengambil root message beserta seluruh pesan yang berada di dalam thread.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: UUID root message dari thread
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Thread berhasil diambil
 *       400:
 *         description: Message ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki permission untuk mengakses channel
 *       404:
 *         description: Root message atau channel tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get("/:messageId/thread", (req, res, next) => messageController.getThread(req, res, next));
export default router;
