-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- CreateTable
CREATE TABLE "friendships" (
    "id" TEXT NOT NULL,
    "user_one_id" TEXT NOT NULL,
    "user_two_id" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "action_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "friendships_user_one_id_status_idx" ON "friendships"("user_one_id", "status");

-- CreateIndex
CREATE INDEX "friendships_user_two_id_status_idx" ON "friendships"("user_two_id", "status");

-- CreateIndex
CREATE INDEX "friendships_action_user_id_idx" ON "friendships"("action_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "friendships_user_one_id_user_two_id_key" ON "friendships"("user_one_id", "user_two_id");

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_one_id_fkey" FOREIGN KEY ("user_one_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_two_id_fkey" FOREIGN KEY ("user_two_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_action_user_id_fkey" FOREIGN KEY ("action_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
