import { Router } from "express";

import { requireAuth } from "#middlewares/auth-middleware";
import { categoryController } from "#modules/category/controller/category.controller";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   - name: Category
 *     description: Manajemen category dalam server Aether
 */

/**
 * @swagger
 * /api/category/{serverId}/category:
 *   post:
 *     summary: Membuat category baru
 *     tags:
 *       - Category
 *     description: Membuat category baru pada server. Hanya Owner server yang dapat membuat category.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: path
 *         required: true
 *         description: UUID server tempat category dibuat
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: General
 *     responses:
 *       201:
 *         description: Category berhasil dibuat
 *       400:
 *         description: Data request atau Server ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan Owner server
 *       404:
 *         description: Server tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
const categoryPaths = {
  collection: ["/:serverId/category", "/:serverId/categories"],
  item: ["/:serverId/category/:categoryId", "/:serverId/categories/:categoryId"],
};

router.post(categoryPaths.collection, (req, res, next) =>
  categoryController.create(req, res, next),
);

/**
 * @swagger
 * /api/category/{serverId}/category:
 *   get:
 *     summary: Mengambil semua category dalam server
 *     tags:
 *       - Category
 *     description: Mengambil seluruh category dalam server berdasarkan urutan position. Endpoint dapat diakses oleh Owner dan member server.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: path
 *         required: true
 *         description: UUID server
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Daftar category berhasil diambil
 *       400:
 *         description: Server ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan member dari server
 *       404:
 *         description: Server tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get(categoryPaths.collection, (req, res, next) => categoryController.getAll(req, res, next));

/**
 * @swagger
 * /api/category/{serverId}/category/{categoryId}:
 *   get:
 *     summary: Mengambil detail category
 *     tags:
 *       - Category
 *     description: Mengambil detail category berdasarkan ID. Endpoint dapat diakses oleh Owner dan member server.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: path
 *         required: true
 *         description: UUID server
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: UUID category
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detail category berhasil diambil
 *       400:
 *         description: Server ID atau Category ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan member dari server
 *       404:
 *         description: Server atau Category tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.get(categoryPaths.item, (req, res, next) => categoryController.getById(req, res, next));

/**
 * @swagger
 * /api/category/{serverId}/category/{categoryId}:
 *   patch:
 *     summary: Mengubah category
 *     tags:
 *       - Category
 *     description: Mengubah nama category. Hanya Owner server yang dapat mengubah category.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: path
 *         required: true
 *         description: UUID server
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: UUID category
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: Information
 *     responses:
 *       200:
 *         description: Category berhasil diperbarui
 *       400:
 *         description: Data request, Server ID, atau Category ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan Owner server
 *       404:
 *         description: Server atau Category tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.patch(categoryPaths.item, (req, res, next) => categoryController.update(req, res, next));

/**
 * @swagger
 * /api/category/{serverId}/category/{categoryId}:
 *   delete:
 *     summary: Menghapus category
 *     tags:
 *       - Category
 *     description: Menghapus category berdasarkan ID. Channel yang berada di dalam category tidak ikut terhapus dan categoryId pada channel akan menjadi null. Hanya Owner server yang dapat menghapus category.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serverId
 *         in: path
 *         required: true
 *         description: UUID server
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: UUID category
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category berhasil dihapus
 *       400:
 *         description: Server ID atau Category ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan Owner server
 *       404:
 *         description: Server atau Category tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
router.delete(categoryPaths.item, (req, res, next) => categoryController.delete(req, res, next));

export default router;
