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

export default router;
