import prisma from "#utils/prisma";

export async function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      dmPrivacy: true,
    },
  });
}
export async function findUserProfile(userId: string, actorId: string) {
  const [user, mutualServers, actorFriendships, targetFriendships, friendship, blockedRelation] =
    await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          username: true,
          bio: true,
        },
      }),

      prisma.server.findMany({
        where: {
          members: {
            some: {
              userId: actorId,
            },
          },
          AND: {
            members: {
              some: {
                userId,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.friendship.findMany({
        where: {
          status: "ACCEPTED",
          OR: [
            {
              userOneId: actorId,
            },
            {
              userTwoId: actorId,
            },
          ],
        },
        select: {
          userOneId: true,
          userTwoId: true,
        },
      }),

      prisma.friendship.findMany({
        where: {
          status: "ACCEPTED",
          OR: [
            {
              userOneId: userId,
            },
            {
              userTwoId: userId,
            },
          ],
        },
        select: {
          userOneId: true,
          userTwoId: true,
        },
      }),

      prisma.friendship.findFirst({
        where: {
          OR: [
            {
              userOneId: actorId,
              userTwoId: userId,
            },
            {
              userOneId: userId,
              userTwoId: actorId,
            },
          ],
          status: {
            in: ["PENDING", "ACCEPTED"],
          },
        },
        select: {
          status: true,
        },
      }),

      prisma.blockedUser.findFirst({
        where: {
          OR: [
            {
              blockerId: actorId,
              blockedId: userId,
            },
            {
              blockerId: userId,
              blockedId: actorId,
            },
          ],
        },
        select: {
          id: true,
        },
      }),
    ]);

  if (!user) {
    return null;
  }

  const actorFriendIds = new Set<string>();

  for (const relation of actorFriendships) {
    const friendId = relation.userOneId === actorId ? relation.userTwoId : relation.userOneId;

    actorFriendIds.add(friendId);
  }

  const mutualFriendIds = new Set<string>();

  for (const relation of targetFriendships) {
    const friendId = relation.userOneId === userId ? relation.userTwoId : relation.userOneId;

    if (actorFriendIds.has(friendId)) {
      mutualFriendIds.add(friendId);
    }
  }

  const mutualFriends =
    mutualFriendIds.size === 0
      ? []
      : await prisma.user.findMany({
          where: {
            id: {
              in: [...mutualFriendIds],
            },
          },
          select: {
            id: true,
            username: true,
            bio: true,
          },
          orderBy: {
            username: "asc",
          },
        });

  let relationshipStatus: "none" | "pending" | "friends" | "blocked" = "none";

  if (blockedRelation) {
    relationshipStatus = "blocked";
  } else if (friendship?.status === "ACCEPTED") {
    relationshipStatus = "friends";
  } else if (friendship?.status === "PENDING") {
    relationshipStatus = "pending";
  }

  return {
    ...user,
    mutualServers,
    mutualFriends,
    relationshipStatus,
  };
}
export async function findBlockedUser(blockerId: string, blockedId: string) {
  return prisma.blockedUser.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId,
        blockedId,
      },
    },
  });
}

export async function isUserBlocked(userIdA: string, userIdB: string) {
  const blockedUser = await prisma.blockedUser.findFirst({
    where: {
      OR: [
        {
          blockerId: userIdA,
          blockedId: userIdB,
        },
        {
          blockerId: userIdB,
          blockedId: userIdA,
        },
      ],
    },
    select: {
      id: true,
    },
  });

  return blockedUser !== null;
}

export async function createBlock(blockerId: string, blockedId: string) {
  return prisma.$transaction(async (tx) => {
    const blockedUser = await tx.blockedUser.upsert({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
      update: {},
      create: {
        blockerId,
        blockedId,
      },
    });

    const userOneId = blockerId < blockedId ? blockerId : blockedId;
    const userTwoId = blockerId < blockedId ? blockedId : blockerId;

    await tx.friendship.deleteMany({
      where: {
        userOneId,
        userTwoId,
      },
    });

    return blockedUser;
  });
}

export async function deleteBlock(blockerId: string, blockedId: string) {
  return prisma.blockedUser.deleteMany({
    where: {
      blockerId,
      blockedId,
    },
  });
}

export async function updateDmPrivacy(userId: string, dmPrivacy: "EVERYONE" | "FRIENDS_ONLY") {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      dmPrivacy,
    },
    select: {
      id: true,
      username: true,
      dmPrivacy: true,
    },
  });
}
