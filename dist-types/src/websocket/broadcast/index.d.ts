export * from "./reaction.broadcast.js";
export { broadcastMessageCreated, broadcastMessageDeleted, broadcastMessageUpdated, } from "#websocket/broadcast/message.broadcast";
type MessageMentionPayload = {
    messageId: string;
    channelId: string;
    serverId: string;
    authorId: string;
    mentionedUserId: string;
};
export declare function broadcastMessageMention(payload: MessageMentionPayload): void;
//# sourceMappingURL=index.d.ts.map