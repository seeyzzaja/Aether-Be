import { Queue } from "bullmq";

import { queueConnection } from "#shared/queue/redis.connection";

export const EMAIL_QUEUE_NAME = "email-notification";

export interface EmailNotificationJob {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const emailQueue = new Queue<EmailNotificationJob>(EMAIL_QUEUE_NAME, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: false,
  },
});
