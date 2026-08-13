import { type PresenceStatus } from "#modules/presence/repository/presence.repository";
export type PublicPresenceStatus = "online" | "offline" | "idle" | "dnd";
export declare function getPublicPresenceStatus(status: PresenceStatus): PublicPresenceStatus;
export declare function updatePresence(userId: string, status: PresenceStatus): Promise<void>;
export declare function getUserPresence(userId: string): Promise<PresenceStatus | null>;
//# sourceMappingURL=presence.service.d.ts.map