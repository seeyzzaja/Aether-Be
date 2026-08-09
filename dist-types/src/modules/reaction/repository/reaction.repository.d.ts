export declare class ReactionRepository {
    create(data: {
        messageId: string;
        userId: string;
        emoji: string;
    }): Promise<{
        id: string;
        messageId: string;
        userId: string;
        emoji: string;
        createdAt: Date;
    }>;
    findByMessageUserEmoji(messageId: string, userId: string, emoji: string): Promise<{
        id: string;
        messageId: string;
        userId: string;
        emoji: string;
        createdAt: Date;
    } | null>;
    delete(messageId: string, userId: string, emoji: string): Promise<{
        id: string;
        messageId: string;
        userId: string;
        emoji: string;
        createdAt: Date;
    }>;
    findByMessageId(messageId: string): Promise<{
        id: string;
        messageId: string;
        userId: string;
        emoji: string;
        createdAt: Date;
    }[]>;
}
export declare const reactionRepository: ReactionRepository;
//# sourceMappingURL=reaction.repository.d.ts.map