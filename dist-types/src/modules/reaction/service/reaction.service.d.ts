export declare class ReactionService {
    private getMessage;
    add(messageId: string, userId: string, emoji: string): Promise<{
        id: string;
        messageId: string;
        userId: string;
        emoji: string;
        createdAt: Date;
    }>;
    remove(messageId: string, userId: string, emoji: string): Promise<{
        id: string;
        messageId: string;
        userId: string;
        emoji: string;
        createdAt: Date;
    }>;
    list(messageId: string, userId: string): Promise<{
        id: string;
        messageId: string;
        userId: string;
        emoji: string;
        createdAt: Date;
    }[]>;
    private ensureServerMember;
}
export declare const reactionService: ReactionService;
//# sourceMappingURL=reaction.service.d.ts.map