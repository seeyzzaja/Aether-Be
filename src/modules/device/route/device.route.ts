import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { deviceController } from "#modules/device/controller/device.controller";

const deviceRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Device Management
 *   description: Manajemen perangkat dan sesi aktif pengguna
 */

/**
 * @swagger
 * /api/device/sessions:
 *   get:
 *     summary: Melihat seluruh sesi aktif pengguna
 *     tags: [Device Management]
 *     description: Menampilkan seluruh sesi aktif yang dimiliki oleh pengguna yang sedang login.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar sesi aktif berhasil diambil
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
 *                   example: Daftar sesi aktif berhasil diambil
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       deviceInfo:
 *                         type: string
 *                         nullable: true
 *                       ipAddress:
 *                         type: string
 *                         nullable: true
 *                       expiresAt:
 *                         type: string
 *                         format: date-time
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 errors:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Token tidak valid, kedaluwarsa, atau sesi sudah dicabut
 *       500:
 *         description: Terjadi kesalahan internal server
 */
deviceRouter.get("/sessions", requireAuth, deviceController.getActiveSessions);

/**
 * @swagger
 * /api/device/sessions/{sessionId}:
 *   delete:
 *     summary: Mencabut sesi tertentu
 *     tags: [Device Management]
 *     description: Mencabut sesi milik pengguna berdasarkan session ID dengan mengisi nilai revokedAt.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID sesi yang akan dicabut
 *     responses:
 *       200:
 *         description: Sesi berhasil dicabut
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
 *                   example: Sesi berhasil dicabut
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 errors:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Token tidak valid atau pengguna tidak memiliki akses ke sesi tersebut
 *       404:
 *         description: Sesi tidak ditemukan atau sudah dicabut
 *       500:
 *         description: Terjadi kesalahan internal server
 */
deviceRouter.delete("/sessions/:sessionId", requireAuth, deviceController.revokeSession);

export default deviceRouter;
