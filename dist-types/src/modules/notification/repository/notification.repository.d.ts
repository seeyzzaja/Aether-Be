export declare function createNotification(data: {
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
export declare function findNotificationsByUserId(userId: string, skip: number, take: number): Promise<{
    id: string;
    userId: string;
    type: string;
    payload: import("@prisma/client/runtime/client").JsonValue;
    isRead: boolean;
    createdAt: Date;
}[]>;
export declare function countNotificationsByUserId(userId: string): Promise<number>;
export declare function findNotificationById(id: string): Promise<{
    id: string;
    userId: string;
    type: string;
    payload: import("@prisma/client/runtime/client").JsonValue;
    isRead: boolean;
    createdAt: Date;
} | null>;
export declare function markNotificationAsRead(id: string): Promise<{
    id: string;
    userId: string;
    type: string;
    payload: import("@prisma/client/runtime/client").JsonValue;
    isRead: boolean;
    createdAt: Date;
}>;
export declare function getUserEmailNotificationPreference(userId: string): Promise<{
    email: string;
    emailNotificationEnabled: boolean;
} | null>;
//# sourceMappingURL=notification.repository.d.ts.map