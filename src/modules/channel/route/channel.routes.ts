import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { channelController } from "#modules/channel/controller/channel.controller";

const router = Router({
  mergeParams: true,
});

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Channel
 *   description: Manajemen channel pada server Aether
 */

/**
 * @swagger
 * /api/channel/{serverId}/channel:
 *   post:
 *     summary: Membuat channel baru
 *     tags: [Channel]
 *     description: Membuat channel baru pada server. Channel dapat dibuat dengan atau tanpa category. Hanya Owner server yang dapat membuat channel.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: path
 *         required: true
 *         description: UUID server tempat channel akan dibuat
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
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: general
 *               type:
 *                 type: string
 *                 enum:
 *                   - TEXT
 *                   - VOICE
 *                   - VIDEO
 *                   - FORUM
 *                   - ANNOUNCEMENT
 *                 example: TEXT
 *               topic:
 *                 type: string
 *                 maxLength: 500
 *                 nullable: true
 *                 example: Channel untuk diskusi umum
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: UUID category. Field ini dapat dikosongkan atau dikirim null untuk membuat channel tanpa category.
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       201:
 *         description: Channel berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Channel berhasil dibuat
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     serverId:
 *                       type: string
 *                       format: uuid
 *                     categoryId:
 *                       type: string
 *                       format: uuid
 *                       nullable: true
 *                     name:
 *                       type: string
 *                       example: general
 *                     type:
 *                       type: string
 *                       enum:
 *                         - TEXT
 *                         - VOICE
 *                         - VIDEO
 *                         - FORUM
 *                         - ANNOUNCEMENT
 *                       example: TEXT
 *                     topic:
 *                       type: string
 *                       nullable: true
 *                       example: Channel untuk diskusi umum
 *                     position:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Data request atau Server ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan Owner server
 *       404:
 *         description: Server atau Category tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/:serverId/channel", (req, res, next) => channelController.create(req, res, next));

/**
 * @swagger
 * /api/channel/{serverId}/channel:
 *   get:
 *     summary: Mengambil seluruh channel pada server
 *     tags: [Channel]
 *     description: Mengambil seluruh channel pada server. Owner dan member server dapat melihat daftar channel.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: path
 *         required: true
 *         description: UUID server
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Daftar channel berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Daftar channel berhasil diambil
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       serverId:
 *                         type: string
 *                         format: uuid
 *                       categoryId:
 *                         type: string
 *                         format: uuid
 *                         nullable: true
 *                       name:
 *                         type: string
 *                         example: general
 *                       type:
 *                         type: string
 *                         enum:
 *                           - TEXT
 *                           - VOICE
 *                           - VIDEO
 *                           - FORUM
 *                           - ANNOUNCEMENT
 *                         example: TEXT
 *                       topic:
 *                         type: string
 *                         nullable: true
 *                       position:
 *                         type: integer
 *                         example: 0
 *       400:
 *         description: Server ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan Owner atau member server
 *       404:
 *         description: Server tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get("/:serverId/channel", (req, res, next) => channelController.getAll(req, res, next));

/**
 * @swagger
 * /api/channel/{serverId}/channel/{channelId}:
 *   get:
 *     summary: Mengambil detail channel
 *     tags: [Channel]
 *     description: Mengambil detail channel berdasarkan ID. Owner dan member server dapat melihat detail channel.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: path
 *         required: true
 *         description: UUID server
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: channelId
 *         in: path
 *         required: true
 *         description: UUID channel
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detail channel berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Detail channel berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     serverId:
 *                       type: string
 *                       format: uuid
 *                     categoryId:
 *                       type: string
 *                       format: uuid
 *                       nullable: true
 *                     name:
 *                       type: string
 *                       example: general
 *                     type:
 *                       type: string
 *                       enum:
 *                         - TEXT
 *                         - VOICE
 *                         - VIDEO
 *                         - FORUM
 *                         - ANNOUNCEMENT
 *                       example: TEXT
 *                     topic:
 *                       type: string
 *                       nullable: true
 *                     position:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Server ID atau Channel ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan Owner atau member server
 *       404:
 *         description: Server atau Channel tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get("/:serverId/channel/:channelId", (req, res, next) =>
  channelController.getById(req, res, next),
);

/**
 * @swagger
 * /api/channel/{serverId}/channel/{channelId}:
 *   patch:
 *     summary: Mengubah channel
 *     tags: [Channel]
 *     description: Mengubah nama, tipe, topik, atau category channel. Hanya Owner server yang dapat mengubah channel.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: path
 *         required: true
 *         description: UUID server
 *         schema:
 *           type: string
 *           format: uuid
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
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: general-chat
 *               type:
 *                 type: string
 *                 enum:
 *                   - TEXT
 *                   - VOICE
 *                   - VIDEO
 *                   - FORUM
 *                   - ANNOUNCEMENT
 *                 example: TEXT
 *               topic:
 *                 type: string
 *                 maxLength: 500
 *                 nullable: true
 *                 example: Channel diskusi umum Aether
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Kirim UUID untuk memindahkan channel ke category atau null untuk melepas channel dari category.
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Channel berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Channel berhasil diperbarui
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     serverId:
 *                       type: string
 *                       format: uuid
 *                     categoryId:
 *                       type: string
 *                       format: uuid
 *                       nullable: true
 *                     name:
 *                       type: string
 *                       example: general-chat
 *                     type:
 *                       type: string
 *                       enum:
 *                         - TEXT
 *                         - VOICE
 *                         - VIDEO
 *                         - FORUM
 *                         - ANNOUNCEMENT
 *                       example: TEXT
 *                     topic:
 *                       type: string
 *                       nullable: true
 *                     position:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Data request, Server ID, atau Channel ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan Owner server
 *       404:
 *         description: Server, Channel, atau Category tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.patch("/:serverId/channel/:channelId", (req, res, next) =>
  channelController.update(req, res, next),
);

/**
 * @swagger
 * /api/channel/{serverId}/channel/{channelId}:
 *   delete:
 *     summary: Menghapus channel
 *     tags: [Channel]
 *     description: Menghapus channel berdasarkan ID. Hanya Owner server yang dapat menghapus channel.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: path
 *         required: true
 *         description: UUID server
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: channelId
 *         in: path
 *         required: true
 *         description: UUID channel
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Channel berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Channel berhasil dihapus
 *       400:
 *         description: Server ID atau Channel ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan Owner server
 *       404:
 *         description: Server atau Channel tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.delete("/:serverId/channel/:channelId", (req, res, next) =>
  channelController.delete(req, res, next),
);

export default router;
