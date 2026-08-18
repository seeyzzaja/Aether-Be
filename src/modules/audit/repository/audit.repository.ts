import { Prisma } from "#prisma/generated/prisma/client";
import prisma from "#utils/prisma";

export type CreateAuditLogInput = {
  actorId?: string | null;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Prisma.InputJsonObject;
};

export const auditRepository = {
  async create(data: CreateAuditLogInput) {
    return prisma.auditLog.create({
      data: {
        actorId: data.actorId ?? null,
        action: data.action,
        targetType: data.targetType,
        targetId: data.targetId,
        metadata: data.metadata ?? Prisma.JsonNull,
      },
    });
  },
};
