import prisma from "#utils/prisma";

export class PollRepository {
  async findMessageContext(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
      select: {
        id: true,
        channelId: true,
        authorId: true,
        isDeleted: true,
        channel: {
          select: {
            id: true,
            serverId: true,
          },
        },
        poll: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async findPollContext(pollId: string) {
    return prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      select: {
        id: true,
        messageId: true,
        question: true,
        allowMultipleChoice: true,
        expiresAt: true,
        message: {
          select: {
            id: true,
            channelId: true,
            isDeleted: true,
            channel: {
              select: {
                id: true,
                serverId: true,
              },
            },
          },
        },
        options: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            text: true,
            position: true,
          },
        },
      },
    });
  }

  async createPoll(
    messageId: string,
    input: {
      question: string;
      allowMultipleChoice: boolean;
      expiresAt?: Date | null;
      options: string[];
    },
  ) {
    return prisma.$transaction(async (tx) => {
      const poll = await tx.poll.create({
        data: {
          messageId,
          question: input.question,
          allowMultipleChoice: input.allowMultipleChoice,
          expiresAt: input.expiresAt ?? null,
          options: {
            create: input.options.map((text, index) => ({
              text,
              position: index,
            })),
          },
        },
        include: {
          options: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      return poll;
    });
  }

  async findVotesForUser(pollId: string, userId: string) {
    return prisma.pollVote.findMany({
      where: {
        pollOption: {
          pollId,
        },
        userId,
      },
      select: {
        pollOptionId: true,
      },
    });
  }

  async submitVotes(pollId: string, userId: string, optionIds: string[]) {
    return prisma.$transaction(
      async (tx) => {
        const existingVotes = await tx.pollVote.findMany({
          where: {
            userId,
            pollOption: {
              pollId,
            },
          },
          select: {
            pollOptionId: true,
          },
        });

        const existingOptionIds = new Set(existingVotes.map((vote) => vote.pollOptionId));

        const duplicateOptionIds = optionIds.filter((optionId) => existingOptionIds.has(optionId));

        if (duplicateOptionIds.length > 0) {
          throw new Error("DUPLICATE_POLL_VOTE");
        }

        const votes = await Promise.all(
          optionIds.map((optionId) =>
            tx.pollVote.create({
              data: {
                pollOptionId: optionId,
                userId,
              },
            }),
          ),
        );

        return votes;
      },
      {
        isolationLevel: "Serializable",
      },
    );
  }

  async getPollResults(pollId: string, userId: string) {
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      select: {
        id: true,
        messageId: true,
        question: true,
        allowMultipleChoice: true,
        expiresAt: true,
        options: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            text: true,
            position: true,
            _count: {
              select: {
                votes: true,
              },
            },
          },
        },
      },
    });

    if (!poll) {
      return null;
    }

    const userVotes = await prisma.pollVote.findMany({
      where: {
        userId,
        pollOption: {
          pollId,
        },
      },
      select: {
        pollOptionId: true,
      },
    });

    return {
      ...poll,
      options: poll.options.map((option) => ({
        id: option.id,
        text: option.text,
        position: option.position,
        voteCount: option._count.votes,
        votedByCurrentUser: userVotes.some((vote) => vote.pollOptionId === option.id),
      })),
    };
  }
}

export const pollRepository = new PollRepository();
