-- Add nullable email verification timestamp for suspicious-link checks
ALTER TABLE "User"
ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);
