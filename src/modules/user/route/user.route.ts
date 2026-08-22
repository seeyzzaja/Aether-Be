import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { userController } from "#modules/user/controller/user.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Manajemen blokir pengguna dan privasi DM
 */

/**
 * @swagger
 * /api/users/{userId}/block:
 *   post:
 *     summary: Memblokir pengguna
 *     description: Memblokir pengguna dan otomatis menghapus relasi pertemanan yang ada.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID pengguna yang ingin diblokir
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Pengguna berhasil diblokir
 *       400:
 *         description: User ID tidak valid
 *       401:
 *         description: Pengguna belum login
 *       404:
 *         description: Pengguna tidak ditemukan
 *       409:
 *         description: Tidak dapat memblokir diri sendiri atau konflik blokir
 */
router.post("/:userId/block", (req, res, next) => userController.block(req, res, next));

/**
 * @swagger
 * /api/users/{userId}/block:
 *   delete:
 *     summary: Membuka blokir pengguna
 *     description: Menghapus blokir pengguna yang sebelumnya diblokir oleh pengguna saat ini.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID pengguna yang ingin dibuka blokirnya
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pengguna berhasil dibuka blokirnya
 *       400:
 *         description: User ID tidak valid
 *       401:
 *         description: Pengguna belum login
 *       404:
 *         description: Pengguna tidak ditemukan atau tidak sedang diblokir
 */
router.delete("/:userId/block", (req, res, next) => userController.unblock(req, res, next));

/**
 * @swagger
 * /api/users/me/privacy:
 *   patch:
 *     summary: Mengubah pengaturan privasi DM
 *     description: Mengatur siapa yang dapat memulai percakapan DM dengan pengguna.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dmPrivacy
 *             properties:
 *               dmPrivacy:
 *                 type: string
 *                 enum:
 *                   - EVERYONE
 *                   - FRIENDS_ONLY
 *                 example: FRIENDS_ONLY
 *                 description: >
 *                   EVERYONE mengizinkan semua pengguna memulai DM.
 *                   FRIENDS_ONLY membatasi DM dari non-teman menjadi pending request.
 *     responses:
 *       200:
 *         description: Pengaturan privasi DM berhasil diperbarui
 *       400:
 *         description: Pengaturan privasi DM tidak valid
 *       401:
 *         description: Pengguna belum login
 */
router.patch("/me/privacy", (req, res, next) => userController.updatePrivacy(req, res, next));
/**
 * @swagger
 * /api/users/{userId}/profile:
 *   get:
 *     summary: Mendapatkan profil pengguna
 *     description: >
 *       Mengambil data profil pengguna yang mencakup bio, server bersama,
 *       teman bersama, dan status hubungan pengguna terhadap aktor yang sedang login.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID pengguna yang ingin dilihat profilnya
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Profil pengguna berhasil diambil
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
 *                   example: Profil pengguna berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 59b54776-5a4d-4535-b2ea-b27d0607de34
 *                     username:
 *                       type: string
 *                       example: seeyzz
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                       example: Backend developer
 *                     relationshipStatus:
 *                       type: string
 *                       enum:
 *                         - none
 *                         - pending
 *                         - friends
 *                         - blocked
 *                       example: friends
 *                     mutualServers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           iconUrl:
 *                             type: string
 *                             nullable: true
 *                             format: uri
 *                       example:
 *                         - id: 11111111-1111-1111-1111-111111111111
 *                           name: Aether Community
 *                           iconUrl: https://example.com/icon.png
 *                     mutualFriends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           username:
 *                             type: string
 *                       example:
 *                         - id: 22222222-2222-2222-2222-222222222222
 *                           username: seeyzz2
 *       400:
 *         description: User ID tidak valid
 *       401:
 *         description: Pengguna belum login
 *       404:
 *         description: User tidak ditemukan
 */
router.get("/:userId/profile", (req, res, next) => userController.profile(req, res, next));
export default router;
