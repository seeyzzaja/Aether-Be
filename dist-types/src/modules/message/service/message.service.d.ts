import type { CreateMessageInput, UpdateMessageInput } from "#modules/message/schema/message.schema";
type MessageWarningFlags = {
    suspiciousLink: boolean;
    antiSpam: {
        duplicate: boolean;
        throttled: boolean;
        reviewFlagged: boolean;
    };
};
export declare class MessageService {
    private runInBackground;
    private getActorPermissions;
    private ensureSendMessagesPermission;
    private ensureViewChannelPermission;
    private checkDuplicateThrottle;
    private assessMessageWarnings;
    private flagAntiSpamThrottle;
    private flagSuspiciousLinkWarning;
    private getMessage;
    authorizeChannelAccess(channelId: string, userId: string): Promise<void>;
    private ensureChannelAccess;
    create(channelId: string, userId: string, input: CreateMessageInput): Promise<{
        id: string;
        channelId: string;
        authorId: string;
        replyToId: string | null;
        threadRootId: string | null;
        content: string;
        isPinned: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        moderation: MessageWarningFlags;
        attachments: {
            id: string;
            messageId: string | null;
            fileUrl: string;
            thumbnailUrl: string | null;
            fileType: string;
            fileSize: bigint;
            fileName: string;
        }[];
    }>;
    forward(messageId: string, userId: string, destinationChannelId: string): Promise<{
        attachments: {
            id: string;
            messageId: string | null;
            fileUrl: string;
            thumbnailUrl: string | null;
            fileType: string;
            fileSize: bigint;
            fileName: string;
        }[];
    } & {
        id: string;
        channelId: string;
        authorId: string;
        replyToId: string | null;
        threadRootId: string | null;
        content: string;
        isPinned: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(messageId: string, userId: string, input: UpdateMessageInput): Promise<{
        id: string;
        channelId: string;
        authorId: string;
        replyToId: string | null;
        threadRootId: string | null;
        content: string;
        isPinned: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    delete(messageId: string, userId: string): Promise<{
        id: string;
        channelId: string;
        authorId: string;
        replyToId: string | null;
        threadRootId: string | null;
        content: string;
        isPinned: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    private getChannel;
    private ensureValidReplyTarget;
    private ensureValidThreadRoot;
    pin(messageId: string, userId: string): Promise<{
        id: string;
        channelId: string;
        authorId: string;
        replyToId: string | null;
        threadRootId: string | null;
        content: string;
        isPinned: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | {
        authorId: string;
        channel: {
            id: string;
            serverId: string | null;
        };
        channelId: string;
        content: string;
        id: string;
        isDeleted: boolean;
        isPinned: boolean;
    }>;
    unpin(messageId: string, userId: string): Promise<{
        id: string;
        channelId: string;
        authorId: string;
        replyToId: string | null;
        threadRootId: string | null;
        content: string;
        isPinned: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | {
        authorId: string;
        channel: {
            id: string;
            serverId: string | null;
        };
        channelId: string;
        content: string;
        id: string;
        isDeleted: boolean;
        isPinned: boolean;
    }>;
    search(serverId: string, userId: string, input: {
        q: string;
        channelId?: string;
        limit: number;
        offset: number;
    }): Promise<{
        messages: {
            id: string;
            channelId: string;
            authorId: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            rank: number;
        }[];
        total: number;
        offset: number;
        limit: number;
    }>;
    getThread(threadRootId: string, userId: string): Promise<{
        rootMessage: {
            channel: {
                id: string;
                serverId: string | null;
                categoryId: string | null;
                name: string;
                type: import("../../../prisma/generated/prisma/enums.js").ChannelType;
                topic: string | null;
                position: number;
            };
        } & {
            id: string;
            channelId: string;
            authorId: string;
            replyToId: string | null;
            threadRootId: string | null;
            content: string;
            isPinned: boolean;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        messages: ({
            attachments: {
                id: string;
                messageId: string | null;
                fileUrl: string;
                thumbnailUrl: string | null;
                fileType: string;
                fileSize: bigint;
                fileName: string;
            }[];
        } & {
            id: string;
            channelId: string;
            authorId: string;
            replyToId: string | null;
            threadRootId: string | null;
            content: string;
            isPinned: boolean;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        })[];
    }>;
}
export declare const messageService: MessageService;
export {};
//# sourceMappingURL=message.service.d.ts.map