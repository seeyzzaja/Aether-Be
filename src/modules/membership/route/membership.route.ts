import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { membershipController } from "#modules/membership/controller/membership.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Membership
 *   description: Manajemen keanggotaan dan role pengguna dalam server
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
 *     responses:
 *       201:
 *         description: Berhasil bergabung ke server
 *       400:
 *         description: Server ID tidak valid
 *       401:
 *         description: Token tidak ada, tidak valid, atau user tidak ditemukan
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
 * /api/membership/servers:
 *   get:
 *     summary: Melihat semua server yang diikuti
 *     tags: [Membership]
 *     description: Mengambil semua server yang diikuti oleh user yang sedang login.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar server berhasil diambil
 *       401:
 *         description: User tidak terautentikasi
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get("/servers", (req, res, next) => membershipController.getMyServers(req, res, next));

/**
 * @swagger
 * /api/membership/{serverId}/leave:
 *   delete:
 *     summary: Keluar dari server
 *     tags: [Membership]
 *     description: Menghapus membership pengguna yang sedang login dari server. Owner tidak dapat meninggalkan server.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         description: ID server
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil keluar dari server
 *       400:
 *         description: Server ID tidak valid
 *       401:
 *         description: Token tidak ada, tidak valid, atau user tidak ditemukan
 *       403:
 *         description: Owner tidak diperbolehkan meninggalkan server
 *       404:
 *         description: Server tidak ditemukan atau user bukan member server
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.delete("/:serverId/leave", (req, res, next) => membershipController.leave(req, res, next));

/**
 * @swagger
 * /api/membership/{serverId}/members/{memberId}/roles/{roleId}:
 *   post:
 *     summary: Memberikan role kepada member
 *     tags: [Membership]
 *     description: Memberikan role tertentu kepada member server. Actor harus memiliki permission yang cukup untuk memberikan role tersebut.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         description: ID server
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: memberId
 *         required: true
 *         description: ID membership
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: roleId
 *         required: true
 *         description: ID role
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Role berhasil diberikan kepada member
 *       400:
 *         description: Parameter tidak valid
 *       401:
 *         description: User tidak terautentikasi
 *       403:
 *         description: Tidak memiliki permission untuk memberikan role
 *       404:
 *         description: Server, member, atau role tidak ditemukan
 *       409:
 *         description: Member sudah memiliki role tersebut
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/:serverId/members/:memberId/roles/:roleId", (req, res, next) =>
  membershipController.assignRole(req, res, next),
);

/**
 * @swagger
 * /api/membership/{serverId}/members/{memberId}/roles/{roleId}:
 *   delete:
 *     summary: Menghapus role dari member
 *     tags: [Membership]
 *     description: Menghapus role tertentu dari member server. Actor harus memiliki permission yang cukup.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         description: ID server
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: memberId
 *         required: true
 *         description: ID membership
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: roleId
 *         required: true
 *         description: ID role
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Role berhasil dihapus dari member
 *       400:
 *         description: Parameter tidak valid
 *       401:
 *         description: User tidak terautentikasi
 *       403:
 *         description: Tidak memiliki permission untuk menghapus role
 *       404:
 *         description: Server, member, atau role tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.delete("/:serverId/members/:memberId/roles/:roleId", (req, res, next) =>
  membershipController.removeRole(req, res, next),
);

export default router;
