import { Router } from "express";
import { auditLogMiddleware } from "#middlewares/audit-log.middleware";
import { requireAuth } from "#middlewares/auth-middleware";
import { messageRateLimiter } from "#middlewares/rate-limiters";
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
 *     summary: Mengirim pesan ke channel
 *     tags: [Message]
 *     description: Mengirim pesan baru ke channel. Rate limit maksimal 10 request per 10 detik untuk setiap user pada channel tertentu.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: channelId
 *         in: path
 *         required: true
 *         description: UUID channel tujuan pesan
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 69fe24b7-84b5-4342-b08a-bd1426471724
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
 *                 example: Halo semuanya!
 *               replyToId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID pesan yang ingin dibalas
 *                 example: 8d7a2f7e-3a1c-4c9d-b8f4-5e1234567890
 *     responses:
 *       201:
 *         description: Pesan berhasil dikirim
 *       400:
 *         description: Data pesan tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki permission untuk mengirim pesan di channel ini
 *       404:
 *         description: Channel atau pesan yang direply tidak ditemukan
 *       429:
 *         description: Terlalu banyak pesan dikirim dalam waktu singkat
 *         headers:
 *           X-RateLimit-Limit:
 *             description: Maksimal request dalam window
 *             schema:
 *               type: integer
 *               example: 10
 *           X-RateLimit-Remaining:
 *             description: Sisa request yang tersedia
 *             schema:
 *               type: integer
 *               example: 0
 *           X-RateLimit-Reset:
 *             description: Unix timestamp ketika rate limit di-reset
 *             schema:
 *               type: integer
 *           Retry-After:
 *             description: Waktu tunggu dalam detik sebelum mencoba kembali
 *             schema:
 *               type: integer
 *               example: 10
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: string
 *                   example: RATE_LIMITED
 *                 message:
 *                   type: string
 *                   example: Terlalu banyak request. Silakan coba lagi nanti.
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post(
  "/:channelId",
  messageRateLimiter,
  auditLogMiddleware({
    action: "MESSAGE_CREATE",
    targetType: "MESSAGE",
    getTargetId: (req) => {
      const { channelId } = req.params;

      if (typeof channelId !== "string") {
        throw new Error("channelId tidak valid");
      }

      return channelId;
    },
  }),
  (req, res, next) => messageController.create(req, res, next),
);

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
router.patch(
  "/:messageId",
  auditLogMiddleware({
    action: "MESSAGE_UPDATE",
    targetType: "MESSAGE",
    getTargetId: (req) => {
      const { messageId } = req.params;

      if (typeof messageId !== "string") {
        throw new Error("messageId tidak valid");
      }

      return messageId;
    },
  }),
  (req, res, next) => messageController.update(req, res, next),
);

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
router.post(
  "/:messageId/pin",
  auditLogMiddleware({
    action: "MESSAGE_PIN",
    targetType: "MESSAGE",
    getTargetId: (req) => {
      const { messageId } = req.params;

      if (typeof messageId !== "string") {
        throw new Error("messageId tidak valid");
      }

      return messageId;
    },
  }),
  (req, res, next) => messageController.pin(req, res, next),
);

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
router.delete(
  "/:messageId/pin",
  auditLogMiddleware({
    action: "MESSAGE_UNPIN",
    targetType: "MESSAGE",
    getTargetId: (req) => {
      const { messageId } = req.params;

      if (typeof messageId !== "string") {
        throw new Error("messageId tidak valid");
      }

      return messageId;
    },
  }),
  (req, res, next) => messageController.unpin(req, res, next),
);

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
router.delete(
  "/:messageId",
  auditLogMiddleware({
    action: "MESSAGE_DELETE",
    targetType: "MESSAGE",
    getTargetId: (req) => {
      const { messageId } = req.params;

      if (typeof messageId !== "string") {
        throw new Error("messageId tidak valid");
      }

      return messageId;
    },
  }),
  (req, res, next) => messageController.delete(req, res, next),
);
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

/**
 * @swagger
 * /api/message/{messageId}/forward:
 *   post:
 *     summary: Meneruskan pesan ke channel lain
 *     tags: [Message]
 *     description: Meneruskan pesan dengan validasi VIEW_CHANNEL pada channel asal dan SEND_MESSAGES pada channel tujuan.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: UUID pesan yang ingin diteruskan
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
 *               - destinationChannelId
 *             properties:
 *               destinationChannelId:
 *                 type: string
 *                 format: uuid
 *                 description: UUID channel tujuan
 *     responses:
 *       201:
 *         description: Pesan berhasil diteruskan
 *       400:
 *         description: Request tidak valid
 *       401:
 *         description: Pengguna belum login
 *       403:
 *         description: Tidak memiliki VIEW_CHANNEL pada channel asal atau SEND_MESSAGES pada channel tujuan
 *       404:
 *         description: Pesan atau channel tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post(
  "/:messageId/forward",
  auditLogMiddleware({
    action: "MESSAGE_FORWARD",
    targetType: "MESSAGE",
    getTargetId: (req) => {
      const { messageId } = req.params;

      if (typeof messageId !== "string") {
        throw new Error("messageId tidak valid");
      }

      return messageId;
    },
    getMetadata: (req) => {
      const { destinationChannelId } = req.body;

      return {
        destinationChannelId,
      };
    },
  }),
  (req, res, next) => messageController.forward(req, res, next),
);

/**
 * @swagger
 * /api/message/embed:
 *   get:
 *     summary: Mengambil metadata URL untuk embed preview
 *     tags: [Message]
 *     description: Mengambil metadata title, description, dan image dari halaman HTML. Response hanya berupa metadata JSON dan tidak menjalankan iframe atau script eksternal.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: url
 *         in: query
 *         required: true
 *         description: URL halaman yang ingin diambil metadata-nya
 *         schema:
 *           type: string
 *           format: uri
 *     responses:
 *       200:
 *         description: Metadata berhasil diambil
 *       400:
 *         description: URL tidak valid atau metadata gagal diambil
 *       401:
 *         description: Pengguna belum login
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get(
  "/embed",
  auditLogMiddleware({
    action: "MESSAGE_EMBED",
    targetType: "URL",
    getTargetId: (req) => {
      const { url } = req.query;

      if (typeof url !== "string") {
        throw new Error("url tidak valid");
      }

      return url;
    },
  }),
  (req, res, next) => messageController.embed(req, res, next),
);
export default router;
