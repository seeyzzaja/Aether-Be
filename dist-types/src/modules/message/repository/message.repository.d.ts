export declare class MessageRepository {
    create(data: {
        channelId: string;
        authorId: string;
        content: string;
        replyToId?: string | null;
        threadRootId?: string | null;
        attachments?: Array<{
            fileUrl: string;
            thumbnailUrl?: string | null;
            fileType: string;
            fileSize: number;
            fileName: string;
        }>;
    }): Promise<{
        attachments: {
            id: string;
            messageId: string;
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
    findById(messageId: string): Promise<{
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
    } | null>;
    findByIdWithChannel(messageId: string): Promise<({
        channel: {
            id: string;
            serverId: string;
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
    }) | null>;
    findReplyTarget(messageId: string): Promise<{
        authorId: string;
        channelId: string;
        content: string;
        id: string;
        isDeleted: boolean;
    } | null>;
    update(messageId: string, data: {
        content?: string;
        isPinned?: boolean;
    }): Promise<{
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
    softDelete(messageId: string): Promise<{
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
    findByChannelId(channelId: string, options?: {
        limit?: number;
        cursor?: string;
    }): Promise<{
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
    }[]>;
    findServerContext(messageId: string): Promise<{
        authorId: string;
        channel: {
            id: string;
            serverId: string;
        };
        channelId: string;
        content: string;
        id: string;
        isDeleted: boolean;
        isPinned: boolean;
    } | null>;
    findMemberPermissions(serverId: string, userId: string): Promise<{
        roles: {
            role: {
                permissionsBitmask: bigint;
            };
        }[];
    } | null>;
    findServerOwner(serverId: string): Promise<{
        ownerId: string;
    } | null>;
    findChannelById(channelId: string): Promise<{
        id: string;
        serverId: string;
    } | null>;
    findServerMember(serverId: string, userId: string): Promise<{
        userId: string;
    } | null>;
}
export declare const messageRepository: MessageRepository;
//# sourceMappingURL=message.repository.d.ts.map