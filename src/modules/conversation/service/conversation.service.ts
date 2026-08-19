import { Prisma } from "#prisma/generated/prisma/client";
import { BadRequestError, ForbiddenError, NotFoundError } from "#shared/errors/app-error";
import prisma from "#utils/prisma";
import { conversationRepository } from "../repository/conversation.repository.js";
import type {
  CreateDirectMessageInput,
  CreateGroupConversationInput,
} from "../schema/conversation.schema.js";

type ConversationWithParticipants = {
  dmParticipants: Array<{
    joinedAt: Date;
    user: {
      id: string;
      email: string;
      username: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
} & Record<string, unknown>;

function getDirectMessageName(userA: { username: string }, userB: { username: string }) {
  return `${userA.username} - ${userB.username}`;
}

export class ConversationService {
  private async ensureTargetUserExists(userId: string) {
    const user = await conversationRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundError("User target tidak ditemukan");
    }

    return user;
  }

  private async ensureConversationParticipant(conversationId: string, userId: string) {
    const conversation = await conversationRepository.findConversationByParticipant(
      conversationId,
      userId,
    );

    if (!conversation) {
      throw new ForbiddenError("Kamu bukan participant pada conversation ini");
    }

    return conversation;
  }

  private formatConversation(conversation: ConversationWithParticipants) {
    return {
      ...conversation,
      participants: conversation.dmParticipants.map((participant) => participant.user),
    };
  }

  async createDirectMessage(actorId: string, input: CreateDirectMessageInput) {
    if (actorId === input.userId) {
      throw new BadRequestError("Tidak bisa membuat DM dengan diri sendiri");
    }

    const [actorUser, targetUser] = await Promise.all([
      this.ensureTargetUserExists(actorId),
      this.ensureTargetUserExists(input.userId),
    ]);

    const sortedIds = [actorId, input.userId].sort();
    const lockKey = sortedIds.join(":");

    return prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(hashtext(${lockKey}))
        `;

        const existing = await conversationRepository.findDirectMessagePair(actorId, input.userId);

        if (existing) {
          return existing;
        }

        return tx.channel.create({
          data: {
            type: "DM",
            serverId: null,
            categoryId: null,
            name: getDirectMessageName(actorUser, targetUser),
            dmParticipants: {
              create: [{ userId: actorId }, { userId: input.userId }],
            },
          },
          include: {
            dmParticipants: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    username: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
              orderBy: {
                joinedAt: "asc",
              },
            },
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  async getConversations(userId: string) {
    const conversations = await conversationRepository.findConversationsByUserId(userId);

    return conversations.map((conversation) => ({
      ...conversation,
      participants: conversation.dmParticipants.map((participant) => participant.user),
    }));
  }

  async getConversation(conversationId: string, userId: string) {
    const conversation = await this.ensureConversationParticipant(conversationId, userId);

    return this.formatConversation(conversation);
  }

  async createGroupConversation(actorId: string, input: CreateGroupConversationInput) {
    const targetUserIds = [...new Set(input.userIds)];

    if (targetUserIds.includes(actorId)) {
      throw new BadRequestError("Creator tidak boleh dimasukkan ke userIds");
    }

    if (targetUserIds.length < 2) {
      throw new BadRequestError("Minimal dua participant diperlukan untuk Group DM");
    }

    const [actorUser, ...targetUsers] = await Promise.all([
      this.ensureTargetUserExists(actorId),
      ...targetUserIds.map(async (userId) => {
        const user = await conversationRepository.findUserById(userId);

        if (!user) {
          throw new NotFoundError(`User dengan ID ${userId} tidak ditemukan`);
        }

        return user;
      }),
    ]);

    const participantIds = [actorId, ...targetUserIds];
    const groupName =
      input.name?.trim() || [actorUser, ...targetUsers].map((user) => user.username).join(", ");

    return prisma.$transaction(async (tx) => {
      return tx.channel.create({
        data: {
          type: "GROUP_DM",
          serverId: null,
          categoryId: null,
          name: groupName,
          dmParticipants: {
            create: participantIds.map((userId) => ({ userId })),
          },
        },
        include: {
          dmParticipants: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  username: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
            orderBy: {
              joinedAt: "asc",
            },
          },
        },
      });
    });
  }
}

export const conversationService = new ConversationService();
