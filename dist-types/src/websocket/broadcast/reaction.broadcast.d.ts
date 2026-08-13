export type ReactionBroadcastPayload = {
    id: string;
    messageId: string;
    userId: string;
    emoji: string;
    createdAt: Date;
};
export declare function broadcastReactionAdded(channelId: string, reaction: ReactionBroadcastPayload): void;
export declare function broadcastReactionRemoved(channelId: string, reaction: ReactionBroadcastPayload): void;
//# sourceMappingURL=reaction.broadcast.d.ts.map