import { Router } from "express";
import { requireAuth } from "#middlewares/auth-middleware";
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
 *     summary: Register pengguna baru
 *     tags: [Auth]
 *     description: Membuat akun pengguna baru. Password akan di-hash menggunakan Argon2id sebelum disimpan ke database.
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
 *                 example: aether_user
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: Password123!
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
 *                     email:
 *                       type: string
 *                       format: email
 *                     username:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Data request tidak valid
 *       409:
 *         description: Email atau username sudah terdaftar
 *       500:
 *         description: Terjadi kesalahan internal server
 */
authRouter.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
 *     description: Memverifikasi email dan password, lalu menerbitkan access token dan refresh token.
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
 *                 format: password
 *                 example: Password123!
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
 *                       description: JWT access token dengan masa berlaku 15 menit
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token dengan masa berlaku 7 hari
 *       400:
 *         description: Data request tidak valid
 *       401:
 *         description: Email atau password salah
 *       500:
 *         description: Terjadi kesalahan internal server
 */
authRouter.post("/login", authController.login);

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
