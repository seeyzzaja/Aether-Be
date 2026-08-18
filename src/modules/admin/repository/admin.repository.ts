import prisma from "#utils/prisma";

export class AdminRepository {
  async findUsers(options: {
    q?: string;
    email?: string;
    username?: string;
    suspended?: boolean;
    page: number;
    limit: number;
  }) {
    const skip = (options.page - 1) * options.limit;

    return prisma.user.findMany({
      where: {
        ...(options.email && { email: options.email }),
        ...(options.username && { username: options.username }),
        ...(options.suspended !== undefined && {
          deletedAt: options.suspended ? { not: null } : null,
        }),
        ...(options.q && {
          OR: [
            { email: { contains: options.q, mode: "insensitive" } },
            { username: { contains: options.q, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        emailVerifiedAt: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: options.limit,
    });
  }

  async countUsers(options: {
    q?: string;
    email?: string;
    username?: string;
    suspended?: boolean;
  }) {
    return prisma.user.count({
      where: {
        ...(options.email && { email: options.email }),
        ...(options.username && { username: options.username }),
        ...(options.suspended !== undefined && {
          deletedAt: options.suspended ? { not: null } : null,
        }),
        ...(options.q && {
          OR: [
            { email: { contains: options.q, mode: "insensitive" } },
            { username: { contains: options.q, mode: "insensitive" } },
          ],
        }),
      },
    });
  }

  async suspendUser(userId: string) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          deletedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          username: true,
          deletedAt: true,
          updatedAt: true,
        },
      });

      await tx.session.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      return user;
    });
  }

  async findAuditLogs(options: {
    actorId?: string;
    action?: string;
    targetId?: string;
    targetType?: string;
    startTime?: Date;
    endTime?: Date;
    page: number;
    limit: number;
  }) {
    const skip = (options.page - 1) * options.limit;

    return prisma.auditLog.findMany({
      where: {
        ...(options.actorId && { actorId: options.actorId }),
        ...(options.action && { action: options.action }),
        ...(options.targetId && { targetId: options.targetId }),
        ...(options.targetType && { targetType: options.targetType }),
        ...(options.startTime || options.endTime
          ? {
              createdAt: {
                ...(options.startTime && { gte: options.startTime }),
                ...(options.endTime && { lte: options.endTime }),
              },
            }
          : {}),
      },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: options.limit,
    });
  }

  async countAuditLogs(options: {
    actorId?: string;
    action?: string;
    targetId?: string;
    targetType?: string;
    startTime?: Date;
    endTime?: Date;
  }) {
    return prisma.auditLog.count({
      where: {
        ...(options.actorId && { actorId: options.actorId }),
        ...(options.action && { action: options.action }),
        ...(options.targetId && { targetId: options.targetId }),
        ...(options.targetType && { targetType: options.targetType }),
        ...(options.startTime || options.endTime
          ? {
              createdAt: {
                ...(options.startTime && { gte: options.startTime }),
                ...(options.endTime && { lte: options.endTime }),
              },
            }
          : {}),
      },
    });
  }

  async findMessageForAdmin(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        channel: {
          select: {
            id: true,
            serverId: true,
          },
        },
      },
    });
  }

  async findMemberById(memberId: string) {
    return prisma.serverMember.findUnique({
      where: {
        id: memberId,
      },
      include: {
        server: {
          select: {
            id: true,
            ownerId: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            deletedAt: true,
          },
        },
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }
}

export const adminRepository = new AdminRepository();
