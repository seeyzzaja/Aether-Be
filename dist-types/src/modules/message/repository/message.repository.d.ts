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
            serverId: string | null;
            categoryId: string | null;
            name: string;
            type: import("#prisma/generated/prisma/client").ChannelType;
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
    }): Promise<({
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
    })[]>;
    findServerContext(messageId: string): Promise<{
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
    } | null>;
    findMemberPermissions(serverId: string, userId: string): Promise<{
        roles: {
            role: {
                permissionsBitmask: bigint;
            };
        }[];
    } | null>;
    findChannelPermissions(channelId: string, serverId: string, userId: string): Promise<bigint | null>;
    findServerOwner(serverId: string): Promise<{
        ownerId: string;
    } | null>;
    findChannelById(channelId: string): Promise<{
        id: string;
        serverId: string | null;
        type: import("#prisma/generated/prisma/client").ChannelType;
    } | null>;
    search(serverId: string, query: string, options?: {
        channelId?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        id: string;
        channelId: string;
        authorId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        rank: number;
    }[]>;
    searchByChannel(channelId: string, query: string, options?: {
        limit?: number;
        offset?: number;
    }): Promise<{
        id: string;
        channelId: string;
        authorId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        rank: number;
    }[]>;
    countSearchByChannel(channelId: string, query: string): Promise<number>;
    countSearch(serverId: string, query: string, channelId?: string): Promise<number>;
    findServerMember(serverId: string, userId: string): Promise<{
        userId: string;
    } | null>;
    findThreadMessages(threadRootId: string): Promise<({
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
    })[]>;
    findForwardSource(messageId: string): Promise<{
        attachments: {
            fileName: string;
            fileSize: bigint;
            fileType: string;
            fileUrl: string;
            thumbnailUrl: string | null;
        }[];
        authorId: string;
        channel: {
            id: string;
            serverId: string | null;
        };
        channelId: string;
        content: string;
        id: string;
        isDeleted: boolean;
    } | null>;
    findUserTrustProfile(userId: string): Promise<{
        createdAt: Date;
        emailVerifiedAt: Date | null;
        id: string;
    } | null>;
    findDmParticipant(channelId: string, userId: string): Promise<{
        channelId: string;
        userId: string;
    } | null>;
    findDmParticipants(channelId: string): Promise<{
        channelId: string;
        userId: string;
    }[]>;
}
export declare const messageRepository: MessageRepository;
//# sourceMappingURL=message.repository.d.ts.map