-- AlterTable
ALTER TABLE "User"
ADD COLUMN "bio" TEXT;

-- AlterTable
ALTER TABLE "message_requests"
ADD COLUMN "conversation_id" TEXT;

-- Backfill existing message requests that have a matching DM conversation.
UPDATE "message_requests" mr
SET "conversation_id" = matched.conversation_id
FROM (
  SELECT DISTINCT ON (mr_inner.id)
    mr_inner.id AS request_id,
    c.id AS conversation_id
  FROM "message_requests" mr_inner
  JOIN "channels" c
    ON c.type = 'DM'
    AND c."serverId" IS NULL
  JOIN "dm_participants" dp_sender
    ON dp_sender."channelId" = c.id
    AND dp_sender."userId" = mr_inner.sender_id
  JOIN "dm_participants" dp_receiver
    ON dp_receiver."channelId" = c.id
    AND dp_receiver."userId" = mr_inner.receiver_id
  WHERE mr_inner."conversation_id" IS NULL
  ORDER BY mr_inner.id, c.id
) matched
WHERE mr.id = matched.request_id;

-- AddForeignKey
ALTER TABLE "message_requests"
ADD CONSTRAINT "message_requests_conversation_id_fkey"
FOREIGN KEY ("conversation_id")
REFERENCES "channels"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;