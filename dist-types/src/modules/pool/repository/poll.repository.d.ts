export declare class PollRepository {
    findMessageContext(messageId: string): Promise<{
        authorId: string;
        channel: {
            id: string;
            serverId: string;
        };
        channelId: string;
        id: string;
        isDeleted: boolean;
        poll: {
            id: string;
        } | null;
    } | null>;
    findPollContext(pollId: string): Promise<{
        allowMultipleChoice: boolean;
        expiresAt: Date | null;
        id: string;
        message: {
            channel: {
                id: string;
                serverId: string;
            };
            channelId: string;
            id: string;
            isDeleted: boolean;
        };
        messageId: string;
        options: {
            id: string;
            position: number;
            text: string;
        }[];
        question: string;
    } | null>;
    createPoll(messageId: string, input: {
        question: string;
        allowMultipleChoice: boolean;
        expiresAt?: Date | null;
        options: string[];
    }): Promise<{
        options: {
            id: string;
            pollId: string;
            text: string;
            position: number;
            createdAt: Date;
        }[];
    } & {
        id: string;
        messageId: string;
        question: string;
        allowMultipleChoice: boolean;
        expiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findVotesForUser(pollId: string, userId: string): Promise<{
        pollOptionId: string;
    }[]>;
    submitVotes(pollId: string, userId: string, optionIds: string[]): Promise<{
        id: string;
        pollOptionId: string;
        userId: string;
        createdAt: Date;
        pollId: string | null;
    }[]>;
    getPollResults(pollId: string, userId: string): Promise<{
        options: {
            id: string;
            text: string;
            position: number;
            voteCount: number;
            votedByCurrentUser: boolean;
        }[];
        allowMultipleChoice: boolean;
        expiresAt: Date | null;
        id: string;
        messageId: string;
        question: string;
    } | null>;
}
export declare const pollRepository: PollRepository;
//# sourceMappingURL=poll.repository.d.ts.map