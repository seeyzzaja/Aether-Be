-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "search_vector" tsvector;

-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "search_vector" tsvector;
