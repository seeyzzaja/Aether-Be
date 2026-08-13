import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { membershipController } from "#modules/membership/controller/membership.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Membership
 *   description: Manajemen keanggotaan pengguna dalam server
 */

/**
 * @swagger
 * /api/membership/{serverId}/join:
 *   post:
 *     summary: Bergabung ke server
 *     tags: [Membership]
 *     description: Menambahkan pengguna yang sedang login sebagai member server dan otomatis memberikan role default @everyone.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         description: ID server yang ingin diikuti
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       201:
 *         description: Berhasil bergabung ke server
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
 *                   example: Berhasil bergabung ke server
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     serverId:
 *                       type: string
 *                       format: uuid
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     roleId:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     role:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                           example: "@everyone"
 *                         isDefault:
 *                           type: boolean
 *                           example: true
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         email:
 *                           type: string
 *                           format: email
 *                         username:
 *                           type: string
 *       401:
 *         description: Token tidak ada, tidak valid, atau sudah kedaluwarsa
 *       404:
 *         description: Server atau role default @everyone tidak ditemukan
 *       409:
 *         description: User sudah menjadi member server
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/:serverId/join", (req, res, next) => membershipController.join(req, res, next));

/**
 * @swagger
 * /api/membership/{serverId}/leave:
 *   delete:
 *     summary: Keluar dari server
 *     tags: [Membership]
 *     description: Menghapus membership pengguna yang sedang login dari server. Owner tidak dapat keluar dari server sebelum kepemilikan dipindahkan.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         description: ID server yang ingin ditinggalkan
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Berhasil keluar dari server
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
 *                   example: Berhasil keluar dari server
 *       401:
 *         description: Token tidak ada, tidak valid, atau sudah kedaluwarsa
 *       403:
 *         description: Owner tidak diperbolehkan meninggalkan server
 *       404:
 *         description: Server tidak ditemukan atau user bukan member server
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.delete("/:serverId/leave", (req, res, next) => membershipController.leave(req, res, next));

export default router;
