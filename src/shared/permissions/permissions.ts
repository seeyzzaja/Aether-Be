export const Permission = {
  VIEW_CHANNEL: 1n << 0n,
  SEND_MESSAGES: 1n << 1n,
  MANAGE_MESSAGES: 1n << 2n,

  CONNECT: 1n << 3n,
  SPEAK: 1n << 4n,
  STREAM: 1n << 5n,

  CREATE_INVITE: 1n << 6n,

  MANAGE_CHANNELS: 1n << 7n,
  MANAGE_CATEGORIES: 1n << 8n,
  MANAGE_ROLES: 1n << 9n,

  KICK_MEMBERS: 1n << 10n,
  BAN_MEMBERS: 1n << 11n,

  MANAGE_SERVER: 1n << 12n,

  ADMINISTRATOR: 1n << 13n,

  ATTACH_FILES: 1n << 14n,

  MENTION_EVERYONE: 1n << 15n,
} as const;

export type PermissionValue = (typeof Permission)[keyof typeof Permission];
