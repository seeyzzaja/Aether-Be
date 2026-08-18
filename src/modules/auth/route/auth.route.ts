import { Router } from "express";

import { requireCsrf } from "#middlewares/csrf.middleware";
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
 *     description: |
 *       Melakukan autentikasi user. Rate limit diterapkan berdasarkan kombinasi
 *       IP address dan email. Setelah login berhasil, refresh token disimpan
 *       sebagai HttpOnly cookie dan tidak dikembalikan dalam response JSON.
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
 *         headers:
 *           Set-Cookie:
 *             description: |
 *               Refresh token disimpan sebagai HttpOnly, Secure, SameSite=Strict
 *               cookie dan tidak dikembalikan dalam response body.
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGciOiJIUzI1NiIs...; Path=/api/auth; HttpOnly; Secure; SameSite=Strict
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
 *                           example: 69fe24b7-84b5-4342-b08a-bd1426471724
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: user@example.com
 *                         username:
 *                           type: string
 *                           example: seeyzz
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token yang digunakan melalui Authorization Bearer.
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
 * /api/auth/google:
 *   get:
 *     summary: Redirect ke Google OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect ke Google
 */

authRouter.get("/google", (req, res, next) => authController.oauthLogin(req, res, next, "GOOGLE"));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback Google OAuth
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *       - in: query
 *         name: error
 *         schema:
 *           type: string
 *       - in: query
 *         name: error_description
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Login OAuth berhasil
 *       302:
 *         description: Redirect ke frontend success URL jika ada
 *       401:
 *         description: State atau code tidak valid
 */

authRouter.get("/google/callback", (req, res, next) =>
  authController.oauthCallback(req, res, next, "GOOGLE"),
);

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: Redirect ke GitHub OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect ke GitHub
 */

authRouter.get("/github", (req, res, next) => authController.oauthLogin(req, res, next, "GITHUB"));

/**
 * @swagger
 * /api/auth/github/callback:
 *   get:
 *     summary: Callback GitHub OAuth
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Login OAuth berhasil
 *       401:
 *         description: State atau code tidak valid
 */

authRouter.get("/github/callback", (req, res, next) =>
  authController.oauthCallback(req, res, next, "GITHUB"),
);

/**
 * @swagger
 * /api/auth/facebook:
 *   get:
 *     summary: Redirect ke Facebook OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect ke Facebook
 */

authRouter.get("/facebook", (req, res, next) =>
  authController.oauthLogin(req, res, next, "FACEBOOK"),
);

/**
 * @swagger
 * /api/auth/facebook/callback:
 *   get:
 *     summary: Callback Facebook OAuth
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Login OAuth berhasil
 *       401:
 *         description: State atau code tidak valid
 */

authRouter.get("/facebook/callback", (req, res, next) =>
  authController.oauthCallback(req, res, next, "FACEBOOK"),
);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verifikasi email pengguna
 *     tags: [Auth]
 *     description: |
 *       Memverifikasi email menggunakan kode 6 digit yang dikirim
 *       setelah registrasi. Kode berlaku selama 10 menit.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *                 example: "482913"
 *     responses:
 *       200:
 *         description: Email berhasil diverifikasi
 *       400:
 *         description: Data request tidak valid
 *       401:
 *         description: Kode tidak valid atau sudah kedaluwarsa
 *       500:
 *         description: Internal server error
 */
authRouter.post("/verify-email", authController.verifyEmail);

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Kirim ulang kode verifikasi email
 *     tags: [Auth]
 *     description: Mengirim kode verifikasi baru ke email pengguna.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Kode verifikasi berhasil dikirim
 *       400:
 *         description: Format email tidak valid
 *       401:
 *         description: Email tidak ditemukan
 *       409:
 *         description: Email sudah diverifikasi
 *       500:
 *         description: Internal server error
 */
authRouter.post("/resend-verification", authController.resendVerification);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Meminta kode reset password
 *     tags: [Auth]
 *     description: |
 *       Mengirim kode reset password ke email pengguna.
 *       Endpoint tidak membocorkan apakah email terdaftar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Permintaan reset password diproses
 *       400:
 *         description: Format email tidak valid
 *       500:
 *         description: Internal server error
 */
authRouter.post("/forgot-password", authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password menggunakan kode
 *     tags: [Auth]
 *     description: |
 *       Mengubah password menggunakan kode reset yang dikirim
 *       melalui email. Seluruh session aktif akan dicabut setelah
 *       password berhasil diubah.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *                 example: "739251"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 *       400:
 *         description: Data request tidak valid
 *       401:
 *         description: Kode reset tidak valid atau sudah kedaluwarsa
 *       500:
 *         description: Internal server error
 */
authRouter.post("/reset-password", authController.resetPassword);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Memperbarui access token
 *     tags: [Auth]
 *     description: |
 *       Memperbarui access token menggunakan refresh token yang disimpan
 *       dalam HttpOnly cookie.
 *
 *       Endpoint ini dilindungi CSRF dengan header X-Requested-With.
 *       Refresh token juga di-rotate setelah berhasil digunakan.
 *     parameters:
 *       - in: header
 *         name: X-Requested-With
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - XMLHttpRequest
 *         example: XMLHttpRequest
 *         description: Header CSRF yang wajib dikirim untuk request berbasis cookie.
 *     responses:
 *       200:
 *         description: Access token berhasil diperbarui
 *         headers:
 *           Set-Cookie:
 *             description: |
 *               Refresh token baru disimpan sebagai HttpOnly, Secure,
 *               SameSite=Strict cookie dan tidak dikembalikan dalam response body.
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGciOiJIUzI1NiIs...; Path=/api/auth; HttpOnly; Secure; SameSite=Strict
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
 *                   example: Token berhasil diperbarui
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token baru.
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: |
 *           Refresh token tidak ditemukan, tidak valid, sudah kedaluwarsa,
 *           atau sesi sudah dicabut.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Refresh token tidak ditemukan
 *       403:
 *         description: Header CSRF tidak valid atau tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "CSRF protection: header X-Requested-With tidak valid"
 *       429:
 *         description: Terlalu banyak request refresh token
 *         headers:
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
authRouter.post("/refresh", requireCsrf, authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout pengguna
 *     tags: [Auth]
 *     description: |
 *       Mencabut sesi pengguna yang sedang aktif dan menghapus refresh token
 *       dari cookie. Endpoint ini dilindungi CSRF menggunakan header
 *       X-Requested-With.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: X-Requested-With
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - XMLHttpRequest
 *         example: XMLHttpRequest
 *         description: Header CSRF yang wajib dikirim untuk request berbasis cookie.
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
 *         description: |
 *           Token autentikasi tidak valid, kedaluwarsa, tidak ditemukan,
 *           atau sesi sudah dicabut.
 *       403:
 *         description: Header CSRF tidak valid atau tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "CSRF protection: header X-Requested-With tidak valid"
 *       500:
 *         description: Terjadi kesalahan internal server
 */
authRouter.post("/logout", requireCsrf, authController.logout);

export default authRouter;
