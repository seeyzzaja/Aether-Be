-- CreateEnum
CREATE TYPE "DmParticipantStatus" AS ENUM ('accepted', 'pending_request');

-- DropIndex
DROP INDEX "dm_participants_userId_joinedAt_idx";

-- AlterTable
ALTER TABLE "dm_participants" ADD COLUMN     "status" "DmParticipantStatus" NOT NULL DEFAULT 'accepted';

-- CreateIndex
CREATE INDEX "dm_participants_userId_status_joinedAt_idx" ON "dm_participants"("userId", "status", "joinedAt" DESC);
