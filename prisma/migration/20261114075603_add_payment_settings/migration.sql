-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "paymentWindowMinutes" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "taxPercent" INTEGER NOT NULL DEFAULT 11;
