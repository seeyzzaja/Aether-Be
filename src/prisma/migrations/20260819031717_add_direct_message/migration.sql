-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ChannelType" ADD VALUE 'DM';
ALTER TYPE "ChannelType" ADD VALUE 'GROUP_DM';

-- AlterTable
ALTER TABLE "channels" ALTER COLUMN "serverId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "dm_participants" (
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dm_participants_pkey" PRIMARY KEY ("channelId","userId")
);

-- CreateIndex
CREATE INDEX "dm_participants_userId_joinedAt_idx" ON "dm_participants"("userId", "joinedAt" DESC);

-- AddForeignKey
ALTER TABLE "dm_participants" ADD CONSTRAINT "dm_participants_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dm_participants" ADD CONSTRAINT "dm_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
