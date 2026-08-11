import { Queue } from "bullmq";
export declare const EMAIL_QUEUE_NAME = "email-notification";
export interface EmailNotificationJob {
    to: string;
    subject: string;
    text: string;
    html: string;
}
export declare const emailQueue: Queue<EmailNotificationJob, any, string, EmailNotificationJob, any, string, import("bullmq").RedisQueueBackend>;
//# sourceMappingURL=email.queue.d.ts.map