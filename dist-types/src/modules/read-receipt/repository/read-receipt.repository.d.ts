export declare const readReceiptRepository: {
    findChannel(channelId: string): import("../../../prisma/generated/prisma/models.js").Prisma__ChannelClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../prisma/generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findMessage(messageId: string): import("../../../prisma/generated/prisma/models.js").Prisma__MessageClient<{
        channelId: string;
        id: string;
        isDeleted: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../prisma/generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    upsertReadState(userId: string, channelId: string, messageId: string): import("../../../prisma/generated/prisma/models.js").Prisma__ChannelReadStateClient<{
        message: {
            id: string;
        } | null;
    } & {
        id: string;
        userId: string;
        channelId: string;
        lastReadMessageId: string | null;
        readAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../prisma/generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findReadState(userId: string, channelId: string): import("../../../prisma/generated/prisma/models.js").Prisma__ChannelReadStateClient<({
        message: {
            id: string;
        } | null;
    } & {
        id: string;
        userId: string;
        channelId: string;
        lastReadMessageId: string | null;
        readAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../prisma/generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
};
//# sourceMappingURL=read-receipt.repository.d.ts.map