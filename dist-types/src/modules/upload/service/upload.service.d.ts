import type { UploadSignatureInput } from "#modules/upload/schema/upload.schema";
export declare class UploadService {
    private getActorPermissions;
    createSignature(userId: string, channelId: string, input: UploadSignatureInput): Promise<{
        signature: string;
        timestamp: number;
        apiKey: string;
        cloudName: string;
        folder: string;
        resourceType: string;
        uploadUrl: string;
        fileName: string;
        fileType: string;
        fileSize: number;
    }>;
}
export declare const uploadService: UploadService;
//# sourceMappingURL=upload.service.d.ts.map