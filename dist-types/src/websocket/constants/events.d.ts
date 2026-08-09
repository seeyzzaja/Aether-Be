export declare const WebSocketEvent: {
    readonly CONNECTED: "connected";
    readonly PING: "ping";
    readonly PONG: "pong";
    readonly SUBSCRIBE: "subscribe";
    readonly SUBSCRIBED: "subscribed";
    readonly UNSUBSCRIBE: "unsubscribe";
    readonly UNSUBSCRIBED: "unsubscribed";
    readonly MESSAGE_CREATED: "message.created";
    readonly MESSAGE_UPDATED: "message.updated";
    readonly MESSAGE_DELETED: "message.deleted";
    readonly MESSAGE_MENTION: "message.mention";
    readonly REACTION_ADDED: "reaction.added";
    readonly REACTION_REMOVED: "reaction.removed";
    readonly ERROR: "error";
};
export type WebSocketEventType = (typeof WebSocketEvent)[keyof typeof WebSocketEvent];
//# sourceMappingURL=events.d.ts.map