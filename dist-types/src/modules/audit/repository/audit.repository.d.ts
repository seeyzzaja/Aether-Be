import { Prisma } from "#prisma/generated/prisma/client";
export type CreateAuditLogInput = {
    actorId?: string | null;
    action: string;
    targetType: string;
    targetId: string;
    metadata?: Prisma.InputJsonObject;
};
export declare const auditRepository: {
    create(data: CreateAuditLogInput): Promise<{
        id: string;
        actorId: string | null;
        action: string;
        targetType: string;
        targetId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
    }>;
};
//# sourceMappingURL=audit.repository.d.ts.map