-- CreateTable
CREATE TABLE "BookingEquipment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "equipmentId" TEXT,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingEquipment_bookingId_idx" ON "BookingEquipment"("bookingId");

-- CreateIndex
CREATE INDEX "BookingEquipment_equipmentId_idx" ON "BookingEquipment"("equipmentId");

-- AddForeignKey
ALTER TABLE "BookingEquipment" ADD CONSTRAINT "BookingEquipment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingEquipment" ADD CONSTRAINT "BookingEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
