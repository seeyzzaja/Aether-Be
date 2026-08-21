-- CreateEnum
CREATE TYPE "MessageRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "message_requests" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "status" "MessageRequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "message_requests_receiver_id_status_idx" ON "message_requests"("receiver_id", "status");

-- CreateIndex
CREATE INDEX "message_requests_sender_id_status_idx" ON "message_requests"("sender_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "message_requests_sender_id_receiver_id_key" ON "message_requests"("sender_id", "receiver_id");

-- AddForeignKey
ALTER TABLE "message_requests" ADD CONSTRAINT "message_requests_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_requests" ADD CONSTRAINT "message_requests_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
