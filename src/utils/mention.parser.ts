const MENTION_REGEX =
  /<@([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})>/g;
const ROLE_MENTION_REGEX =
  /<@&([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})>/g;

export function parseMentions(content: string): string[] {
  const mentionedUserIds = new Set<string>();

  for (const match of content.matchAll(MENTION_REGEX)) {
    const userId = match[1];

    if (userId) {
      mentionedUserIds.add(userId);
    }
  }

  return [...mentionedUserIds];
}

export function parseRoleMentions(content: string): string[] {
  const mentionedRoleIds = new Set<string>();

  for (const match of content.matchAll(ROLE_MENTION_REGEX)) {
    const roleId = match[1];

    if (roleId) {
      mentionedRoleIds.add(roleId);
    }
  }

  return [...mentionedRoleIds];
}
