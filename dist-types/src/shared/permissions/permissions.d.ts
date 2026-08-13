export declare const Permission: {
    readonly VIEW_CHANNEL: bigint;
    readonly SEND_MESSAGES: bigint;
    readonly MANAGE_MESSAGES: bigint;
    readonly CONNECT: bigint;
    readonly SPEAK: bigint;
    readonly STREAM: bigint;
    readonly CREATE_INVITE: bigint;
    readonly MANAGE_CHANNELS: bigint;
    readonly MANAGE_CATEGORIES: bigint;
    readonly MANAGE_ROLES: bigint;
    readonly KICK_MEMBERS: bigint;
    readonly BAN_MEMBERS: bigint;
    readonly MANAGE_SERVER: bigint;
    readonly ADMINISTRATOR: bigint;
    readonly ATTACH_FILES: bigint;
};
export type PermissionValue = (typeof Permission)[keyof typeof Permission];
//# sourceMappingURL=permissions.d.ts.map