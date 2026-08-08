const MENTION_REGEX =
  /<@([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})>/g;

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
