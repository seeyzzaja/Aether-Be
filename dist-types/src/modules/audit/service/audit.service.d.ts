import { type CreateAuditLogInput } from "../repository/audit.repository.js";
export declare class AuditService {
    log(data: CreateAuditLogInput): Promise<{
        id: string;
        actorId: string | null;
        action: string;
        targetType: string;
        targetId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
    }>;
}
export declare const auditService: AuditService;
//# sourceMappingURL=audit.service.d.ts.map