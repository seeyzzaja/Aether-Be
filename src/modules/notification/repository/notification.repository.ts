import prisma from "#utils/prisma";

export async function createNotification(data: { userId: string; type: string; payload: object }) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      payload: data.payload,
    },
  });
}

export async function findNotificationsByUserId(userId: string, skip: number, take: number) {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
  });
}

export async function countNotificationsByUserId(userId: string) {
  return prisma.notification.count({
    where: {
      userId,
    },
  });
}

export async function findNotificationById(id: string) {
  return prisma.notification.findUnique({
    where: {
      id,
    },
  });
}

export async function markNotificationAsRead(id: string) {
  return prisma.notification.update({
    where: {
      id,
    },
    data: {
      isRead: true,
    },
  });
}

export async function getUserEmailNotificationPreference(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
      emailNotificationEnabled: true,
    },
  });
}
