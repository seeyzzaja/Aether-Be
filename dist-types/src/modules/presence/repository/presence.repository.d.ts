export declare const PRESENCE_KEY_PREFIX = "presence:user";
export declare const PRESENCE_STATUSES: readonly ["online", "offline", "idle", "dnd", "invisible"];
export type PresenceStatus = (typeof PRESENCE_STATUSES)[number];
type PresenceState = {
    status: PresenceStatus;
};
export declare function incrementPresenceConnections(userId: string): Promise<number>;
export declare function decrementPresenceConnections(userId: string): Promise<number>;
export declare function getPresenceConnections(userId: string): Promise<number>;
export declare function setPresence(userId: string, status: PresenceStatus): Promise<void>;
export declare function getPresence(userId: string): Promise<PresenceState | null>;
export declare function deletePresence(userId: string): Promise<void>;
export {};
//# sourceMappingURL=presence.repository.d.ts.map