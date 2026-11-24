-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "popularityRank" INTEGER;
