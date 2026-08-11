import nodemailer from "nodemailer";

import { config } from "#config/env";
import type { SendEmailInput } from "#shared/email/email.types";

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: config.EMAIL_PORT === 465,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 10_000,
});

export async function sendEmail(input: SendEmailInput): Promise<void> {
  await transporter.sendMail({
    from: config.EMAIL_FROM,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}
