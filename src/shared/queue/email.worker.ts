import { Worker } from "bullmq";
import { sendEmail } from "#shared/email/email.service";
import { logger } from "#shared/logger/logger";
import { EMAIL_QUEUE_NAME, type EmailNotificationJob } from "#shared/queue/email.queue";
import { queueConnection } from "#shared/queue/redis.connection";

export const emailWorker = new Worker<EmailNotificationJob>(
  EMAIL_QUEUE_NAME,
  async (job) => {
    logger.info(
      {
        jobId: job.id,
        to: job.data.to,
      },
      "Sending email job",
    );

    await sendEmail(job.data);

    logger.info(
      {
        jobId: job.id,
      },
      "Email job sent successfully",
    );
  },
  {
    connection: queueConnection,
    concurrency: 5,
  },
);

emailWorker.on("completed", (job) => {
  logger.info(
    {
      jobId: job.id,
    },
    "Email job completed",
  );
});

emailWorker.on("failed", (job, error) => {
  logger.error(
    {
      jobId: job?.id,
      err: error,
    },
    "Email job failed",
  );
});

emailWorker.on("error", (error) => {
  logger.error(
    {
      err: error,
    },
    "Email worker error",
  );
});
