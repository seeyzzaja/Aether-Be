import { emailQueue } from "#shared/queue/email.queue";

await emailQueue.add("test-email", {
  to: "seeyzzaja@gmail.com",
  subject: "Aether Email Test",
  text: "Email test dari Aether.",
  html: `
    <h1>Aether Email Test</h1>
    <p>Email ini berhasil dikirim melalui BullMQ.</p>
  `,
});

console.log("Email job berhasil masuk queue");

process.exit(0);
