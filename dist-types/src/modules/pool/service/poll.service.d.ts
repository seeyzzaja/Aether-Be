import type { CreatePollInput, SubmitVoteInput } from "../schema/poll.schema.js";
export declare class PollService {
    private getActorPermissions;
    private ensurePermission;
    create(messageId: string, userId: string, input: CreatePollInput): Promise<{
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
    vote(pollId: string, userId: string, input: SubmitVoteInput): Promise<{
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
    }>;
    private getServerOwner;
    private getMemberPermissions;
    private getChannelPermissions;
}
export declare const pollService: PollService;
//# sourceMappingURL=poll.service.d.ts.map