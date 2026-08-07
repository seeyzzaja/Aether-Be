export declare const WebSocketEvent: {
    readonly CONNECTED: "connected";
    readonly PING: "ping";
    readonly PONG: "pong";
    readonly SUBSCRIBE: "subscribe";
    readonly SUBSCRIBED: "subscribed";
    readonly UNSUBSCRIBE: "unsubscribe";
    readonly UNSUBSCRIBED: "unsubscribed";
    readonly ERROR: "error";
};
export type WebSocketEventType = (typeof WebSocketEvent)[keyof typeof WebSocketEvent];
//# sourceMappingURL=events.d.ts.map