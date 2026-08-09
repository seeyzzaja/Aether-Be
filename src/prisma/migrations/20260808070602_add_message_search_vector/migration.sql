/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_replyToId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_threadRootId_fkey";

-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "replyToId" TEXT,
    "threadRootId" TEXT,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "searchVector" tsvector,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messages_channelId_createdAt_idx" ON "messages"("channelId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "messages_replyToId_idx" ON "messages"("replyToId");

-- CreateIndex
CREATE INDEX "messages_threadRootId_idx" ON "messages"("threadRootId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_threadRootId_fkey" FOREIGN KEY ("threadRootId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
