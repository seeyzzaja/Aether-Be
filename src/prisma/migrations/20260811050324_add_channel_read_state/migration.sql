-- CreateTable
CREATE TABLE "channel_read_states" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "lastReadMessageId" TEXT,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_read_states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "channel_read_states_channelId_idx" ON "channel_read_states"("channelId");

-- CreateIndex
CREATE INDEX "channel_read_states_lastReadMessageId_idx" ON "channel_read_states"("lastReadMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "channel_read_states_userId_channelId_key" ON "channel_read_states"("userId", "channelId");

-- AddForeignKey
ALTER TABLE "channel_read_states" ADD CONSTRAINT "channel_read_states_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_read_states" ADD CONSTRAINT "channel_read_states_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_read_states" ADD CONSTRAINT "channel_read_states_lastReadMessageId_fkey" FOREIGN KEY ("lastReadMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
