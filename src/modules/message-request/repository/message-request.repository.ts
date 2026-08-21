import type { Prisma } from "#prisma/generated/prisma/client";
import prisma from "#utils/prisma";

const userSelect = {
  id: true,
  email: true,
  username: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class MessageRequestRepository {
  async findById(requestId: string) {
    return prisma.messageRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        sender: {
          select: userSelect,
        },
        receiver: {
          select: userSelect,
        },
      },
    });
  }

  async findBySenderAndReceiver(senderId: string, receiverId: string) {
    return prisma.messageRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
      include: {
        sender: {
          select: userSelect,
        },
        receiver: {
          select: userSelect,
        },
      },
    });
  }

  async findPendingBySenderAndReceiver(senderId: string, receiverId: string) {
    return prisma.messageRequest.findFirst({
      where: {
        senderId,
        receiverId,
        status: "PENDING",
      },
      include: {
        sender: {
          select: userSelect,
        },
        receiver: {
          select: userSelect,
        },
      },
    });
  }

  async findPendingReceivedByUserId(receiverId: string) {
    return prisma.messageRequest.findMany({
      where: {
        receiverId,
        status: "PENDING",
      },
      include: {
        sender: {
          select: userSelect,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(senderId: string, receiverId: string, conversationId: string) {
    return prisma.messageRequest.create({
      data: {
        senderId,
        receiverId,
        conversationId,
        status: "PENDING",
      },
      include: {
        sender: {
          select: userSelect,
        },
        receiver: {
          select: userSelect,
        },
      },
    });
  }

  async updateStatus(requestId: string, status: "ACCEPTED" | "REJECTED") {
    return prisma.messageRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status,
      },
      include: {
        sender: {
          select: userSelect,
        },
        receiver: {
          select: userSelect,
        },
      },
    });
  }
  async updateStatusWithTx(
    tx: Prisma.TransactionClient,
    requestId: string,
    status: "ACCEPTED" | "REJECTED",
  ) {
    return tx.messageRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status,
      },
      include: {
        sender: {
          select: userSelect,
        },
        receiver: {
          select: userSelect,
        },
      },
    });
  }
}

export const messageRequestRepository = new MessageRequestRepository();
