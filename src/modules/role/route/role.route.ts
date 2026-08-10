import { Router } from "express";
import { requireAuth } from "#middlewares/auth-middleware";
import { RoleController } from "#modules/role/controller/role.controller";

const router = Router({
  mergeParams: true,
});

const roleController = new RoleController();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Manajemen role server
 */

/**
 * @swagger
 * /api/role/{serverId}:
 *   post:
 *     summary: Buat role baru
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID server
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - permissions
 *             properties:
 *               name:
 *                 type: string
 *                 example: Moderator
 *               permissions:
 *                 type: string
 *                 example: "1023"
 *     responses:
 *       201:
 *         description: Role berhasil dibuat
 */
router.post("/:serverId", roleController.create.bind(roleController));

/**
 * @swagger
 * /api/role/{serverId}:
 *   get:
 *     summary: Ambil semua role dalam server
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Role berhasil diambil
 */
router.get("/:serverId", roleController.findAll.bind(roleController));

/**
 * @swagger
 * /api/role/{serverId}/{roleId}:
 *   get:
 *     summary: Ambil detail role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detail role berhasil diambil
 */
router.get("/:serverId/:roleId", roleController.findById.bind(roleController));

/**
 * @swagger
 * /api/role/{serverId}/{roleId}:
 *   patch:
 *     summary: Perbarui role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Senior Moderator
 *               permissions:
 *                 type: string
 *                 example: "2047"
 *               color:
 *                 type: string
 *                 example: "#5865F2"
 *     responses:
 *       200:
 *         description: Role berhasil diperbarui
 */
router.patch("/:serverId/:roleId", roleController.update.bind(roleController));

/**
 * @swagger
 * /api/role/{serverId}/{roleId}:
 *   delete:
 *     summary: Hapus role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Role berhasil dihapus
 */
router.delete("/:serverId/:roleId", roleController.delete.bind(roleController));

export default router;
