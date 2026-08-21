import {
  acceptFriendship,
  createFriendship,
  deleteFriendship,
  findFriendship,
  findFriendshipById,
  findFriendshipsByUserId,
  findUserById,
  isPrismaUniqueConstraintError,
} from "#modules/friend/repository/friend.repository";
import { getUserPresence } from "#modules/presence/service/presence.service";
import { ConflictError, ForbiddenError, NotFoundError } from "#shared/errors/app-error";

function canonicalizeUserPair(userIdA: string, userIdB: string) {
  return userIdA < userIdB
    ? {
        userOneId: userIdA,
        userTwoId: userIdB,
      }
    : {
        userOneId: userIdB,
        userTwoId: userIdA,
      };
}

export async function sendFriendRequest(actorId: string, targetUserId: string) {
  if (actorId === targetUserId) {
    throw new ConflictError("Tidak dapat mengirim permintaan pertemanan kepada diri sendiri");
  }

  const targetUser = await findUserById(targetUserId);

  if (!targetUser) {
    throw new NotFoundError("User tidak ditemukan");
  }

  const { userOneId, userTwoId } = canonicalizeUserPair(actorId, targetUserId);

  const existingFriendship = await findFriendship(userOneId, userTwoId);

  if (existingFriendship) {
    if (existingFriendship.status === "ACCEPTED") {
      throw new ConflictError("Kalian sudah berteman");
    }

    if (existingFriendship.status === "BLOCKED") {
      throw new ConflictError("Permintaan pertemanan tidak dapat dikirim");
    }

    if (existingFriendship.status === "PENDING") {
      if (existingFriendship.actionUserId === actorId) {
        throw new ConflictError("Permintaan pertemanan sudah dikirim");
      }

      return acceptFriendship(existingFriendship.id, actorId);
    }
  }

  try {
    return await createFriendship({
      userOneId,
      userTwoId,
      actionUserId: actorId,
    });
  } catch (error) {
    if (!isPrismaUniqueConstraintError(error)) {
      throw error;
    }

    const friendshipAfterConflict = await findFriendship(userOneId, userTwoId);

    if (!friendshipAfterConflict) {
      throw error;
    }

    if (friendshipAfterConflict.status === "ACCEPTED") {
      throw new ConflictError("Kalian sudah berteman");
    }

    if (friendshipAfterConflict.status === "BLOCKED") {
      throw new ConflictError("Permintaan pertemanan tidak dapat dikirim");
    }

    if (friendshipAfterConflict.actionUserId === actorId) {
      throw new ConflictError("Permintaan pertemanan sudah dikirim");
    }

    return acceptFriendship(friendshipAfterConflict.id, actorId);
  }
}

export async function acceptFriendRequest(actorId: string, friendshipId: string) {
  const friendship = await findFriendshipById(friendshipId);

  if (!friendship) {
    throw new NotFoundError("Permintaan pertemanan tidak ditemukan");
  }

  if (friendship.status !== "PENDING") {
    throw new ConflictError("Permintaan pertemanan sudah tidak dapat diterima");
  }

  if (friendship.actionUserId === actorId) {
    throw new ForbiddenError("Anda tidak dapat menerima permintaan yang Anda kirim sendiri");
  }

  if (friendship.userOneId !== actorId && friendship.userTwoId !== actorId) {
    throw new ForbiddenError("Anda bukan bagian dari permintaan pertemanan ini");
  }

  return acceptFriendship(friendship.id, actorId);
}

export async function deleteFriendRequest(actorId: string, friendshipId: string) {
  const friendship = await findFriendshipById(friendshipId);

  if (!friendship) {
    throw new NotFoundError("Permintaan pertemanan tidak ditemukan");
  }

  if (friendship.userOneId !== actorId && friendship.userTwoId !== actorId) {
    throw new ForbiddenError("Anda bukan bagian dari permintaan pertemanan ini");
  }

  if (friendship.status !== "PENDING") {
    throw new ConflictError(
      friendship.status === "ACCEPTED"
        ? "Kalian sudah berteman. Gunakan endpoint hapus teman"
        : "Permintaan pertemanan tidak dapat dihapus",
    );
  }

  return deleteFriendship(friendship.id);
}

export async function removeFriend(actorId: string, targetUserId: string) {
  if (actorId === targetUserId) {
    throw new ConflictError("Tidak dapat menghapus diri sendiri dari daftar teman");
  }

  const { userOneId, userTwoId } = canonicalizeUserPair(actorId, targetUserId);

  const friendship = await findFriendship(userOneId, userTwoId);

  if (!friendship) {
    throw new NotFoundError("Pertemanan tidak ditemukan");
  }

  if (friendship.status !== "ACCEPTED") {
    throw new ConflictError("User tersebut bukan teman Anda");
  }

  return deleteFriendship(friendship.id);
}

export async function getFriends(actorId: string, tab: "online" | "all" | "pending" | "blocked") {
  const friendships = await findFriendshipsByUserId(actorId);

  if (tab === "pending") {
    const incoming = friendships.filter(
      (friendship) => friendship.status === "PENDING" && friendship.actionUserId !== actorId,
    );

    const outgoing = friendships.filter(
      (friendship) => friendship.status === "PENDING" && friendship.actionUserId === actorId,
    );

    return {
      incoming: incoming.map((friendship) => ({
        id: friendship.id,
        user: friendship.userOneId === actorId ? friendship.userTwo : friendship.userOne,
        createdAt: friendship.createdAt,
        updatedAt: friendship.updatedAt,
      })),
      outgoing: outgoing.map((friendship) => ({
        id: friendship.id,
        user: friendship.userOneId === actorId ? friendship.userTwo : friendship.userOne,
        createdAt: friendship.createdAt,
        updatedAt: friendship.updatedAt,
      })),
    };
  }

  const filtered = friendships.filter((friendship) => {
    if (tab === "all" || tab === "online") {
      return friendship.status === "ACCEPTED";
    }

    if (tab === "blocked") {
      return friendship.status === "BLOCKED";
    }

    return false;
  });

  const friends = await Promise.all(
    filtered.map(async (friendship) => {
      const user = friendship.userOneId === actorId ? friendship.userTwo : friendship.userOne;

      const presence = await getUserPresence(user.id);

      return {
        friendshipId: friendship.id,
        user,
        status: friendship.status,
        presence:
          presence === "invisible" || presence === "offline" || presence === null
            ? "offline"
            : presence,
        createdAt: friendship.createdAt,
        updatedAt: friendship.updatedAt,
      };
    }),
  );

  if (tab === "online") {
    return friends.filter((friend) => friend.presence !== "offline");
  }

  return friends;
}
