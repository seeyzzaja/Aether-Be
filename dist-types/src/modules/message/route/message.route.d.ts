declare const router: import("express-serve-static-core").Router;
/**
 * @swagger
 * /api/message/{messageId}:
 *   delete:
 *     summary: Menghapus pesan
 *     tags: [Message]
 *     description: Menghapus pesan secara soft delete. Hanya pengirim asli atau pengguna dengan MANAGE_MESSAGES yang dapat menghapus pesan.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: UUID pesan
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pesan berhasil dihapus
 *       400:
 *         description: Message ID tidak valid
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *       403:
 *         description: Pengguna bukan pengirim asli dan tidak memiliki MANAGE_MESSAGES
 *       404:
 *         description: Pesan tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan internal server
 */
export default router;
//# sourceMappingURL=message.route.d.ts.map