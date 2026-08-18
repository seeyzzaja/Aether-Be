import type { UploadConfirmInput, UploadSignatureInput } from "#modules/upload/schema/upload.schema";
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
    confirmUpload(userId: string, input: UploadConfirmInput): Promise<{
        channelId: string;
        fileUrl: any;
        thumbnailUrl: null;
        fileType: string;
        fileSize: any;
        fileName: string;
        publicId: any;
        resourceType: any;
        format: any;
    }>;
}
export declare const uploadService: UploadService;
//# sourceMappingURL=upload.service.d.ts.map