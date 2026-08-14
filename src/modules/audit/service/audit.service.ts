import { auditRepository, type CreateAuditLogInput } from "../repository/audit.repository.js";

export class AuditService {
  async log(data: CreateAuditLogInput) {
    return auditRepository.create(data);
  }
}

export const auditService = new AuditService();
