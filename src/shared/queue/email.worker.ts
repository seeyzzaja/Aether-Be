import { Worker } from "bullmq";
import { sendEmail } from "#shared/email/email.service";
import { EMAIL_QUEUE_NAME, type EmailNotificationJob } from "#shared/queue/email.queue";
import { queueConnection } from "#shared/queue/redis.connection";

export const emailWorker = new Worker<EmailNotificationJob>(
  EMAIL_QUEUE_NAME,
  async (job) => {
    console.log(`[EMAIL] Sending job ${job.id} to ${job.data.to}`);

    await sendEmail(job.data);

    console.log(`[EMAIL] Job ${job.id} sent successfully`);
  },
  {
    connection: queueConnection,
    concurrency: 5,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`[EMAIL] Job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  console.error(`[EMAIL] Job ${job?.id ?? "unknown"} failed:`, error);
});

emailWorker.on("error", (error) => {
  console.error("[EMAIL] Worker error:", error);
});
