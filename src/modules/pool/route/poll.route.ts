import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { pollController } from "../controller/poll.controller.js";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   - name: Poll
 *     description: Manajemen polling pada pesan
 */

/**
 * @swagger
 * /api/messages/{messageId}/poll:
 *   post:
 *     summary: Membuat poll pada pesan
 *     tags: [Poll]
 *     description: Membuat sebuah polling yang melekat pada satu pesan. Poll mendukung single-choice maupun multiple-choice.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: UUID pesan yang akan memiliki poll
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - options
 *             properties:
 *               question:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 description: Pertanyaan polling
 *                 example: Bahasa pemrograman favorit kamu?
 *               options:
 *                 type: array
 *                 minItems: 2
 *                 maxItems: 20
 *                 description: Daftar pilihan jawaban polling
 *                 items:
 *                   type: string
 *                   minLength: 1
 *                   maxLength: 255
 *                 example:
 *                   - JavaScript
 *                   - TypeScript
 *                   - Python
 *               allowMultipleChoice:
 *                 type: boolean
 *                 default: false
 *                 description: Menentukan apakah user boleh memilih lebih dari satu opsi
 *                 example: false
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Waktu berakhirnya polling
 *                 example: 2026-08-20T12:00:00.000Z
 *           example:
 *             question: Bahasa pemrograman favorit kamu?
 *             options:
 *               - JavaScript
 *               - TypeScript
 *               - Python
 *             allowMultipleChoice: true
 *             expiresAt: 2026-08-20T12:00:00.000Z
 *     responses:
 *       201:
 *         description: Poll berhasil dibuat
 *       400:
 *         description: Data request atau Message ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki permission SEND_MESSAGES atau pesan sudah memiliki poll
 *       404:
 *         description: Pesan atau channel tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/messages/:messageId/poll", (req, res, next) => pollController.create(req, res, next));

/**
 * @swagger
 * /api/polls/{pollId}/votes:
 *   post:
 *     summary: Memberikan vote pada poll
 *     tags: [Poll]
 *     description: Memberikan suara pada satu atau beberapa opsi poll sesuai konfigurasi allowMultipleChoice.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pollId
 *         in: path
 *         required: true
 *         description: UUID polling
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - optionIds
 *             properties:
 *               optionIds:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 20
 *                 description: UUID opsi yang dipilih
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example:
 *                   - 8c4e1c25-1fca-4fb3-a4e2-7fc4dc1b8a01
 *                   - 2f63fc36-40d8-44b7-a60f-3f84e3443d9d
 *           examples:
 *             singleChoice:
 *               summary: Single-choice
 *               value:
 *                 optionIds:
 *                   - 8c4e1c25-1fca-4fb3-a4e2-7fc4dc1b8a01
 *             multipleChoice:
 *               summary: Multiple-choice
 *               value:
 *                 optionIds:
 *                   - 8c4e1c25-1fca-4fb3-a4e2-7fc4dc1b8a01
 *                   - 2f63fc36-40d8-44b7-a60f-3f84e3443d9d
 *     responses:
 *       200:
 *         description: Vote berhasil disimpan
 *       400:
 *         description: Data request atau Poll ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: User tidak memiliki permission, poll single-choice menerima lebih dari satu opsi, poll sudah ditutup, atau user sudah memilih opsi tersebut
 *       404:
 *         description: Poll atau opsi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.post("/polls/:pollId/votes", (req, res, next) => pollController.vote(req, res, next));

export default router;
