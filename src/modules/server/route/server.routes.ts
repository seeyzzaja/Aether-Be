import { Router } from "express";
import { requireAuth } from "#middlewares/auth-middleware";
import { serverController } from "#modules/server/controller/server.controller";

const router = Router();
router.use(requireAuth);
/**
 * @swagger
 * tags:
 *   name: Server
 *   description: Manajemen server atau workspace Aether
 */

/**
 * @swagger
 * /api/servers:
 *   post:
 *     summary: Membuat server baru
 *     tags: [Server]
 *     description: Membuat server baru dan otomatis menjadikan pengguna yang membuatnya sebagai Owner. Role default @everyone juga dibuat secara otomatis.
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
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: Aether Community
 *               iconUrl:
 *                 type: string
 *                 format: uri
 *                 maxLength: 500
 *                 example: https://example.com/aether-icon.png
 *     responses:
 *       201:
 *         description: Server berhasil dibuat
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
 *                   example: Server berhasil dibuat
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     ownerId:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                       example: Aether Community
 *                     iconUrl:
 *                       type: string
 *                       format: uri
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Data request tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/", (req, res, next) => serverController.create(req, res, next));

/**
 * @swagger
 * /api/servers/all:
 *   get:
 *     summary: Mengambil semua server
 *     tags: [Server]
 *     description: Mengambil seluruh server yang tersedia di Aether.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Semua server berhasil diambil
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
 *                   example: Semua server berhasil diambil
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       ownerId:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                         example: Aether Community
 *                       iconUrl:
 *                         type: string
 *                         format: uri
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get("/all", (req, res, next) => serverController.getAllServers(req, res, next));

/**
 * @swagger
 * /api/servers:
 *   get:
 *     summary: Mengambil daftar server milik Owner
 *     tags: [Server]
 *     description: Mengambil seluruh server yang dimiliki oleh pengguna yang sedang login. Server yang diikuti sebagai member akan ditambahkan setelah fitur Membership selesai dibuat.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar server berhasil diambil
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
 *                   example: Daftar server berhasil diambil
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       ownerId:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                         example: Aether Community
 *                       iconUrl:
 *                         type: string
 *                         format: uri
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get("/", (req, res, next) => serverController.getAll(req, res, next));

/**
 * @swagger
 * /api/servers/{serverId}:
 *   get:
 *     summary: Mengambil detail server
 *     tags: [Server]
 *     description: Mengambil detail server berdasarkan ID.
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
 *         description: Detail server berhasil diambil
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
 *                   example: Detail server berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     ownerId:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                       example: Aether Community
 *                     iconUrl:
 *                       type: string
 *                       format: uri
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Server ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       404:
 *         description: Server tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get("/:serverId", (req, res, next) => serverController.getById(req, res, next));

/**
 * @swagger
 * /api/servers/{serverId}:
 *   patch:
 *     summary: Mengubah server
 *     tags: [Server]
 *     description: Mengubah nama atau icon server. Hanya Owner server yang dapat melakukan perubahan.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: Aether Indonesia
 *               iconUrl:
 *                 type: string
 *                 format: uri
 *                 maxLength: 500
 *                 nullable: true
 *                 example: https://example.com/new-icon.png
 *     responses:
 *       200:
 *         description: Server berhasil diperbarui
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
 *                   example: Server berhasil diperbarui
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     ownerId:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                       example: Aether Indonesia
 *                     iconUrl:
 *                       type: string
 *                       format: uri
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Data request atau Server ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan Owner server
 *       404:
 *         description: Server tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.patch("/:serverId", (req, res, next) => serverController.update(req, res, next));

/**
 * @swagger
 * /api/servers/{serverId}:
 *   delete:
 *     summary: Menghapus server
 *     tags: [Server]
 *     description: Menghapus server berdasarkan ID. Hanya Owner server yang dapat menghapus server.
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
 *         description: Server berhasil dihapus
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
 *                   example: Server berhasil dihapus
 *       400:
 *         description: Server ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan Owner server
 *       404:
 *         description: Server tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.delete("/:serverId", (req, res, next) => serverController.delete(req, res, next));

export default router;
