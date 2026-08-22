import { conversationRepository } from "#modules/conversation/repository/conversation.repository";
import { areUsersFriends, findUserById } from "#modules/friend/repository/friend.repository";
import { messageRequestRepository } from "#modules/message-request/repository/message-request.repository";
import { ensureUsersAreNotBlocked } from "#modules/user/service/user.service";
import { Prisma } from "#prisma/generated/prisma/client";
import { ConflictError, ForbiddenError, NotFoundError } from "#shared/errors/app-error";
import prisma from "#utils/prisma";

function getDirectMessageName(userA: { username: string }, userB: { username: string }) {
  return `${userA.username} - ${userB.username}`;
}

const userSelect = {
  id: true,
  email: true,
  username: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function createMessageRequest(actorId: string, targetUserId: string) {
  if (actorId === targetUserId) {
    throw new ConflictError("Tidak dapat mengirim message request kepada diri sendiri");
  }

  const [actorUser, targetUser] = await Promise.all([
    findUserById(actorId),
    findUserById(targetUserId),
  ]);

  if (!targetUser) {
    throw new NotFoundError("User tidak ditemukan");
  }

  if (!actorUser) {
    throw new NotFoundError("User pengirim tidak ditemukan");
  }

  await ensureUsersAreNotBlocked(actorId, targetUserId);

  const alreadyFriends = await areUsersFriends(actorId, targetUserId);

  if (alreadyFriends) {
    throw new ConflictError("Kamu sudah berteman dengan user tersebut");
  }

  const sortedIds = [actorId, targetUserId].sort();
  const lockKey = sortedIds.join(":");

  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`
        SELECT pg_advisory_xact_lock(hashtext(${lockKey}))
      `;

      const existingRequest = await tx.messageRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId: actorId,
            receiverId: targetUserId,
          },
        },
      });

      if (existingRequest) {
        if (existingRequest.status === "PENDING") {
          throw new ConflictError("Message request sudah dikirim");
        }

        if (existingRequest.status === "ACCEPTED") {
          throw new ConflictError("Message request tersebut sudah diterima");
        }
      }

      const existingConversation = await conversationRepository.findDirectMessagePairWithTx(
        tx,
        actorId,
        targetUserId,
      );

      const conversation = existingConversation
        ? await (async () => {
            await conversationRepository.updateDmParticipantStatusWithTx(
              tx,
              existingConversation.id,
              actorId,
              "accepted",
            );

            await conversationRepository.updateDmParticipantStatusWithTx(
              tx,
              existingConversation.id,
              targetUserId,
              "pending_request",
            );

            const result = await tx.channel.findUnique({
              where: {
                id: existingConversation.id,
              },
              include: {
                dmParticipants: {
                  include: {
                    user: {
                      select: userSelect,
                    },
                  },
                  orderBy: {
                    joinedAt: "asc",
                  },
                },
              },
            });

            if (!result) {
              throw new NotFoundError("Conversation untuk message request tidak ditemukan");
            }

            return result;
          })()
        : await conversationRepository.createDirectMessageWithTx(tx, {
            name: getDirectMessageName(actorUser, targetUser),
            senderId: actorId,
            receiverId: targetUserId,
            receiverStatus: "pending_request",
          });

      let request: Awaited<ReturnType<typeof tx.messageRequest.update>>;

      if (existingRequest) {
        request = await tx.messageRequest.update({
          where: {
            id: existingRequest.id,
          },
          data: {
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
      } else {
        request = await tx.messageRequest.create({
          data: {
            senderId: actorId,
            receiverId: targetUserId,
            conversationId: conversation.id,
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

      return {
        status: "pending_request" as const,
        request,
        conversation,
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}

export async function getPendingMessageRequests(userId: string) {
  return messageRequestRepository.findPendingReceivedByUserId(userId);
}

export async function acceptMessageRequest(actorId: string, requestId: string) {
  return prisma.$transaction(
    async (tx) => {
      const request = await tx.messageRequest.findUnique({
        where: {
          id: requestId,
        },
      });

      if (!request) {
        throw new NotFoundError("Message request tidak ditemukan");
      }

      if (request.receiverId !== actorId) {
        throw new ForbiddenError("Kamu tidak dapat menerima message request ini");
      }

      if (request.status !== "PENDING") {
        throw new ConflictError("Message request sudah tidak berstatus pending");
      }

      await ensureUsersAreNotBlocked(request.senderId, request.receiverId);

      if (!request.conversationId) {
        throw new NotFoundError("Conversation untuk message request tidak ditemukan");
      }

      const conversation = await conversationRepository.findConversationByIdWithTx(
        tx,
        request.conversationId,
      );

      if (!conversation) {
        throw new NotFoundError("Conversation untuk message request tidak ditemukan");
      }

      const receiverParticipant = conversation.dmParticipants.find(
        (participant) => participant.user.id === request.receiverId,
      );

      if (!receiverParticipant) {
        throw new NotFoundError("Receiver bukan participant pada conversation tersebut");
      }

      if (receiverParticipant.status === "accepted") {
        throw new ConflictError("Participant message request sudah diterima");
      }

      await conversationRepository.updateDmParticipantStatusWithTx(
        tx,
        conversation.id,
        request.receiverId,
        "accepted",
      );

      return messageRequestRepository.updateStatusWithTx(tx, requestId, "ACCEPTED");
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}

export async function rejectMessageRequest(actorId: string, requestId: string) {
  return prisma.$transaction(
    async (tx) => {
      const request = await tx.messageRequest.findUnique({
        where: {
          id: requestId,
        },
      });

      if (!request) {
        throw new NotFoundError("Message request tidak ditemukan");
      }

      if (request.receiverId !== actorId) {
        throw new ForbiddenError("Kamu tidak dapat menolak message request ini");
      }

      if (request.status !== "PENDING") {
        throw new ConflictError("Message request sudah tidak berstatus pending");
      }

      if (!request.conversationId) {
        throw new NotFoundError("Conversation untuk message request tidak ditemukan");
      }

      const conversation = await conversationRepository.findConversationByIdWithTx(
        tx,
        request.conversationId,
      );

      if (!conversation) {
        throw new NotFoundError("Conversation untuk message request tidak ditemukan");
      }

      // PENTING:
      // Jangan hapus participant receiver.
      //
      // Receiver tetap berada di conversation dengan status
      // pending_request. Dengan begitu ketika sender mengirim
      // request lagi, conversation lama dapat ditemukan dan
      // dipakai kembali.
      await conversationRepository.updateDmParticipantStatusWithTx(
        tx,
        conversation.id,
        request.receiverId,
        "pending_request",
      );

      return messageRequestRepository.updateStatusWithTx(tx, requestId, "REJECTED");
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}

export async function getMessageRequestById(actorId: string, requestId: string) {
  const request = await messageRequestRepository.findById(requestId);

  if (!request) {
    throw new NotFoundError("Message request tidak ditemukan");
  }

  if (request.senderId !== actorId && request.receiverId !== actorId) {
    throw new ForbiddenError("Kamu tidak dapat mengakses message request ini");
  }

  return request;
}
