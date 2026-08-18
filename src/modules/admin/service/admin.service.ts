import { adminRepository } from "#modules/admin/repository/admin.repository";
import { auditService } from "#modules/audit/service/audit.service";
import { authRepository } from "#modules/auth/repository/auth.repository";
import { membershipService } from "#modules/membership/service/membership.service";
import { messageService } from "#modules/message/service/message.service";
import { isPlatformAdmin } from "#shared/auth/platform-admin";
import { ForbiddenError, NotFoundError } from "#shared/errors/app-error";

export class AdminService {
  private ensurePlatformAdmin(userId: string) {
    if (!isPlatformAdmin(userId)) {
      throw new ForbiddenError("Kamu tidak memiliki akses ke admin panel");
    }
  }

  async listUsers(
    actorId: string,
    query: {
      q?: string;
      email?: string;
      username?: string;
      suspended?: boolean;
      page: number;
      limit: number;
    },
  ) {
    this.ensurePlatformAdmin(actorId);

    const [users, total] = await Promise.all([
      adminRepository.findUsers(query),
      adminRepository.countUsers(query),
    ]);

    return { users, total };
  }

  async suspendUser(actorId: string, userId: string) {
    this.ensurePlatformAdmin(actorId);

    const existingUser = await authRepository.findUserById(userId);

    if (!existingUser) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const user = await adminRepository.suspendUser(userId);

    await auditService.log({
      actorId,
      action: "admin.user_suspend",
      targetType: "user",
      targetId: userId,
      metadata: {
        targetUserId: userId,
        targetEmail: user.email,
        targetUsername: user.username,
        suspendedAt: user.deletedAt,
      },
    });

    return user;
  }

  async listAuditLogs(
    actorId: string,
    query: {
      actorId?: string;
      action?: string;
      targetId?: string;
      targetType?: string;
      startTime?: Date;
      endTime?: Date;
      page: number;
      limit: number;
    },
  ) {
    this.ensurePlatformAdmin(actorId);

    const [auditLogs, total] = await Promise.all([
      adminRepository.findAuditLogs(query),
      adminRepository.countAuditLogs(query),
    ]);

    return { auditLogs, total };
  }

  async bulkDeleteMessages(actorId: string, messageIds: string[]) {
    this.ensurePlatformAdmin(actorId);

    const results: Array<{
      messageId: string;
      status: "deleted" | "forbidden" | "not_found";
      error?: string;
    }> = [];

    for (const messageId of messageIds) {
      const message = await adminRepository.findMessageForAdmin(messageId);

      if (!message) {
        results.push({ messageId, status: "not_found", error: "Pesan tidak ditemukan" });
        continue;
      }

      try {
        await messageService.delete(messageId, actorId);
        results.push({ messageId, status: "deleted" });
      } catch (error) {
        results.push({
          messageId,
          status: "forbidden",
          error: error instanceof Error ? error.message : "Gagal menghapus pesan",
        });
      }
    }

    await auditService.log({
      actorId,
      action: "message.bulk_delete",
      targetType: "message",
      targetId: "bulk",
      metadata: {
        messageIds,
        results,
      },
    });

    return results;
  }

  async bulkKickMembers(actorId: string, memberIds: string[]) {
    this.ensurePlatformAdmin(actorId);

    const results: Array<{
      memberId: string;
      status: "kicked" | "forbidden" | "not_found";
      error?: string;
    }> = [];

    for (const memberId of memberIds) {
      const member = await adminRepository.findMemberById(memberId);

      if (!member) {
        results.push({ memberId, status: "not_found", error: "Member tidak ditemukan" });
        continue;
      }

      try {
        await membershipService.kickMember(member.serverId, actorId, member.id);
        results.push({ memberId, status: "kicked" });
      } catch (error) {
        results.push({
          memberId,
          status: "forbidden",
          error: error instanceof Error ? error.message : "Gagal meng-kick member",
        });
      }
    }

    await auditService.log({
      actorId,
      action: "member.bulk_kick",
      targetType: "member",
      targetId: "bulk",
      metadata: {
        memberIds,
        results,
      },
    });

    return results;
  }
}

export const adminService = new AdminService();
