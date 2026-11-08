-- AlterTable
ALTER TABLE "Court" ADD COLUMN     "maxPlayers" INTEGER DEFAULT 4;

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "facilities" TEXT[] DEFAULT ARRAY[]::TEXT[];
