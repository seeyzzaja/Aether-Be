import {
  countNotificationsByUserId,
  createNotification,
  findNotificationById,
  findNotificationsByUserId,
  getUserEmailNotificationPreference,
  markNotificationAsRead,
} from "#modules/notification/repository/notification.repository";
import { AppError } from "#shared/errors/app-error";
import { logger } from "#shared/logger/logger";
import { emailQueue } from "#shared/queue/email.queue";

export async function getNotifications(userId: string, skip: number, take: number) {
  const [notifications, total] = await Promise.all([
    findNotificationsByUserId(userId, skip, take),
    countNotificationsByUserId(userId),
  ]);

  return {
    notifications,
    total,
    skip,
    take,
  };
}

export async function markAsRead(notificationId: string, userId: string) {
  const notification = await findNotificationById(notificationId);

  if (!notification) {
    throw new AppError("Notifikasi tidak ditemukan", 404);
  }

  if (notification.userId !== userId) {
    throw new AppError("Anda tidak memiliki akses ke notifikasi ini", 403);
  }

  if (notification.isRead) {
    return notification;
  }

  return markNotificationAsRead(notificationId);
}
export async function createUserNotification(data: {
  userId: string;
  type: string;
  payload: object;
}) {
  return createNotification(data);
}
export async function enqueueEmailNotification(data: {
  userId: string;
  subject: string;
  text: string;
  html: string;
}) {
  logger.info({ userId: data.userId }, "Email notification enqueue started");

  const user = await getUserEmailNotificationPreference(data.userId);

  logger.info(
    {
      userId: data.userId,
      found: Boolean(user),
      email: user?.email,
      enabled: user?.emailNotificationEnabled,
    },
    "Email notification preference checked",
  );

  if (!user?.emailNotificationEnabled) {
    logger.info({ userId: data.userId }, "Email notification skipped");

    return null;
  }

  const job = await emailQueue.add("notification-email", {
    to: user.email,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  logger.info(
    {
      userId: data.userId,
      jobId: job.id,
      to: user.email,
    },
    "Email notification job queued",
  );

  return job;
}
