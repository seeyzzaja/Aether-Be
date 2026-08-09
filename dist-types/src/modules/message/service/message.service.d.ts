import type { CreateMessageInput, UpdateMessageInput } from "#modules/message/schema/message.schema.js";
export declare class MessageService {
    private getActorPermissions;
    private ensureSendMessagesPermission;
    private getMessage;
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
            serverId: string;
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
            serverId: string;
        };
        channelId: string;
        content: string;
        id: string;
        isDeleted: boolean;
        isPinned: boolean;
    }>;
}
export declare const messageService: MessageService;
//# sourceMappingURL=message.service.d.ts.map