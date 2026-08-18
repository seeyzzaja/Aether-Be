import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { adminController } from "#modules/admin/controller/admin.controller";

const adminRouter = Router();

adminRouter.use(requireAuth);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: List platform users
 *     description: |
 *       Mengambil daftar user untuk kebutuhan admin panel.
 *       Endpoint ini hanya dapat digunakan oleh platform admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Nomor halaman.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Jumlah user per halaman.
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan user.
 *     responses:
 *       200:
 *         description: Daftar user berhasil diambil.
 *       401:
 *         description: Tidak terautentikasi.
 *       403:
 *         description: Hanya platform admin yang dapat mengakses endpoint ini.
 */
adminRouter.get("/users", (req, res, next) => adminController.listUsers(req, res, next));

/**
 * @openapi
 * /api/admin/users/{userId}/suspend:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Suspend a user
 *     description: |
 *       Menangguhkan user dan memaksa seluruh sesi aktif user tersebut
 *       untuk logout.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user yang akan di-suspend.
 *     responses:
 *       200:
 *         description: User berhasil di-suspend.
 *       400:
 *         description: Request tidak valid.
 *       401:
 *         description: Tidak terautentikasi.
 *       403:
 *         description: Hanya platform admin yang dapat melakukan suspend.
 *       404:
 *         description: User tidak ditemukan.
 */
adminRouter.patch("/users/:userId/suspend", (req, res, next) =>
  adminController.suspendUser(req, res, next),
);

/**
 * @openapi
 * /api/admin/audit-logs:
 *   get:
 *     tags:
 *       - Admin
 *     summary: List audit logs
 *     description: Mengambil audit log platform dengan filter dan pagination.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Nomor halaman.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Jumlah audit log per halaman.
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter berdasarkan target user ID.
 *       - in: query
 *         name: targetId
 *         schema:
 *           type: string
 *         description: Filter berdasarkan target ID audit log. Jika userId dan targetId sama-sama dikirim, userId diprioritaskan.
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter berdasarkan action audit.
 *       - in: query
 *         name: targetType
 *         schema:
 *           type: string
 *         description: Filter berdasarkan tipe target.
 *     responses:
 *       200:
 *         description: Audit logs berhasil diambil.
 *       401:
 *         description: Tidak terautentikasi.
 *       403:
 *         description: Hanya platform admin yang dapat mengakses endpoint ini.
 */
adminRouter.get("/audit-logs", (req, res, next) => adminController.listAuditLogs(req, res, next));

/**
 * @openapi
 * /api/admin/messages/bulk:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Bulk delete messages
 *     description: |
 *       Menghapus beberapa message sekaligus.
 *       Permission tetap diperiksa untuk setiap message.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messageIds
 *             properties:
 *               messageIds:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                 description: ID message yang akan dihapus.
 *     responses:
 *       200:
 *         description: Bulk delete berhasil diproses.
 *       400:
 *         description: Request tidak valid.
 *       401:
 *         description: Tidak terautentikasi.
 *       403:
 *         description: Tidak memiliki permission untuk operasi tertentu.
 */
adminRouter.delete("/messages/bulk", (req, res, next) =>
  adminController.bulkDeleteMessages(req, res, next),
);

/**
 * @openapi
 * /api/admin/members/bulk-kick:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Bulk kick server members
 *     description: |
 *       Mengeluarkan beberapa member dari server sekaligus.
 *       Permission diperiksa secara individual untuk setiap member.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberIds
 *             properties:
 *               memberIds:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                 description: ID member yang akan di-kick.
 *     responses:
 *       200:
 *         description: Bulk kick berhasil diproses.
 *       400:
 *         description: Request tidak valid.
 *       401:
 *         description: Tidak terautentikasi.
 *       403:
 *         description: Tidak memiliki permission untuk operasi tertentu.
 */
adminRouter.post("/members/bulk-kick", (req, res, next) =>
  adminController.bulkKickMembers(req, res, next),
);

export default adminRouter;
