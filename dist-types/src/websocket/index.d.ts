export declare function startWebSocketServer(port: number): Promise<{
    wss: import("ws").Server<typeof import("ws").WebSocket, typeof import("node:http").IncomingMessage>;
    close: () => Promise<void>;
}>;
//# sourceMappingURL=index.d.ts.map