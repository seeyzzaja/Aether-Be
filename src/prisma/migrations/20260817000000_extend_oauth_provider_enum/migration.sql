-- Extend existing OAuthProvider enum for additional providers.
ALTER TYPE "OAuthProvider" ADD VALUE IF NOT EXISTS 'GITHUB';
ALTER TYPE "OAuthProvider" ADD VALUE IF NOT EXISTS 'FACEBOOK';
