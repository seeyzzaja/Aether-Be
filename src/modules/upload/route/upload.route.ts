import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
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
 *     summary: Membuat signed Cloudinary upload
 *     tags: [Upload]
 *     description: Menghasilkan signature untuk direct upload file ke Cloudinary tanpa melewati server aplikasi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID channel tujuan file
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - fileType
 *               - fileSize
 *             properties:
 *               fileName:
 *                 type: string
 *                 maxLength: 255
 *                 example: laporan-project.pdf
 *               fileType:
 *                 type: string
 *                 example: application/pdf
 *               fileSize:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 1073741824
 *                 description: Ukuran file dalam byte. Maksimal 1GB.
 *                 example: 5242880
 *     responses:
 *       200:
 *         description: Signature Cloudinary berhasil dibuat
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
 *                   example: Upload signature berhasil dibuat
 *                 data:
 *                   type: object
 *                   properties:
 *                     signature:
 *                       type: string
 *                       description: Signature yang digunakan untuk direct upload ke Cloudinary
 *                     timestamp:
 *                       type: integer
 *                       example: 1786507218
 *                     apiKey:
 *                       type: string
 *                       example: 123456789012345
 *                     cloudName:
 *                       type: string
 *                       example: codingstudy
 *                     folder:
 *                       type: string
 *                       example: aether/server-id/channel-id
 *                     resourceType:
 *                       type: string
 *                       example: auto
 *                     uploadUrl:
 *                       type: string
 *                       format: uri
 *                       example: https://api.cloudinary.com/v1_1/codingstudy/auto/upload
 *                     fileName:
 *                       type: string
 *                       example: laporan-project.pdf
 *                     fileType:
 *                       type: string
 *                       example: application/pdf
 *                     fileSize:
 *                       type: integer
 *                       example: 5242880
 *       400:
 *         description: Data upload tidak valid, tipe file tidak didukung, atau ukuran file melebihi 1GB
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki permission ATTACH_FILES
 *       404:
 *         description: Channel tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/signature/:channelId", (req, res, next) =>
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
