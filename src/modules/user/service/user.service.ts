import { areUsersFriends } from "#modules/friend/repository/friend.repository";
import {
  createBlock,
  deleteBlock,
  findBlockedUser,
  findUserById,
  isUserBlocked,
  updateDmPrivacy,
} from "#modules/user/repository/user.repository";
import { ConflictError, ForbiddenError, NotFoundError } from "#shared/errors/app-error";
export async function ensureUsersAreNotBlocked(userIdA: string, userIdB: string) {
  const blocked = await isUserBlocked(userIdA, userIdB);

  if (blocked) {
    throw new ForbiddenError("Tidak dapat melakukan tindakan ini");
  }
}

export async function blockUser(actorId: string, targetUserId: string) {
  if (actorId === targetUserId) {
    throw new ConflictError("Tidak dapat memblokir diri sendiri");
  }

  const targetUser = await findUserById(targetUserId);

  if (!targetUser) {
    throw new NotFoundError("User tidak ditemukan");
  }

  return createBlock(actorId, targetUserId);
}

export async function unblockUser(actorId: string, targetUserId: string) {
  if (actorId === targetUserId) {
    throw new ConflictError("Tidak dapat membuka blokir diri sendiri");
  }

  const targetUser = await findUserById(targetUserId);

  if (!targetUser) {
    throw new NotFoundError("User tidak ditemukan");
  }

  const existingBlock = await findBlockedUser(actorId, targetUserId);

  if (!existingBlock) {
    throw new NotFoundError("User tersebut tidak sedang diblokir");
  }

  await deleteBlock(actorId, targetUserId);

  return {
    success: true,
  };
}

export async function setDmPrivacy(actorId: string, dmPrivacy: "EVERYONE" | "FRIENDS_ONLY") {
  return updateDmPrivacy(actorId, dmPrivacy);
}
export async function ensureCanSendDirectMessage(
  actorId: string,
  targetUserId: string,
  dmPrivacy: "EVERYONE" | "FRIENDS_ONLY",
) {
  if (dmPrivacy === "EVERYONE") {
    return true;
  }

  return areUsersFriends(actorId, targetUserId);
}
