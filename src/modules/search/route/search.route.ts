import { Router } from "express";
import { requireAuth } from "#middlewares/auth-middleware";
import { searchRateLimiter } from "#middlewares/rate-limiters";
import { searchController } from "#modules/search/controller/search.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Mencari entitas
 *     tags: [Search]
 *     description: Mencari messages, servers, dan channels menggunakan PostgreSQL Full-Text Search. Rate limit maksimal 30 request per menit per user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: query
 *         required: true
 *         description: UUID server tempat pencarian dilakukan
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
 *           example: hello world
 *       - name: type
 *         in: query
 *         required: false
 *         description: Tipe entitas yang ingin dicari
 *         schema:
 *           type: string
 *           enum:
 *             - all
 *             - messages
 *             - servers
 *             - channels
 *           default: all
 *       - name: channelId
 *         in: query
 *         required: false
 *         description: UUID channel untuk membatasi pencarian message
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Jumlah hasil per tipe
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
 *         description: Pencarian berhasil
 *       400:
 *         description: Parameter pencarian tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki akses ke server/channel
 *       404:
 *         description: Server atau channel tidak ditemukan
 *       429:
 *         description: Terlalu banyak request pencarian
 *         headers:
 *           X-RateLimit-Limit:
 *             description: Maksimal request dalam 1 menit
 *             schema:
 *               type: integer
 *               example: 30
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
 *               example: 60
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
router.get("/", searchRateLimiter, (req, res, next) => searchController.search(req, res, next));

export default router;
