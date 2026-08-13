import type { AuthenticatedSocket } from "#websocket/types/socket";
export declare class ConnectionRegistry {
    private readonly channels;
    private readonly users;
    subscribe(channelId: string, socket: AuthenticatedSocket): void;
    unsubscribe(channelId: string, socket: AuthenticatedSocket): void;
    getConnections(channelId: string): ReadonlySet<AuthenticatedSocket>;
    addUserSocket(socket: AuthenticatedSocket): void;
    removeUserSocket(socket: AuthenticatedSocket): void;
    getUserConnections(userId: string): ReadonlySet<AuthenticatedSocket>;
    hasUserConnections(userId: string): boolean;
    removeSocket(socket: AuthenticatedSocket): void;
    dump(): void;
}
//# sourceMappingURL=connection.registry.d.ts.map