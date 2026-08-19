import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly AuditLog: 'AuditLog';
    readonly AuthToken: 'AuthToken';
    readonly Category: 'Category';
    readonly ChannelPermissionOverride: 'ChannelPermissionOverride';
    readonly ChannelReadState: 'ChannelReadState';
    readonly Channel: 'Channel';
    readonly DmParticipant: 'DmParticipant';
    readonly MessageAttachment: 'MessageAttachment';
    readonly Message: 'Message';
    readonly Notification: 'Notification';
    readonly OAuthAccount: 'OAuthAccount';
    readonly Poll: 'Poll';
    readonly PollOption: 'PollOption';
    readonly PollVote: 'PollVote';
    readonly Reaction: 'Reaction';
    readonly Role: 'Role';
    readonly ServerMemberRole: 'ServerMemberRole';
    readonly ServerMember: 'ServerMember';
    readonly Server: 'Server';
    readonly Session: 'Session';
    readonly User: 'User';
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: 'ReadUncommitted';
    readonly ReadCommitted: 'ReadCommitted';
    readonly RepeatableRead: 'RepeatableRead';
    readonly Serializable: 'Serializable';
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const AuditLogScalarFieldEnum: {
    readonly id: 'id';
    readonly actorId: 'actorId';
    readonly action: 'action';
    readonly targetType: 'targetType';
    readonly targetId: 'targetId';
    readonly metadata: 'metadata';
    readonly createdAt: 'createdAt';
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const AuthTokenScalarFieldEnum: {
    readonly id: 'id';
    readonly userId: 'userId';
    readonly type: 'type';
    readonly tokenHash: 'tokenHash';
    readonly expiresAt: 'expiresAt';
    readonly usedAt: 'usedAt';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type AuthTokenScalarFieldEnum = (typeof AuthTokenScalarFieldEnum)[keyof typeof AuthTokenScalarFieldEnum];
export declare const CategoryScalarFieldEnum: {
    readonly id: 'id';
    readonly serverId: 'serverId';
    readonly name: 'name';
    readonly position: 'position';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];
export declare const ChannelPermissionOverrideScalarFieldEnum: {
    readonly id: 'id';
    readonly channelId: 'channelId';
    readonly roleId: 'roleId';
    readonly allowBitmask: 'allowBitmask';
    readonly denyBitmask: 'denyBitmask';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type ChannelPermissionOverrideScalarFieldEnum = (typeof ChannelPermissionOverrideScalarFieldEnum)[keyof typeof ChannelPermissionOverrideScalarFieldEnum];
export declare const ChannelReadStateScalarFieldEnum: {
    readonly id: 'id';
    readonly userId: 'userId';
    readonly channelId: 'channelId';
    readonly lastReadMessageId: 'lastReadMessageId';
    readonly readAt: 'readAt';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type ChannelReadStateScalarFieldEnum = (typeof ChannelReadStateScalarFieldEnum)[keyof typeof ChannelReadStateScalarFieldEnum];
export declare const ChannelScalarFieldEnum: {
    readonly id: 'id';
    readonly serverId: 'serverId';
    readonly categoryId: 'categoryId';
    readonly name: 'name';
    readonly type: 'type';
    readonly topic: 'topic';
    readonly position: 'position';
};
export type ChannelScalarFieldEnum = (typeof ChannelScalarFieldEnum)[keyof typeof ChannelScalarFieldEnum];
export declare const DmParticipantScalarFieldEnum: {
    readonly channelId: 'channelId';
    readonly userId: 'userId';
    readonly joinedAt: 'joinedAt';
};
export type DmParticipantScalarFieldEnum = (typeof DmParticipantScalarFieldEnum)[keyof typeof DmParticipantScalarFieldEnum];
export declare const MessageAttachmentScalarFieldEnum: {
    readonly id: 'id';
    readonly messageId: 'messageId';
    readonly fileUrl: 'fileUrl';
    readonly thumbnailUrl: 'thumbnailUrl';
    readonly fileType: 'fileType';
    readonly fileSize: 'fileSize';
    readonly fileName: 'fileName';
};
export type MessageAttachmentScalarFieldEnum = (typeof MessageAttachmentScalarFieldEnum)[keyof typeof MessageAttachmentScalarFieldEnum];
export declare const MessageScalarFieldEnum: {
    readonly id: 'id';
    readonly channelId: 'channelId';
    readonly authorId: 'authorId';
    readonly replyToId: 'replyToId';
    readonly threadRootId: 'threadRootId';
    readonly content: 'content';
    readonly isPinned: 'isPinned';
    readonly isDeleted: 'isDeleted';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
    readonly deletedAt: 'deletedAt';
};
export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: 'id';
    readonly userId: 'userId';
    readonly type: 'type';
    readonly payload: 'payload';
    readonly isRead: 'isRead';
    readonly createdAt: 'createdAt';
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const OAuthAccountScalarFieldEnum: {
    readonly id: 'id';
    readonly userId: 'userId';
    readonly provider: 'provider';
    readonly providerAccountId: 'providerAccountId';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type OAuthAccountScalarFieldEnum = (typeof OAuthAccountScalarFieldEnum)[keyof typeof OAuthAccountScalarFieldEnum];
export declare const PollScalarFieldEnum: {
    readonly id: 'id';
    readonly messageId: 'messageId';
    readonly question: 'question';
    readonly allowMultipleChoice: 'allowMultipleChoice';
    readonly expiresAt: 'expiresAt';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type PollScalarFieldEnum = (typeof PollScalarFieldEnum)[keyof typeof PollScalarFieldEnum];
export declare const PollOptionScalarFieldEnum: {
    readonly id: 'id';
    readonly pollId: 'pollId';
    readonly text: 'text';
    readonly position: 'position';
    readonly createdAt: 'createdAt';
};
export type PollOptionScalarFieldEnum = (typeof PollOptionScalarFieldEnum)[keyof typeof PollOptionScalarFieldEnum];
export declare const PollVoteScalarFieldEnum: {
    readonly id: 'id';
    readonly pollOptionId: 'pollOptionId';
    readonly userId: 'userId';
    readonly createdAt: 'createdAt';
    readonly pollId: 'pollId';
};
export type PollVoteScalarFieldEnum = (typeof PollVoteScalarFieldEnum)[keyof typeof PollVoteScalarFieldEnum];
export declare const ReactionScalarFieldEnum: {
    readonly id: 'id';
    readonly messageId: 'messageId';
    readonly userId: 'userId';
    readonly emoji: 'emoji';
    readonly createdAt: 'createdAt';
};
export type ReactionScalarFieldEnum = (typeof ReactionScalarFieldEnum)[keyof typeof ReactionScalarFieldEnum];
export declare const RoleScalarFieldEnum: {
    readonly id: 'id';
    readonly serverId: 'serverId';
    readonly name: 'name';
    readonly color: 'color';
    readonly permissionsBitmask: 'permissionsBitmask';
    readonly position: 'position';
    readonly isDefault: 'isDefault';
};
export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum];
export declare const ServerMemberRoleScalarFieldEnum: {
    readonly id: 'id';
    readonly serverMemberId: 'serverMemberId';
    readonly roleId: 'roleId';
    readonly createdAt: 'createdAt';
};
export type ServerMemberRoleScalarFieldEnum = (typeof ServerMemberRoleScalarFieldEnum)[keyof typeof ServerMemberRoleScalarFieldEnum];
export declare const ServerMemberScalarFieldEnum: {
    readonly id: 'id';
    readonly serverId: 'serverId';
    readonly userId: 'userId';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type ServerMemberScalarFieldEnum = (typeof ServerMemberScalarFieldEnum)[keyof typeof ServerMemberScalarFieldEnum];
export declare const ServerScalarFieldEnum: {
    readonly id: 'id';
    readonly ownerId: 'ownerId';
    readonly name: 'name';
    readonly iconUrl: 'iconUrl';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type ServerScalarFieldEnum = (typeof ServerScalarFieldEnum)[keyof typeof ServerScalarFieldEnum];
export declare const SessionScalarFieldEnum: {
    readonly id: 'id';
    readonly userId: 'userId';
    readonly refreshTokenHash: 'refreshTokenHash';
    readonly expiresAt: 'expiresAt';
    readonly revokedAt: 'revokedAt';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
    readonly deviceInfo: 'deviceInfo';
    readonly ipAddress: 'ipAddress';
};
export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: 'id';
    readonly email: 'email';
    readonly username: 'username';
    readonly passwordHash: 'passwordHash';
    readonly emailVerifiedAt: 'emailVerifiedAt';
    readonly emailNotificationEnabled: 'emailNotificationEnabled';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
    readonly deletedAt: 'deletedAt';
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: 'asc';
    readonly desc: 'desc';
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: 'default';
    readonly insensitive: 'insensitive';
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const NullsOrder: {
    readonly first: 'first';
    readonly last: 'last';
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map