-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "minSessionHours" INTEGER NOT NULL DEFAULT 1,
    "maxSessionHours" INTEGER NOT NULL DEFAULT 3,
    "openTime" TEXT NOT NULL DEFAULT '07:00',
    "closeTime" TEXT NOT NULL DEFAULT '23:00',
    "allowSameDayBooking" BOOLEAN NOT NULL DEFAULT true,
    "maxAdvanceDays" INTEGER NOT NULL DEFAULT 30,
    "cancellationPolicy" TEXT NOT NULL DEFAULT 'free-until-h1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
