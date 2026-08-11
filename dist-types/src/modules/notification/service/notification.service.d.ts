export declare function getNotifications(userId: string, skip: number, take: number): Promise<{
    notifications: {
        id: string;
        userId: string;
        type: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        isRead: boolean;
        createdAt: Date;
    }[];
    total: number;
    skip: number;
    take: number;
}>;
export declare function markAsRead(notificationId: string, userId: string): Promise<{
    id: string;
    userId: string;
    type: string;
    payload: import("@prisma/client/runtime/client").JsonValue;
    isRead: boolean;
    createdAt: Date;
}>;
export declare function createUserNotification(data: {
    userId: string;
    type: string;
    payload: object;
}): Promise<{
    id: string;
    userId: string;
    type: string;
    payload: import("@prisma/client/runtime/client").JsonValue;
    isRead: boolean;
    createdAt: Date;
}>;
export declare function enqueueEmailNotification(data: {
    userId: string;
    subject: string;
    text: string;
    html: string;
}): Promise<import("bullmq").Job<import("#shared/queue/email.queue").EmailNotificationJob, any, string> | null>;
//# sourceMappingURL=notification.service.d.ts.map