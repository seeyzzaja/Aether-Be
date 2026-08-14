import { z } from "zod";
declare const MAX_FILE_SIZE: number;
declare const SUPPORTED_MIME_TYPES: readonly ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "video/mp4", "video/webm", "video/quicktime", "audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "application/pdf", "application/zip", "application/x-zip-compressed"];
export declare const uploadSignatureSchema: z.ZodObject<{
    fileName: z.ZodString;
    fileType: z.ZodString;
    fileSize: z.ZodNumber;
}, z.core.$strip>;
export type UploadSignatureInput = z.infer<typeof uploadSignatureSchema>;
export declare const uploadConfirmSchema: z.ZodObject<{
    channelId: z.ZodString;
    publicId: z.ZodString;
    secureUrl: z.ZodString;
    fileName: z.ZodString;
    fileType: z.ZodString;
    fileSize: z.ZodNumber;
    resourceType: z.ZodString;
    format: z.ZodString;
}, z.core.$strip>;
export type UploadConfirmInput = z.infer<typeof uploadConfirmSchema>;
export { MAX_FILE_SIZE, SUPPORTED_MIME_TYPES };
//# sourceMappingURL=upload.schema.d.ts.map