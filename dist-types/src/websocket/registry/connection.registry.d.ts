import type { AuthenticatedSocket } from "#websocket/types/socket";
export declare class ConnectionRegistry {
    private readonly channels;
    subscribe(channelId: string, socket: AuthenticatedSocket): void;
    unsubscribe(channelId: string, socket: AuthenticatedSocket): void;
    getConnections(channelId: string): ReadonlySet<AuthenticatedSocket>;
    removeSocket(socket: AuthenticatedSocket): void;
    dump(): void;
}
//# sourceMappingURL=connection.registry.d.ts.map