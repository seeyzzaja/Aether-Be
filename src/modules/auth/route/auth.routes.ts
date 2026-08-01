import { Router } from "express";
import { requireAuth } from "#middlewares/auth-middleware";
import { authController } from "../controller/auth.controller.js";

const authRouter = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Registrasi Akun Baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, username, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 example: user_dev
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Validasi data gagal
 *       409:
 *         description: Email atau username sudah digunakan
 *       500:
 *         description: Kesalahan internal server
 */
authRouter.post("/register", authController.register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Login Pengguna
 *     tags: [Auth]
 *     description: Mengembalikan `accessToken` dan `refreshToken`, serta menyimpan keduanya ke cookie HttpOnly.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emailOrUsername, password]
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *                 example: user_dev
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan access token dan refresh token
 *       401:
 *         description: Email/username atau password salah
 *       400:
 *         description: Validasi data gagal
 *       500:
 *         description: Kesalahan internal server
 */
authRouter.post("/login", authController.login);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh Access Token
 *     tags: [Auth]
 *     description: Mengambil refresh token dari cookie HttpOnly atau body JSON jika cookie tidak tersedia.
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: false
 *         schema:
 *           type: string
 *         description: Refresh token HttpOnly cookie
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token mentah untuk fallback jika cookie tidak tersedia
 *     responses:
 *       200:
 *         description: Access token baru berhasil diterbitkan
 *       401:
 *         description: Refresh token tidak valid atau kedaluwarsa
 *       500:
 *         description: Kesalahan internal server
 */
authRouter.post("/refresh", authController.refresh);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout Pengguna & Cabut Sesi
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     description: Bisa dipanggil dengan header Authorization Bearer atau cookie HttpOnly accessToken.
 *     responses:
 *       200:
 *         description: Logout berhasil
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Kesalahan internal server
 */
authRouter.post("/logout", requireAuth, authController.logout);

/**
 * @openapi
 * /api/v1/auth/sessions:
 *   get:
 *     summary: Daftar Sesi & Perangkat Aktif
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     description: Bisa dipanggil dengan header Authorization Bearer atau cookie HttpOnly accessToken.
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar sesi aktif
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Kesalahan internal server
 */
authRouter.get("/sessions", requireAuth, authController.getSessions);

/**
 * @openapi
 * /api/v1/auth/sessions/{sessionId}:
 *   delete:
 *     summary: Cabut Sesi / Perangkat Spesifik
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     description: Bisa dipanggil dengan header Authorization Bearer atau cookie HttpOnly accessToken.
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Sesi yang akan dicabut
 *     responses:
 *       200:
 *         description: Sesi berhasil dicabut
 *       400:
 *         description: Session ID wajib disertakan
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sesi tidak ditemukan
 *       500:
 *         description: Kesalahan internal server
 */
authRouter.delete("/sessions/:sessionId", requireAuth, authController.revokeSession);

export default authRouter;
