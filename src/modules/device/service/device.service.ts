import { auditService } from "#modules/audit/service/audit.service";
import { deviceRepository } from "#modules/device/repository/device.repository";
import { UnauthorizedError } from "#shared/errors/app-error";

export class DeviceService {
  async getActiveSessions(userId: string) {
    return deviceRepository.findActiveSessionsByUserId(userId);
  }

  async revokeSession(sessionId: string, userId: string) {
    const result = await deviceRepository.revokeSession(sessionId, userId);

    if (result.count === 0) {
      throw new UnauthorizedError("Sesi tidak ditemukan atau sudah dicabut");
    }

    await auditService.log({
      actorId: userId,
      action: "SESSION_REVOKE",
      targetType: "SESSION",
      targetId: sessionId,
      metadata: {
        sessionId,
      },
    });
  }
}

export const deviceService = new DeviceService();
