import { Router } from "express";
import { auditLogMiddleware } from "#middlewares/audit-log.middleware";
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
router.post(
  "/:serverId/channel",
  auditLogMiddleware({
    action: "CHANNEL_CREATE",
    targetType: "CHANNEL",
    getTargetId: (req) => {
      const { serverId } = req.params;

      if (typeof serverId !== "string") {
        throw new Error("serverId tidak valid");
      }

      return serverId;
    },
  }),
  (req, res, next) => channelController.create(req, res, next),
);

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
router.patch(
  "/:serverId/channel/:channelId",
  auditLogMiddleware({
    action: "CHANNEL_UPDATE",
    targetType: "CHANNEL",
    getTargetId: (req) => {
      const { channelId } = req.params;

      if (typeof channelId !== "string") {
        throw new Error("channelId tidak valid");
      }

      return channelId;
    },
  }),
  (req, res, next) => channelController.update(req, res, next),
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
router.delete(
  "/:serverId/channel/:channelId",
  auditLogMiddleware({
    action: "CHANNEL_DELETE",
    targetType: "CHANNEL",
    getTargetId: (req) => {
      const { channelId } = req.params;

      if (typeof channelId !== "string") {
        throw new Error("channelId tidak valid");
      }

      return channelId;
    },
  }),
  (req, res, next) => channelController.delete(req, res, next),
);
/**
 * @swagger
 * /api/channel/{serverId}/channel/{channelId}/permission-overrides:
 *   get:
 *     summary: Mengambil permission override pada channel
 *     tags: [Channel]
 *     description: Mengambil seluruh permission override berdasarkan role pada channel. Hanya pengguna dengan MANAGE_CHANNELS atau ADMINISTRATOR yang dapat mengakses endpoint ini.
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
 *         description: Permission override berhasil diambil
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
 *                   example: Permission override berhasil diambil
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       channelId:
 *                         type: string
 *                         format: uuid
 *                       roleId:
 *                         type: string
 *                         format: uuid
 *                       allowBitmask:
 *                         type: string
 *                         example: "0"
 *                       denyBitmask:
 *                         type: string
 *                         example: "2"
 *                       role:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                             example: "@everyone"
 *       400:
 *         description: Server ID atau Channel ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki MANAGE_CHANNELS atau ADMINISTRATOR
 *       404:
 *         description: Server atau channel tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get("/:serverId/channel/:channelId/permission-overrides", (req, res, next) =>
  channelController.getPermissionOverrides(req, res, next),
);

/**
 * @swagger
 * /api/channel/{serverId}/channel/{channelId}/permission-overrides/{roleId}:
 *   put:
 *     summary: Membuat atau memperbarui permission override channel
 *     tags: [Channel]
 *     description: Membuat atau memperbarui permission override untuk role tertentu pada channel. Hanya pengguna dengan MANAGE_CHANNELS atau ADMINISTRATOR yang dapat mengelola permission override.
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
 *       - name: roleId
 *         in: path
 *         required: true
 *         description: UUID role
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
 *               - allowBitmask
 *               - denyBitmask
 *             properties:
 *               allowBitmask:
 *                 type: string
 *                 pattern: '^[0-9]+$'
 *                 description: Permission bitmask yang diizinkan
 *                 example: "0"
 *               denyBitmask:
 *                 type: string
 *                 pattern: '^[0-9]+$'
 *                 description: Permission bitmask yang ditolak
 *                 example: "2"
 *     responses:
 *       200:
 *         description: Permission override berhasil disimpan
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
 *                   example: Permission override berhasil disimpan
 *                 data:
 *                   type: object
 *                   properties:
 *                     channelId:
 *                       type: string
 *                       format: uuid
 *                     roleId:
 *                       type: string
 *                       format: uuid
 *                     allowBitmask:
 *                       type: string
 *                       example: "0"
 *                     denyBitmask:
 *                       type: string
 *                       example: "2"
 *       400:
 *         description: Parameter atau request body tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki MANAGE_CHANNELS atau ADMINISTRATOR
 *       404:
 *         description: Server, channel, atau role tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.put(
  "/:serverId/channel/:channelId/permission-overrides/:roleId",
  auditLogMiddleware({
    action: "CHANNEL_PERMISSION_OVERRIDE_UPSERT",
    targetType: "CHANNEL_PERMISSION_OVERRIDE",
    getTargetId: (req) => {
      const { channelId } = req.params;

      if (typeof channelId !== "string") {
        throw new Error("channelId tidak valid");
      }

      return channelId;
    },
    getMetadata: (req) => {
      const { roleId } = req.params;

      if (typeof roleId !== "string") {
        throw new Error("roleId tidak valid");
      }

      return { roleId };
    },
  }),
  (req, res, next) => channelController.upsertPermissionOverride(req, res, next),
);

/**
 * @swagger
 * /api/channel/{serverId}/channel/{channelId}/permission-overrides/{roleId}:
 *   delete:
 *     summary: Menghapus permission override channel
 *     tags: [Channel]
 *     description: Menghapus permission override untuk role tertentu pada channel. Hanya pengguna dengan MANAGE_CHANNELS atau ADMINISTRATOR yang dapat menghapus permission override.
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
 *       - name: roleId
 *         in: path
 *         required: true
 *         description: UUID role
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Permission override berhasil dihapus
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
 *                   example: Permission override berhasil dihapus
 *       400:
 *         description: Server ID, Channel ID, atau Role ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki MANAGE_CHANNELS atau ADMINISTRATOR
 *       404:
 *         description: Server, channel, role, atau permission override tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.delete(
  "/:serverId/channel/:channelId/permission-overrides/:roleId",
  auditLogMiddleware({
    action: "CHANNEL_PERMISSION_OVERRIDE_DELETE",
    targetType: "CHANNEL_PERMISSION_OVERRIDE",
    getTargetId: (req) => {
      const { channelId } = req.params;

      if (typeof channelId !== "string") {
        throw new Error("channelId tidak valid");
      }

      return channelId;
    },
    getMetadata: (req) => {
      const { roleId } = req.params;

      if (typeof roleId !== "string") {
        throw new Error("roleId tidak valid");
      }

      return { roleId };
    },
  }),
  (req, res, next) => channelController.deletePermissionOverride(req, res, next),
);
export default router;
