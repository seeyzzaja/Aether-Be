import { Worker } from "bullmq";
import { type EmailNotificationJob } from "#shared/queue/email.queue";
export declare const emailWorker: Worker<EmailNotificationJob, any, string, import("bullmq").RedisQueueBackend>;
//# sourceMappingURL=email.worker.d.ts.map