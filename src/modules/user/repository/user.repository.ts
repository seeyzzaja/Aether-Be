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
