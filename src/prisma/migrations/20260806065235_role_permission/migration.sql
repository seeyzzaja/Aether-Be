/*
  Warnings:

  - You are about to drop the column `roleId` on the `ServerMember` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ServerMember" DROP CONSTRAINT "ServerMember_roleId_fkey";

-- DropIndex
DROP INDEX "ServerMember_roleId_idx";

-- AlterTable
ALTER TABLE "ServerMember" DROP COLUMN "roleId";

-- CreateTable
CREATE TABLE "ChannelPermissionOverride" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "allowBitmask" BIGINT NOT NULL DEFAULT 0,
    "denyBitmask" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChannelPermissionOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerMemberRole" (
    "id" TEXT NOT NULL,
    "serverMemberId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerMemberRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChannelPermissionOverride_channelId_idx" ON "ChannelPermissionOverride"("channelId");

-- CreateIndex
CREATE INDEX "ChannelPermissionOverride_roleId_idx" ON "ChannelPermissionOverride"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelPermissionOverride_channelId_roleId_key" ON "ChannelPermissionOverride"("channelId", "roleId");

-- CreateIndex
CREATE INDEX "ServerMemberRole_serverMemberId_idx" ON "ServerMemberRole"("serverMemberId");

-- CreateIndex
CREATE INDEX "ServerMemberRole_roleId_idx" ON "ServerMemberRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerMemberRole_serverMemberId_roleId_key" ON "ServerMemberRole"("serverMemberId", "roleId");

-- AddForeignKey
ALTER TABLE "ChannelPermissionOverride" ADD CONSTRAINT "ChannelPermissionOverride_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelPermissionOverride" ADD CONSTRAINT "ChannelPermissionOverride_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMemberRole" ADD CONSTRAINT "ServerMemberRole_serverMemberId_fkey" FOREIGN KEY ("serverMemberId") REFERENCES "ServerMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMemberRole" ADD CONSTRAINT "ServerMemberRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
