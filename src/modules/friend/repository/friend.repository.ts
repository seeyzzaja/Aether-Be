import { Prisma } from "#prisma/generated/prisma/client";
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
    },
  });
}

export async function findFriendship(userOneId: string, userTwoId: string) {
  return prisma.friendship.findUnique({
    where: {
      userOneId_userTwoId: {
        userOneId,
        userTwoId,
      },
    },
  });
}

export async function findFriendshipById(id: string) {
  return prisma.friendship.findUnique({
    where: {
      id,
    },
  });
}

export async function createFriendship(data: {
  userOneId: string;
  userTwoId: string;
  actionUserId: string;
}) {
  return prisma.friendship.create({
    data: {
      userOneId: data.userOneId,
      userTwoId: data.userTwoId,
      actionUserId: data.actionUserId,
      status: "PENDING",
    },
  });
}

export async function acceptFriendship(friendshipId: string, actionUserId: string) {
  return prisma.friendship.update({
    where: {
      id: friendshipId,
    },
    data: {
      status: "ACCEPTED",
      actionUserId,
    },
  });
}

export async function deleteFriendship(friendshipId: string) {
  return prisma.friendship.delete({
    where: {
      id: friendshipId,
    },
  });
}

export async function findFriendshipsByUserId(userId: string) {
  return prisma.friendship.findMany({
    where: {
      OR: [{ userOneId: userId }, { userTwoId: userId }],
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      userOne: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      userTwo: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
}

export function isPrismaUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
