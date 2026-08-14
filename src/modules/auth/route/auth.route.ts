import { Router } from "express";
import { requireAuth } from "#middlewares/auth-middleware";
import { loginRateLimiter, registerRateLimiter } from "#middlewares/rate-limiters";
import { authController } from "#modules/auth/controller/auth.controller";

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Manajemen autentikasi pengguna
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Mendaftarkan user baru
 *     tags: [Auth]
 *     description: Membuat akun user baru. Endpoint dibatasi maksimal 3 request per 1 jam berdasarkan IP address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 example: seeyzz
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: password123
 *     responses:
 *       201:
 *         description: Registrasi berhasil
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
 *                   example: Registrasi berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 69fe24b7-84b5-4342-b08a-bd1426471724
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@example.com
 *                     username:
 *                       type: string
 *                       example: seeyzz
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Data request tidak valid
 *       409:
 *         description: Email atau username sudah terdaftar
 *       429:
 *         description: Terlalu banyak request registrasi dalam waktu yang ditentukan
 *         headers:
 *           X-RateLimit-Limit:
 *             description: Maksimal request yang diperbolehkan dalam window
 *             schema:
 *               type: integer
 *               example: 3
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
 *               example: 3600
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
authRouter.post("/register", registerRateLimiter, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     description: Melakukan autentikasi user. Rate limit diterapkan berdasarkan kombinasi IP address dan email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login berhasil
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
 *                   example: Login berhasil
 *                 data:
 *                   type: object
 *                   properties:
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
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Data request tidak valid
 *       401:
 *         description: Email atau password salah
 *       429:
 *         description: Terlalu banyak percobaan login
 *         headers:
 *           X-RateLimit-Limit:
 *             description: Maksimal request dalam 1 menit
 *             schema:
 *               type: integer
 *               example: 5
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
authRouter.post("/login", loginRateLimiter, authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout pengguna
 *     tags: [Auth]
 *     description: Mencabut sesi pengguna yang sedang aktif dan menghapus token dari cookie.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
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
 *                   example: Logout berhasil
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 errors:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Token tidak valid, kedaluwarsa, atau sesi sudah dicabut
 *       500:
 *         description: Terjadi kesalahan internal server
 */
authRouter.post("/logout", requireAuth, authController.logout);
export default authRouter;
