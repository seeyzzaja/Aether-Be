import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { uploadRateLimiter } from "#middlewares/rate-limiters";
import { uploadController } from "#modules/upload/controller/upload.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Upload file dan media Aether
 */

/**
 * @swagger
 * /api/upload/signature/{channelId}:
 *   post:
 *     summary: Membuat signature upload
 *     tags: [Upload]
 *     description: Membuat signature untuk upload file ke Cloudinary. Rate limit maksimal 20 request per menit per user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: channelId
 *         in: path
 *         required: true
 *         description: UUID channel tempat file akan dikirim
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 69fe24b7-84b5-4342-b08a-bd1426471724
 *     responses:
 *       200:
 *         description: Signature upload berhasil dibuat
 *       400:
 *         description: Parameter request tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki akses ke channel
 *       404:
 *         description: Channel tidak ditemukan
 *       429:
 *         description: Terlalu banyak request upload
 *         headers:
 *           X-RateLimit-Limit:
 *             description: Maksimal request dalam 1 menit
 *             schema:
 *               type: integer
 *               example: 20
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
router.post("/signature/:channelId", uploadRateLimiter, (req, res, next) =>
  uploadController.createSignature(req, res, next),
);

/**
 * @swagger
 * /api/upload/confirm:
 *   post:
 *     summary: Konfirmasi upload Cloudinary
 *     tags: [Upload]
 *     description: Memverifikasi file yang telah berhasil di-upload langsung ke Cloudinary dan menyimpan metadata attachment ke database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - channelId
 *               - publicId
 *               - secureUrl
 *               - fileName
 *               - fileType
 *               - fileSize
 *               - resourceType
 *               - format
 *             properties:
 *               channelId:
 *                 type: string
 *                 format: uuid
 *                 description: UUID channel tujuan attachment
 *                 example: c1a7b5d5-ff37-4208-81c5-3391e89edcb9
 *               publicId:
 *                 type: string
 *                 description: Public ID asset dari Cloudinary
 *                 example: aether/server-id/channel-id/cqoxbbkgzgyt9dwcuv3y
 *               secureUrl:
 *                 type: string
 *                 format: uri
 *                 description: Secure URL hasil upload dari Cloudinary
 *                 example: https://res.cloudinary.com/codingstudy/image/upload/v1786507218/aether/server-id/channel-id/cqoxbbkgzgyt9dwcuv3y.pdf
 *               fileName:
 *                 type: string
 *                 maxLength: 255
 *                 description: Nama file asli
 *                 example: Contoh_Surat_Lamaran_Satu_Lembar_1.pdf
 *               fileType:
 *                 type: string
 *                 description: MIME type file
 *                 example: application/pdf
 *               fileSize:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 1073741824
 *                 description: Ukuran file dalam byte. Maksimal 1GB.
 *                 example: 15033
 *               resourceType:
 *                 type: string
 *                 description: Resource type Cloudinary
 *                 example: image
 *               format:
 *                 type: string
 *                 description: Format file dari Cloudinary
 *                 example: pdf
 *     responses:
 *       201:
 *         description: Upload berhasil dikonfirmasi dan metadata attachment tersimpan
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
 *                   example: Upload berhasil dikonfirmasi
 *                 data:
 *                   type: object
 *                   properties:
 *                     channelId:
 *                       type: string
 *                       format: uuid
 *                       example: c1a7b5d5-ff37-4208-81c5-3391e89edcb9
 *                     fileUrl:
 *                       type: string
 *                       format: uri
 *                       example: https://res.cloudinary.com/codingstudy/image/upload/v1786507218/aether/server-id/channel-id/cqoxbbkgzgyt9dwcuv3y.pdf
 *                     thumbnailUrl:
 *                       type: string
 *                       format: uri
 *                       nullable: true
 *                       example: null
 *                     fileType:
 *                       type: string
 *                       example: application/pdf
 *                     fileSize:
 *                       type: integer
 *                       example: 15033
 *                     fileName:
 *                       type: string
 *                       example: Contoh_Surat_Lamaran_Satu_Lembar_1.pdf
 *                     publicId:
 *                       type: string
 *                       example: aether/server-id/channel-id/cqoxbbkgzgyt9dwcuv3y
 *                     resourceType:
 *                       type: string
 *                       example: image
 *                     format:
 *                       type: string
 *                       example: pdf
 *       400:
 *         description: Data upload tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki permission ATTACH_FILES atau asset bukan berasal dari folder channel yang valid
 *       404:
 *         description: Channel atau file Cloudinary tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/confirm", (req, res, next) => uploadController.confirmUpload(req, res, next));

export default router;
