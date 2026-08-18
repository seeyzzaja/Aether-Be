import { config } from "#config/env";

const adminUserIds = new Set(
  config.ADMIN_USER_IDS.split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

export function isPlatformAdmin(userId: string): boolean {
  return adminUserIds.has(userId);
}
