import type { UpdateReadReceiptInput } from "../schema/read-receipt.schema.js";
export declare class ReadReceiptService {
    update(channelId: string, userId: string, input: UpdateReadReceiptInput): Promise<{
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
    }>;
    get(channelId: string, userId: string): Promise<({
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
    }) | null>;
}
export declare const readReceiptService: ReadReceiptService;
//# sourceMappingURL=read-receipt.service.d.ts.map