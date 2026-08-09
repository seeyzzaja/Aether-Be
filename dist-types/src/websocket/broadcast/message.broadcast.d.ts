type MessageBroadcastPayload = {
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
type MessageMentionPayload = {
    messageId: string;
    channelId: string;
    serverId: string;
    authorId: string;
    mentionedUserId: string;
};
export declare function broadcastMessageCreated(message: MessageBroadcastPayload): void;
export declare function broadcastMessageUpdated(message: MessageBroadcastPayload): void;
export declare function broadcastMessageDeleted(message: MessageBroadcastPayload): void;
export declare function broadcastMessageMention(payload: MessageMentionPayload): void;
export {};
//# sourceMappingURL=message.broadcast.d.ts.map